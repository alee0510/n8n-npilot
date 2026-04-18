import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import descriptions from './descriptions';
import { sessionManager } from './session/SessionManager';
import { ActionManager } from './action/ActionManager';
import type { AdditionalOptions, Step } from './types/Npilot.types';

export class Npilot implements INodeType {
	description: INodeTypeDescription = {
		...descriptions,
		icon: { light: 'file:icons/npilot.svg', dark: 'file:icons/npilot.dark.svg' },
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData(); // get all items from previous node
		const results: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// get all additional options
				const options = this.getNodeParameter('options', i, {}) as AdditionalOptions;

				// build compatible sructure extra header for Playwright
				const extraHTTPHeaders: Record<string, string> = {};
				const entries = options.extraHTTPHeaders?.headerValues ?? [];
				if (entries.length) {
					for (const entry of entries) {
						if (entry.name) {
							extraHTTPHeaders[entry.name] = entry.value;
						}
					}
				}

				// get session value
				const session = this.getNodeParameter('session', i, '') as 'new' | 'previous';
				let sessionId = '';

				// check session
				if (session === 'previous') {
					sessionId = this.getNodeParameter('sessionId', i, '') as string;
					if (!sessionId) {
						throw new NodeOperationError(
							this.getNode(),
							'Session ID not found. Ensure a Browser Open node runs before this node.',
							{ itemIndex: i },
						);
					}
				}

				// open new browser
				if (session == 'new') {
					this.logger.info('options', options);
					sessionId = await sessionManager.openSession({
						...options,
						extraHTTPHeaders,
					});
				}

				// get page
				const page = sessionManager.getPage(sessionId);

				// check operation mode
				const mode = this.getNodeParameter('mode', i, '') as 'action' | 'json' | undefined;
				let steps: Array<Step> = [];
				if (mode === 'action') {
					steps = this.getNodeParameter('steps.step', i, []) as Array<Step>;
				}
				if (mode === 'json') {
					const rawScript = this.getNodeParameter('script', i, '') as string;
					steps = JSON.parse(rawScript) as Array<Step>;
				}

				// get the action parameter
				const action = new ActionManager(page);

				// do all action
				let actionResult: unknown;
				for (const step of steps) {
					switch (step.action) {
						case 'navigate':
							actionResult = await action.navigate({
								url: step.url || '',
								waitUntil: step.waitUntil,
								timeout: step.timeout,
							});
							break;
						case 'check':
							actionResult = await action.check({
								selector: step.selector || '',
								checked: step.checked || true,
							});
							break;
						case 'click':
							actionResult = await action.click({
								selector: step.selector || '',
								timeout: step.timeout || 1000,
							});
							break;
						case 'closeSession':
							actionResult = await sessionManager.closeSession(sessionId);
							break;
						case 'evaluate':
							actionResult = await action.evaluate({
								expression: step.expression || '',
							});
							break;
						case 'extractAttribute':
							actionResult = await action.extractAttribute({
								selector: step.selector || '',
								attribute: step.attributeName || '',
							});
							break;
						case 'extractTable':
							break;
						case 'extractText':
							actionResult = await action.extractText({
								selector: step.selector || '',
							});
							break;
						case 'hover':
							actionResult = await action.hover({
								selector: step.selector || '',
							});
							break;
						case 'pressKey':
							actionResult = await action.pressKey({
								key: step.key || '',
							});
							break;
						case 'screenshot':
							actionResult = await action.screenshot({
								fullPage: step.fullPage || false,
							});
							break;
						case 'scrollTo':
							actionResult = await action.scrollTo({
								selector: step.selector || '',
							});
							break;
						case 'select':
							actionResult = await action.select({
								selector: step.selector || '',
								value: step.selectValue || '',
							});
							break;
						case 'type':
							actionResult = await action.type({
								selector: step.selector || '',
								text: step.text || '',
								clearFirst: step.clearFirst || false,
							});
							break;
						case 'waitForNavigation':
							actionResult = await action.waitForNavigation({
								url: step.url || '',
								timeout: step.timeout || 1000,
							});
							break;
						case 'waitForSelector':
							actionResult = await action.waitForSelector({
								selector: step.selector || '',
								state: step.waitState || 'visible',
								timeout: step.timeout || 1000,
							});
							break;
						case 'waitForTimeout':
							actionResult = await action.waitForTimeout({
								timeout: step.timeout || 1000,
							});
							break;
						default:
							actionResult = await sessionManager.closeAll();
					}

					// store reesult if action return data
					if (actionResult !== undefined && step.outputField) {
						items[i].json[step.outputField] = actionResult;
					}
				}

				// add all to the resuls
				results.push({
					json: {
						...items[i].json,
						sessionId,
					},
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					results.push({
						json: { ...items[i].json, error: (error as Error).message },
						pairedItem: i,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [results];
	}
}
