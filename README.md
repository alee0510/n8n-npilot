# n8n-nodes-npilot

**Npilot** is an n8n community node that brings Playwright-powered browser automation into your workflows. Use it to navigate pages, interact with UI elements, extract structured data, take screenshots, and run custom JavaScript — all from within n8n, without writing a separate scraper.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

---

## Installation

Npilot controls a real Chromium browser, so **Chromium must be available** in the environment where n8n runs. Choose the path that matches your setup.

---

### Option 1 — Self-hosted n8n

#### Step 1 — Install the community node

In n8n go to **Settings → Community Nodes → Install** and enter:

```text
n8n-nodes-npilot
```

Or install it via npm in your n8n root:

```bash
npm install n8n-nodes-npilot
```

#### Step 2 — Install Chromium

Npilot does **not** download a browser automatically. You must install Chromium in the same environment as n8n.

Using Playwright's built-in installer (recommended):

```bash
npx playwright install chromium --with-deps
```

Or using your system package manager (Debian/Ubuntu):

```bash
apt-get install -y chromium-browser
```

#### Step 3 — Point Npilot to the binary _(only needed when using a system Chromium)_

If Playwright's own browser is not used, set the environment variable so Npilot can find the binary:

```bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

Add this to your n8n startup script or `.env` file so it persists across restarts.

#### Step 4 — Restart n8n

Restart n8n to pick up the new node and environment variable.

---

### Option 2 — Docker

A ready-to-use `Dockerfile` is provided in the [GitHub repository](https://github.com/alee0510/n8n-npilot). It builds a production image that bundles n8n, Chromium, and the Npilot node in a single container — no additional setup required.

**Quick start:**

```bash
# Clone the repo (or copy just the Dockerfile and docker-compose.yaml)
git clone https://github.com/alee0510/n8n-npilot.git
cd n8n-npilot

