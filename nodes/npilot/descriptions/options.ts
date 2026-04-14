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
			name: 'extraHTTPHeader',
			type: 'fixedCollection',
			placeholder: 'Add Extra HTTP Header',
			default: {},
			options: [
				{
					displayName: '',
					name: 'header',
					values: [
						{
							displayName: 'Field Name',
							name: 'field',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
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
