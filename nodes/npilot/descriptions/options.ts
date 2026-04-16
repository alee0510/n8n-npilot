import type { INodeProperties } from 'n8n-workflow';

export const AdditionalOptions: INodeProperties = {
	displayName: 'Additional Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Options',
	default: {},
	options: [
		{
			displayName: 'Browser Type',
			name: 'browserType',
			type: 'options',
			default: 'chromium',
			options: [
				{ name: 'Chromium', value: 'chromium' },
				{ name: 'Firefox', value: 'firefox' },
				{ name: 'Webkit', value: 'webkit' },
			],
		},
		{
			displayName: 'Extra HTTP Headers',
			name: 'extraHTTPHeaders',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			placeholder: 'Add Header',
			description: 'Additional headers sent with every browser request',
			options: [
				{
					displayName: 'Header',
					name: 'headerValues',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							placeholder: 'X-Custom-Header',
							description: 'Header name',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
							placeholder: 'my-value',
							description: 'Header value',
						},
					],
				},
			],
		},
		{
			displayName: 'Headless',
			name: 'headless',
			type: 'boolean',
			default: true,
			description:
				'Whether Run browser in headless mode (without visible UI).' +
				'\n' +
				'Disable to see browser actions during execution.',
		},
		{
			displayName: 'TTL (Milliseconds)',
			name: 'ttlms',
			type: 'number',
			default: 0,
		},
		{
			displayName: 'User Agent',
			name: 'userAgent',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Viewport',
			name: 'viewport',
			type: 'fixedCollection',
			default: {
				viewportValue: { height: 0, width: 0 },
			},
			description: 'Set width and height for the viewport',
			options: [
				{
					displayName: '',
					name: 'viewportValue',
					values: [
						{
							displayName: 'Height',
							name: 'height',
							type: 'number',
							default: 0,
						},
						{
							displayName: 'Width',
							name: 'width',
							type: 'number',
							default: 0,
						},
					],
				},
			],
		},
	],
};
