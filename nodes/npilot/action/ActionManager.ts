/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { Page } from 'playwright';
import type { WaitUntil, WaitState } from '../types/Npilot.types';

export class ActionManager {
	constructor(private page: Page) {}
	async navigate({
		url,
		waitUntil,
		timeout,
	}: {
		url: string;
		waitUntil?: WaitUntil;
		timeout?: number;
	}): Promise<string> {
		await this.page.goto(url, { waitUntil, timeout });
		return this.page.url();
	}

	async click({ selector, timeout }: { selector: string; timeout: number }) {
		await this.page.click(selector, { timeout });
	}

	async type({
		selector,
		text,
		clearFirst,
	}: {
		selector: string;
		text: string;
		clearFirst: boolean;
	}) {
		if (clearFirst) await this.page.fill(selector, '');
		await this.page.fill(selector, text);
	}

	async select({ selector, value }: { selector: string; value: string }) {
		await this.page.selectOption(selector, value);
	}

	async check({ selector, checked }: { selector: string; checked: boolean }) {
		await this.page.setChecked(selector, checked);
	}

	async hover({ selector }: { selector: string }) {
		await this.page.hover(selector);
	}

	async scrollTo({ selector }: { selector: string }) {
		await this.page.locator(selector).scrollIntoViewIfNeeded();
	}

	async pressKey({ key }: { key: string }) {
		await this.page.keyboard.press(key);
	}

	async waitForSelector({
		selector,
		state,
		timeout,
	}: {
		selector: string;
		state: WaitState;
		timeout: number;
	}) {
		await this.page.waitForSelector(selector, { state, timeout });
	}

	async waitForNavigation({ url, timeout }: { url: string; timeout: number }) {
		await this.page.waitForURL(url, { timeout });
	}

	async waitForTimeout({ timeout }: { timeout: number }) {
		await this.page.waitForTimeout(timeout);
	}

	async extractText({ selector }: { selector: string }) {
		return await this.page.$$eval(selector, (els) =>
			els.map((el) => el?.textContent?.trim() ?? ''),
		);
	}

	async extractAttribute({ selector, attribute }: { selector: string; attribute: string }) {
		return await this.page.$$eval(
			selector,
			(els, a) => els.map((el) => el?.getAttribute(a) ?? null),
			attribute,
		);
	}

	async extractTable({ selector }: { selector: string }) {
		return await this.page.$$eval(selector, (tables) => {
			type TableCell = { textContent: string | null };
			type TableRow = { cells: ArrayLike<TableCell> };
			type TableEl = {
				tHead: { rows: ArrayLike<TableRow> } | null;
				tBodies: ArrayLike<{ rows: ArrayLike<TableRow> }>;
			};

			return tables.map((table) => {
				const tableEl = table as unknown as TableEl;

				// Collect header row from <thead> if present, otherwise fall back to the first <tbody> row
				const headRows = tableEl.tHead ? Array.from(tableEl.tHead.rows) : [];
				const bodyRows = Array.from(tableEl.tBodies).flatMap((body) => Array.from(body.rows));

				const headerRow = headRows[0] ?? bodyRows[0];
				if (!headerRow) return [];

				const headers = Array.from(headerRow.cells).map((c) => c?.textContent?.trim() ?? '');
				const dataRows = headRows.length ? bodyRows : bodyRows.slice(1);

				return dataRows.map((row) => {
					const obj: Record<string, string> = {};
					Array.from(row.cells).forEach((c, idx) => {
						obj[headers[idx] ?? `col${idx}`] = c?.textContent?.trim() ?? '';
					});
					return obj;
				});
			});
		});
	}

	async screenshot({ fullPage }: { fullPage: boolean }): Promise<Buffer> {
		return await this.page.screenshot({ type: 'png', fullPage });
	}

	async debug(): Promise<{ url: string; title: string; html: string }> {
		return {
			url: this.page.url(),
			title: await this.page.title(),
			html: await this.page.content(),
		};
	}

	async evaluate({ expression }: { expression: string }) {
		const callback = eval(expression);
		return await this.page.evaluate(callback);
	}
}
