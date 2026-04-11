import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import descriptions from './descriptions';

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
				this.logger.info('items data', items[i].json);
				// get the user input
				const opts = {
					session: this.getNodeParameter('session', i),
					sessionID: this.getNodeParameter('sessionID', i),
					mode: this.getNodeParameter('mode', i),
				};

				// add all to the resuls
				results.push({
					json: {
						...items[i].json,
						...opts,
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
