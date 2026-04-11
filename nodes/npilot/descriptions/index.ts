/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionTypes } from 'n8n-workflow';
import type { INodeTypeDescription } from 'n8n-workflow';

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
			displayName: 'Mode',
			name: 'mode',
			type: 'options',
			options: [
				{ name: 'Action Based', value: 'action' },
				{ name: 'JSON Based', value: 'json' },
			],
			default: 'action',
		},
		{
			displayName: 'Script or JSON Based',
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
		{
			displayName: 'Steps',
			name: 'steps',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
				sortable: true,
			},
			default: {},
			placeholder: 'Add New Step',
			options: [
				{
					displayName: 'Step',
					name: 'step',
					// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
					values: [
						{
							displayName: 'Action',
							name: 'action',
							type: 'options',
							// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
							options: [
								{ name: 'Go to URL', value: 'goto' },
								{ name: 'Click', value: 'click' },
								{ name: 'Type Text', value: 'type' },
								{ name: 'Extract Text', value: 'extractText' },
								{ name: 'Screenshot', value: 'screenshot' },
							],
							default: 'goto',
						},
						{
							displayName: 'Selector',
							name: 'selector',
							type: 'string',
							default: '',
							displayOptions: {
								show: {
									action: ['click', 'type', 'extractText'],
								},
							},
							placeholder: '#submit-btn, .login-form',
						},
						{
							displayName: 'URL',
							name: 'url',
							type: 'string',
							default: '',
							displayOptions: {
								show: { action: ['goto'] },
							},
							placeholder: 'https://example.com',
						},
						{
							displayName: 'Text',
							name: 'text',
							type: 'string',
							default: '',
							displayOptions: {
								show: { action: ['type'] },
							},
						},
						{
							displayName: 'Output Field',
							name: 'outputField',
							type: 'string',
							default: 'result',
							displayOptions: {
								show: { action: ['extractText', 'screenshot'] },
							},
						},
					],
				},
			],
			displayOptions: {
				show: {
					mode: ['action'],
				},
			},
		},
		{
			displayName: 'Default Delay',
			name: 'defaultDelay',
			type: 'options',
			default: 'none',
			options: [
				{ name: 'None', value: 'none' },
				{ name: 'Fixed', value: 'fixed' },
			],
		},
		{
			displayName: 'Intervals',
			name: 'interval',
			type: 'number',
			default: 5,
			displayOptions: {
				show: {
					defaultDelay: ['fixed'],
				},
			},
		},
		{
			displayName: '',
			name: 'unit',
			type: 'options',
			default: 'ms',
			options: [
				{ name: 'Miliseconds', value: 'ms' },
				{ name: 'Seconds', value: 's' },
				{ name: 'Minutes', value: 'm' },
			],
			displayOptions: {
				show: {
					defaultDelay: ['fixed'],
				},
			},
		},
	],
};

export default descriptions;
