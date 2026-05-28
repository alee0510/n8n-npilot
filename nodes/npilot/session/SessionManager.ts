// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { Page, chromium, firefox, webkit } from 'playwright';
import { randomUUID } from 'crypto';
import type { BrowserType, SessionOptions, Session } from '../types/Session.types';

// Constants
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_SESSIONS = 5;
const GC_INTERVAL_MS = 30_000;

/**
 * SessionManager is a process-level singleton.
 * It maintains a map of live Playwright sessions keyed by session ID.
 * Each n8n workflow execution passes a session ID between nodes.
 */
class SessionManager {
	private static instance: SessionManager;
	private sessions = new Map<string, Session>();
	private gcTimer: NodeJS.Timeout | null = null;

	private constructor() {
		this.startGC();
	}

	/**
	 * Returns the singleton instance of SessionManager, creating it on first call.
	 */
	static getInstance(): SessionManager {
		if (!SessionManager.instance) {
			SessionManager.instance = new SessionManager();
		}
		return SessionManager.instance;
	}

	// --- Public API ---

	/**
	 * Launches a new browser session and returns its unique session ID.
	 *
	 * If the session pool is full, the oldest idle session is evicted first.
	 * Throws if the pool is still at capacity after eviction.
	 *
	 * @param opts - Optional configuration for the browser, viewport, headers, and TTL.
	 * @returns A UUID that identifies the newly created session.
	 */
	async openSession(opts: SessionOptions = {}): Promise<string> {
		if (this.sessions.size >= MAX_SESSIONS) {
			// Evict the oldest idle session before refusing
			this.evictOldest();
			if (this.sessions.size >= MAX_SESSIONS) {
				throw new Error(
					`Max concurrent browser sessions (${MAX_SESSIONS}) reached. ` +
						`Close an existing session or increase MAX_SESSIONS.`,
				);
			}
		}

		const browserType = opts.browserType ?? 'chromium';
		const engine = this.pickEngine(browserType);
		const executablePath = browserType === 'chromium' ? opts.executablePath : undefined;
		const browser = await engine.launch({
			headless: opts.headless ?? true,
			...(executablePath ? { executablePath } : {}),
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage', // required in Docker
			],
		});

		const context = await browser.newContext({
			viewport: opts.viewport ?? { width: 1280, height: 800 },
			userAgent: opts.userAgent,
			extraHTTPHeaders: opts.extraHTTPHeaders,
		});

		const page = await context.newPage();
		const id = randomUUID();

		this.sessions.set(id, {
			id,
			browser,
			context,
			page,
			lastUsedAt: Date.now(),
			ttlMs: opts.ttlMs ?? DEFAULT_TTL_MS,
		});

		return id;
	}

	/**
	 * Retrieves the Playwright `Page` associated with the given session ID.
	 *
	 * Also resets the session's idle timer so it is not garbage-collected
	 * while actively in use.
	 *
	 * @param sessionId - The UUID of the session to look up.
	 * @returns The active Playwright `Page` for that session.
	 * @throws If the session does not exist or has already been closed.
	 */
	getPage(sessionId: string): Page {
		const session = this.requireSession(sessionId);
		session.lastUsedAt = Date.now(); // reset idle timer on use
		return session.page;
	}

	/**
	 * Closes the browser for the given session and removes it from the pool.
	 *
	 * No-ops silently if the session ID is not found.
	 *
	 * @param sessionId - The UUID of the session to close.
	 */
	async closeSession(sessionId: string): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (!session) return;
		await this.destroySession(session);
		this.sessions.delete(sessionId);
	}

	/**
	 * Closes every active session in the pool concurrently.
	 *
	 * Useful for graceful shutdown or test teardown.
	 */
	async closeAll(): Promise<void> {
		const ids = [...this.sessions.keys()];
		await Promise.all(ids.map((id) => this.closeSession(id)));
	}

	/**
	 * Returns a summary of all active sessions.
	 *
	 * @returns An array of objects containing each session's ID and the
	 *   timestamp (ms since epoch) it was last accessed.
	 */
	listSessions(): Array<{ id: string; lastUsedAt: number }> {
		return [...this.sessions.values()].map((s) => ({
			id: s.id,
			lastUsedAt: s.lastUsedAt,
		}));
	}

	// --- Internals ---

	/**
	 * Looks up a session by ID and throws a descriptive error if it is missing.
	 *
	 * @param id - The UUID of the session to retrieve.
	 * @throws If no session with the given ID exists in the pool.
	 */
	private requireSession(id: string): Session {
		const session = this.sessions.get(id);
		if (!session) {
			throw new Error(
				`Session "${id}" not found. ` +
					`It may have expired or been closed. Use a Browser Open node to create a new session.`,
			);
		}
		return session;
	}

	/**
	 * Maps a `BrowserType` enum value to the corresponding Playwright browser engine.
	 *
	 * @param type - The desired browser type (`CHROMIUM`, `FIREFOX`, or `WEBKIT`).
	 * @returns The Playwright launcher for that engine; defaults to Chromium.
	 */
	private pickEngine(type: BrowserType) {
		switch (type) {
			case 'firefox':
				return firefox;
			case 'webkit':
				return webkit;
			default:
				return chromium;
		}
	}

	/**
	 * Closes the underlying Playwright browser for a session.
	 *
	 * Errors from `browser.close()` are swallowed because the browser may
	 * already be closed (e.g. crashed or force-killed).
	 *
	 * @param session - The session whose browser should be closed.
	 */
	private async destroySession(session: Session): Promise<void> {
		try {
			await session.browser.close();
		} catch {
			/* already closed */
		}
	}

	/**
	 * Finds the least-recently-used session and destroys it.
	 *
	 * Called when the pool is full before opening a new session, giving the
	 * new session a slot without raising a hard error.
	 */
	private evictOldest(): void {
		let oldest: Session | null = null;
		for (const s of this.sessions.values()) {
			if (!oldest || s.lastUsedAt < oldest.lastUsedAt) oldest = s;
		}
		if (oldest) {
			this.destroySession(oldest);
			this.sessions.delete(oldest.id);
		}
	}

	/**
	 * Starts the background garbage-collection timer.
	 *
	 * Every `GC_INTERVAL_MS` milliseconds, any session that has been idle
	 * longer than its configured `ttlMs` is automatically destroyed and
	 * removed from the pool.
	 *
	 * The timer is `unref`-ed so it does not prevent the Node.js process
	 * from exiting when no other work is pending.
	 */
	private startGC(): void {
		// eslint-disable-next-line @n8n/community-nodes/no-restricted-globals
		this.gcTimer = setInterval(() => {
			const now = Date.now();
			for (const [id, session] of this.sessions.entries()) {
				if (now - session.lastUsedAt > session.ttlMs) {
					this.destroySession(session);
					this.sessions.delete(id);
				}
			}
		}, GC_INTERVAL_MS);

		// Don't keep the process alive just for GC
		if (this.gcTimer.unref) this.gcTimer.unref();
	}
}

export const sessionManager = SessionManager.getInstance();