# Build and start
docker compose up -d
```

The Docker image handles everything automatically:

- Installs Chromium from Alpine Linux packages
- Installs `n8n-nodes-npilot` from the npm registry
- Sets `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` and `N8N_CUSTOM_EXTENSIONS`

---

## Operations

Npilot exposes **18 browser automation actions** organized across two operation modes.

| Category        | Action                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Navigation**  | Navigate to URL, Wait for Navigation                                                                       |
| **Interaction** | Click Element, Type Text, Select Option, Check / Uncheck, Hover-over Element, Scroll to Element, Press Key |
| **Waiting**     | Wait for Selector, Wait (Fixed Timeout)                                                                    |
| **Extraction**  | Extract Text, Extract Attribute, Extract Table                                                             |
| **Utilities**   | Take Screenshot, Evaluate JavaScript, Debug, Close Session                                                 |

---

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested against:** n8n latest (`n8nio/n8n:latest`)
- **Node API version:** 1
- **Runtime:** Node.js 18+
- **Browser engine:** Chromium (via Playwright)

---

## Usage

### Session model

Npilot is **session-based**. Each node execution can either open a fresh browser session or reuse one from a previous node by passing the **Session ID**. This lets you chain multiple Npilot nodes in a workflow, keeping the same browser page open across steps.

- A session is automatically closed after **5 minutes of inactivity** (configurable via the TTL option).
- Up to **5 concurrent sessions** can be open at the same time.
- Use the **Close Session** action to release a session explicitly when your workflow is done.

---

### Operation modes

Choose how you want to define browser steps using the **Operation Modes** field.

#### Action Based _(default)_

Build steps one by one using the UI. Each step has an **Action** dropdown that shows only the fields relevant to that action. Steps are executed top-to-bottom and can be reordered by dragging.

Best for: building and testing workflows interactively.

#### Script Based (JSON)

Provide a JSON array of step objects directly. Each object must have an `action` key plus the corresponding fields for that action:

```json
[
  { "action": "navigate", "url": "https://example.com", "waitUntil": "domcontentloaded" },
  { "action": "click", "selector": "#login-btn", "timeout": 5000 },
  { "action": "type", "selector": "#email", "text": "user@example.com", "clearFirst": true },
  { "action": "extractText", "selector": "h1", "outputField": "heading" }
]
```

Best for: dynamically building a script in an earlier node (e.g. with a Code node) and passing it in as a variable.

---

### Actions reference

#### Navigate to URL

Opens a URL in the browser. Configure **Wait Until** to control when navigation is considered complete:

- `DOM Content Loaded` — HTML parsed, resources still loading _(recommended default)_
- `Network IDLE` — no network activity for 500 ms; use for SPAs or lazy-loaded pages
- `Load` — full page load event
- `Commit` — response received; fastest, useful for redirects

#### Click Element

Clicks the element matched by the **Selector**. Waits up to **Timeout** ms for the element to appear.

#### Type Text

Types into the matched element. Enable **Clear Before Typing** to empty the field first (useful for pre-filled inputs).

#### Select Option

Selects a `<select>` option by its `value` attribute (not the visible label). Use the **Debug** action to find the correct value if unsure.

#### Check / Uncheck

Sets the checked state of a checkbox or radio button. Toggle **Checked** on or off.

#### Hover-over Element

Moves the mouse pointer over the matched element. Useful for triggering dropdown menus or tooltips.

#### Scroll to Element

Scrolls the matched element into view. Add this before **Extract Attribute** or **Extract Text** when content is lazy-loaded on scroll.

#### Press Key

Dispatches a keyboard event. Common keys: `Enter`, `Tab`, `Escape`, `ArrowDown`, `ArrowUp`.

#### Wait for Selector

Pauses the workflow until an element matching the **Selector** reaches the target **State**:

- `Visible` — in the DOM and visible _(default)_
- `Attached` — exists in DOM even if hidden
- `Hidden` — has `display:none`, `visibility:hidden`, or zero size
- `Detached` — removed from the DOM

#### Wait (Fixed Timeout)

Pauses for exactly the number of milliseconds set in **Timeout**. Use as a last resort when selector-based waiting is not possible.

#### Extract Text

Reads the inner text of the matched element and saves it to **Output Field Name** in the JSON output.

#### Extract Attribute

Reads an HTML attribute (e.g. `href`, `src`, `data-id`) from the matched element. For lazy-loaded images or links, add a **Scroll to Element** + **Wait (Fixed Timeout)** step first.

#### Extract Table

Reads an HTML `<table>` matched by the selector and returns a flat array of row objects, using `<thead>` cells as keys. Saves to **Output Field Name**.

#### Take Screenshot

Captures the current viewport as a PNG image. Enable **Full Page** to capture the entire scrollable page. The image is stored as binary data under **Output Field Name**.

#### Evaluate JavaScript

Runs a JavaScript function inside the browser context. The function must return a JSON-serialisable value (string, number, plain object, or array). The return value is saved to **Output Field Name**.

```js
// Example: extract all href links from the page
() => Array.from(document.querySelectorAll('a')).map((a) => a.href);
```

#### Debug

Captures the current page URL, title, and full HTML source and saves them to **Output Field Name**. Use this to inspect the page state when a selector fails.

#### Close Session

Closes the browser session associated with the current Session ID and releases all resources. Always add this as the final step in a workflow to avoid leaving orphaned browser processes.

---

### Additional options

These options are available under the **Additional Options** section:

| Option             | Default      | Description                                                                   |
| ------------------ | ------------ | ----------------------------------------------------------------------------- |
| Extra HTTP Headers | —            | Custom request headers sent with every browser request (e.g. for auth tokens) |
| Headless           | `true`       | Run the browser without a visible UI. Disable when debugging locally          |
| TTL (Milliseconds) | `300000`     | How long a session stays open when idle before being auto-closed              |
| User Agent         | —            | Override the browser's default user-agent string                              |
| Viewport           | `1280 × 800` | Set a custom browser viewport width and height                                |

---

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [GitHub repository](https://github.com/alee0510/n8n-npilot)
- [npm package](https://www.npmjs.com/package/n8n-nodes-npilot)

---

## Version history

### 0.1.2 — 2026-04-19

- Added production `Dockerfile` + `docker-compose.yaml` for one-command deployment
- Npilot now respects `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for system-provided Chromium binaries
- Improved error messages when the Chromium binary is misconfigured
- Removed automatic browser download on `npm install` — browser setup is now the responsibility of the deployment environment

### 0.1.1 — 2026-04-18

- Added **Debug** action to inspect the current page URL, title, and HTML for troubleshooting
- Fixed `Extract Table` returning a double-nested array and including footer rows

### 0.1.0 — 2026-04-17

- Initial release
- 17 browser automation actions powered by Playwright
- Session-based architecture with automatic garbage collection
- Action Based and Script Based (JSON) operation modes
