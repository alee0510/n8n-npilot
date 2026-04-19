/* eslint-disable n8n-nodes-base/node-param-description-miscased-id */
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
						{ name: 'Check / Uncheck', value: 'check' },
						{ name: 'Click Element', value: 'click' },
						{ name: 'Close Session', value: 'closeSession' },
						{ name: 'Debug', value: 'debug' },
						{ name: 'Evaluate JavaScript', value: 'evaluate' },
						{ name: 'Extract Attribute', value: 'extractAttribute' },
						{ name: 'Extract Table', value: 'extractTable' },
						{ name: 'Extract Text', value: 'extractText' },
						{ name: 'Hover-over Element', value: 'hover' },
						{ name: 'Navigate to URL', value: 'navigate' },
						{ name: 'Press Key', value: 'pressKey' },
						{ name: 'Scroll to Element', value: 'scrollTo' },
						{ name: 'Select Option', value: 'select' },
						{ name: 'Take Screenshot', value: 'screenshot' },
						{ name: 'Type Text', value: 'type' },
						{ name: 'Wait (Fixed Timeout)', value: 'waitForTimeout' },
						{ name: 'Wait for Navigation', value: 'waitForNavigation' },
						{ name: 'Wait for Selector', value: 'waitForSelector' },
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
					description:
						'<b>DOM Content Loaded</b> — HTML parsed, resources still loading (recommended default). <b>Network IDLE</b> — no network activity for 500 ms; use for SPAs or lazy-loaded pages. <b>Load</b> — full page load event; slower but thorough. <b>Commit</b> — response received and document starts loading; fastest, suitable for redirects.',
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
					description:
						'Target element in the page. Accepts a CSS selector (e.g. <code>#id</code>, <code>.class</code>, <code>input[name="q"]</code>), an XPath expression (e.g. <code>//button[@type="submit"]</code>), or a Playwright text selector (e.g. <code>text=Sign in</code>). Prefer short, stable selectors over long generated paths. Use the <b>Debug</b> action to inspect the page HTML if a selector fails.',
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
					description:
						'The <code>value</code> attribute of the <code>&lt;option&gt;</code> element to select, not its visible label. For example, for <code>&lt;option value="us"&gt;United States&lt;/option&gt;</code> enter <code>us</code>. Open the page source or use the <b>Debug</b> action to find the correct value.',
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
					description:
						'<b>Visible</b> — element is in the DOM and visible (recommended default). <b>Attached</b> — element exists in the DOM even if not visible; useful to confirm rendering without checking visibility. <b>Hidden</b> — element has <code>display:none</code>, <code>visibility:hidden</code>, or zero size. <b>Detached</b> — element has been fully removed from the DOM.',
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
					description:
						'Default is 30 000 ms (30 s). Increase for slow pages or heavy SPAs. For <b>Wait (Fixed Timeout)</b>, this is the exact pause duration — not a maximum.',
				},
				// --- Extract attribute ---
				{
					displayName: 'Attribute Name',
					name: 'attributeName',
					type: 'string',
					default: 'href',
					description:
						'Name of the HTML attribute to read from the matched element (e.g. <code>href</code>, <code>src</code>, <code>data-id</code>). For lazy-loaded content such as images, add a <b>Scroll to Element</b> and a <b>Wait (Fixed Timeout)</b> step before this action to ensure the attribute is populated.',
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
					description:
						'Write an arrow or named function that runs inside the browser context, e.g. <code>() =&gt; document.title</code>. The return value must be JSON-serialisable (strings, numbers, plain objects/arrays) and lands in <code>output.result</code>. DOM nodes, circular references, and unresolved Promises will cause an error. Use <code>async () =&gt; { … }</code> for asynchronous work.',
				},
				// --- Output field (shared) ---
				{
					displayName: 'Output Field Name',
					name: 'outputField',
					type: 'string',
					default: 'result',
					description:
						'Name of the field in the output item where the result will be saved. For <b>Take Screenshot</b> the data is stored as binary, for all other actions it is stored in the JSON output. Use a unique name per step to avoid overwriting earlier results. For dynamically loaded content, add a <b>Wait for Selector</b> and/or <b>Scroll + Wait (Fixed Timeout)</b> step before extraction.',
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
