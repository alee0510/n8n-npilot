import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import descriptions from './descriptions';
import { sessionManager } from './session/SessionManager';
import type { BrowserType } from './session/types';
// import { ActionManager } from './action/ActionManager';

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
				const options = this.getNodeParameter('options', i, {}) as {
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
				let sessionId;

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

				// add all to the resuls
				results.push({
					json: {
						...items[i].json,
						...{ ...options, extraHTTPHeaders },
						session,
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
