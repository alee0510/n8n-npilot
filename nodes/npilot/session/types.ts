// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { Browser, BrowserContext, Page } from 'playwright';

export type BrowserType = 'CHROMIUM' | 'FIREFOX' | 'WEBKIT';

export type SessionOptions = {
	browserType?: BrowserType;
	headless?: boolean;
	viewport?: { width: number; height: number };
	userAgent?: string;
	extraHTTPHeaders?: Record<string, string>;
	ttlMs?: number; // idle TTL before auto-close
};

export interface Session {
	id: string;
	browser: Browser;
	context: BrowserContext;
	page: Page;
	lastUsedAt: number;
	ttlMs: number;
}
