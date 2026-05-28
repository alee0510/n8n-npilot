// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { Browser, BrowserContext, Page } from 'playwright';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export type SessionOptions = {
	browserType?: BrowserType;
	headless?: boolean;
	viewport?: { width: number; height: number };
	userAgent?: string;
	extraHTTPHeaders?: Record<string, string>;
	ttlMs?: number; // idle TTL before auto-close
	executablePath?: string; // path to a system-provided browser binary
};

export interface Session {
	id: string;
	browser: Browser;
	context: BrowserContext;
	page: Page;
	lastUsedAt: number;
	ttlMs: number;
}
