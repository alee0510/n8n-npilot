/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionTypes } from 'n8n-workflow';
import type { INodeTypeDescription } from 'n8n-workflow';

// declarative interface
import { AdditionalOptions } from './options';
import { Actions } from './actions';

const descriptions: INodeTypeDescription = {
	displayName: 'Npilot',
	name: 'npilot',
	group: ['transform'],
	version: [1],
	description: 'A Session-based RPA',
	defaults: {
		name: 'npilot',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	properties: [
		{
			displayName: 'Session',
			name: 'session',
			type: 'options',
			options: [
				{ name: 'Open New Browser', value: 'new' },
				{ name: 'Use Previous Session ID', value: 'previous' },
			],
			default: 'new',
		},
		{
			displayName: 'Session ID',
			name: 'sessionID',
			type: 'string',
			placeholder: 'e.q. xyz789abc',
			default: '',
			description: 'Session ID from previous operation',
			displayOptions: {
				show: {
					session: ['previous'],
				},
			},
		},
		{
			displayName: 'Operation Modes',
			name: 'mode',
			type: 'options',
			options: [
				{ name: 'Action Based', value: 'action' },
				{ name: 'Script Based (JSON)', value: 'json' },
			],
			default: 'action',
		},
		{
			displayName: 'Script Based (JSON)',
			name: 'scriptBased',
			type: 'json',
			default: '{}',
			typeOptions: { rows: 4 },
			displayOptions: {
				show: {
					mode: ['json'],
				},
			},
		},
		Actions,
		AdditionalOptions,
	],
};

export default descriptions;
