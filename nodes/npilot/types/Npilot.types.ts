import type { BrowserType } from './Session.types';
import type { Action } from './Action.types';

export type AdditionalOptions = {
	browserType?: BrowserType;
	extraHTTPHeaders?: {
		headerValues?: Array<{
			name: string;
			value: string;
		}>;
	};
	headless?: boolean;
	ttlms?: number;
	userAgent?: string;
	viewport?: { height: number; width: number };
};

export enum WaitUntil {
	domcontentloaded,
	networkidle,
	load,
	commit,
}

export enum WaitState {
	visible,
	hidden,
	attached,
	detached,
}

export type Step = {
	action: Action;
	url?: string;
	selector?: string;
	text?: string;
	clearFirst?: boolean;
	selectValue?: string;
	checked?: boolean;
	key?: string;
	waitUntil?: WaitUntil;
	waitState?: WaitState;
	timeout?: number;
	attributeName?: string;
	fullPage?: boolean;
	screenshotField?: string;
	expression?: string;
	outputField?: string;
};
