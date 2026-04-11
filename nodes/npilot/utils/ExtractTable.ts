// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { Page } from 'playwright';

export async function extractTable(page: Page, selector: string): Promise<Array<Record<string, string>>> {
	return page.$eval(selector, (table) => {
		const rows = Array.from((table as HTMLTableElement).rows);
		if (rows.length === 0) return [];
		const headers = Array.from(rows[0].cells).map((c) => c.textContent?.trim() ?? '');
		return rows.slice(1).map((row) => {
			const obj: Record<string, string> = {};
			Array.from(row.cells).forEach((c, idx) => {
				obj[headers[idx] ?? `col${idx}`] = c.textContent?.trim() ?? '';
			});
			return obj;
		});
	});
}