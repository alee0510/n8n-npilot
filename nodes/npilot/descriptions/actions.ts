/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-fixed-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';

export const Actions: INodeProperties = {
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
			values: [
				{
					displayName: 'Action',
					name: 'action',
					type: 'options',
					options: [
						{ name: 'Navigate to URL', value: 'navigate' },
						{ name: 'Click Element', value: 'click' },
						{ name: 'Type Text', value: 'type' },
						{ name: 'Select Option', value: 'select' },
						{ name: 'Check / Uncheck', value: 'check' },
						{ name: 'Hover-over Element', value: 'hover' },
						{ name: 'Press Key', value: 'pressKey' },
						{ name: 'Scroll to Element', value: 'scrollTo' },
						{ name: 'Wait for Selector', value: 'waitForSelector' },
						{ name: 'Wait for Navigation', value: 'waitForNavigation' },
						{ name: 'Wait (Fixed Timeout)', value: 'waitForTimeout' },
						{ name: 'Extract Text', value: 'extractText' },
						{ name: 'Extract Attribute', value: 'extractAttribute' },
						{ name: 'Extract Table', value: 'extractTable' },
						{ name: 'Take Screenshot', value: 'screenshot' },
						{ name: 'Evaluate JavaScript', value: 'evaluate' },
						{ name: 'Debug', value: 'debug' },
						{ name: 'Close Session', value: 'closeSession' },
					],
					default: 'navigate',
				},
				// --- Navigate ---
				{
					displayName: 'URL',
					name: 'url',
					type: 'string',
					default: '',
					displayOptions: {
						show: { action: ['navigate'] },
					},
					placeholder: 'https://example.com',
				},
				{
					displayName: 'Wait Until',
					name: 'waitUntil',
					type: 'options',
					default: 'domcontentloaded',
					displayOptions: { show: { action: ['navigate'] } },
					options: [
						{ name: 'DOM Content Loaded', value: 'domcontentloaded' },
						{ name: 'Network IDLE', value: 'networkidle' },
						{ name: 'Load', value: 'load' },
						{ name: 'Commit', value: 'commit' },
					],
				},
				// --- Selector (shared by click, type, select, etc.) ---
				{
					displayName: 'Selector',
					name: 'selector',
					type: 'string',
					default: '',
					displayOptions: {
						show: {
							action: [
								'click',
								'type',
								'select',
								'check',
								'hover',
								'scrollTo',
								'waitForSelector',
								'extractText',
								'extractAttribute',
								'extractTable',
							],
						},
					},
					placeholder: '#submit-button, [data-testid="login"]',
					description: 'CSS selector or XPath. It auto-waits for the element.',
				},
				// --- Type ---
				{
					displayName: 'Text',
					name: 'text',
					type: 'string',
					default: '',
					displayOptions: { show: { action: ['type'] } },
				},
				{
					displayName: 'Clear Before Typing',
					name: 'clearFirst',
					type: 'boolean',
					default: true,
					displayOptions: { show: { action: ['type'] } },
				},
				// --- Select ---
				{
					displayName: 'Option Value',
					name: 'selectValue',
					type: 'string',
					default: '',
					displayOptions: { show: { action: ['select'] } },
					description: 'Value attribute of the &lt;option&gt; to select',
				},
				// --- Check ---
				{
					displayName: 'Checked',
					name: 'checked',
					type: 'boolean',
					default: true,
					displayOptions: { show: { action: ['check'] } },
				},
				// --- Press Key ---
				{
					displayName: 'Key',
					name: 'key',
					type: 'string',
					default: 'Enter',
					displayOptions: { show: { action: ['pressKey'] } },
					placeholder: 'Enter, Tab, Escape, ArrowDown …',
				},
				// --- Wait for Selector ---
				{
					displayName: 'State',
					name: 'waitState',
					type: 'options',
					default: 'visible',
					displayOptions: { show: { action: ['waitForSelector'] } },
					options: [
						{ name: 'Visible', value: 'visible' },
						{ name: 'Hidden', value: 'hidden' },
						{ name: 'Attached', value: 'attached' },
						{ name: 'Detached', value: 'detached' },
					],
				},
				// --- Timeout (shared) ---
				{
					displayName: 'Timeout (Milliseconds)',
					name: 'timeout',
					type: 'number',
					default: 30000,
					displayOptions: {
						show: {
							action: [
								'click',
								'waitForSelector',
								'waitForNavigation',
								'waitForTimeout',
								'navigate',
							],
						},
					},
				},
				// --- Extract attribute ---
				{
					displayName: 'Attribute Name',
					name: 'attributeName',
					type: 'string',
					default: 'href',
					description:
						'Attribute to extract. For lazy-loaded content (e.g., image src), add Scroll + Wait (Fixed Timeout) steps before this action.',
					displayOptions: { show: { action: ['extractAttribute'] } },
				},
				// --- Screenshot ---
				{
					displayName: 'Full Page',
					name: 'fullPage',
					type: 'boolean',
					default: false,
					displayOptions: { show: { action: ['screenshot'] } },
				},
				// --- Evaluate ---
				{
					displayName: 'JavaScript Expression',
					name: 'expression',
					type: 'string',
					typeOptions: { rows: 6 },
					default: '() => document.title',
					displayOptions: { show: { action: ['evaluate'] } },
					description: 'Must be a serialisable function. Return value lands in output.result.',
				},
				// --- Output field (shared) ---
				{
					displayName: 'Output Field Name',
					name: 'outputField',
					type: 'string',
					default: 'result',
					description:
						'Field name where data will be stored. For screenshot, stores as binary data. For other actions, stores in JSON output. For dynamically loaded content, add Wait for Selector and/or Scroll + Wait (Fixed Timeout) steps before extraction.',
					displayOptions: {
						show: {
							action: [
								'extractText',
								'extractAttribute',
								'extractTable',
								'evaluate',
								'screenshot',
								'debug',
							],
						},
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
};
