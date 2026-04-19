# Changelog

## [Unreleased]

## [0.1.2] - 2026-04-19

### Added

- Added Docker support for three environments:
  - `Dockerfile` + `docker-compose.yaml` — production image that installs `n8n-nodes-npilot` from the npm registry
  - `Dockerfile.dev` + `docker-compose.dev.yaml` — development image that volume-mounts the local `dist/` build for rapid iteration
  - `Dockerfile.test` + `docker-compose.test.yaml` — pre-publish integration test image that installs from a local `.tgz` tarball
- Added `.dockerignore` to exclude `node_modules`, source files, and dev tooling from the Docker build context
- Added `*.tgz` to `.gitignore` so `npm pack` artefacts are not committed

### Changed

- `ensureBrowserInstalled` now reads `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` and passes it as `executablePath` to `chromium.launch()`, allowing a system-provided Chromium binary (e.g. from Alpine Linux) to be used instead of playwright's own downloaded browser
- `ensureBrowserInstalled` now passes `--no-sandbox` and `--disable-setuid-sandbox` launch args, which are required when running as a non-root user inside Docker
- `ensureBrowserInstalled` now surfaces the actual Playwright error in the node error message instead of always showing a generic "not installed" hint, making misconfigured executable paths easier to diagnose
- `SessionManager.openSession` now reads `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` and passes it as `executablePath` when `browserType` is `chromium`, consistent with the check in `ensureBrowserInstalled`
- Reordered step actions in the action selector for better usability
- Removed `postinstall` script from `package.json` to prevent Playwright from automatically downloading browsers on `npm install` (browser setup is now the responsibility of the deployment environment)
- Bumped package version to `0.1.2`

## [0.1.1] - 2026-04-18

### Added

- Added `debug` action to inspect current page state (URL, title, HTML content) for troubleshooting selector issues

### Changed

- Improved `selector` field description with guidance on using simple, reliable selectors and avoiding brittle long CSS paths
- Enhanced error troubleshooting by recommending Debug action when selectors fail
- Improved `extractTable` action to ignore `<tfoot>` rows — only `<thead>` and `<tbody>` content is extracted
- Improved `extractTable` action to return a flat array of row objects instead of a nested array

### Fixed

- Fixed `extractTable` returning a double-nested array (`[[...]]`) when the selector matched a single table
- Fixed `extractTable` including footer rows in the extracted data due to use of `table.rows`

## [0.1.0] - 2026-04-17

### Added

- Initial release of n8n-nodes-npilot
- Built declarative-style interface for the `Npilot` node with browser automation capabilities
- Implemented `SessionManager` for managing Playwright browser sessions with automatic garbage collection
- Implemented `ActionManager` with 17 browser automation actions:
  - Navigation: `navigate`, `waitForNavigation`
  - Interaction: `click`, `type`, `select`, `check`, `hover`, `scrollTo`, `pressKey`
  - Waiting: `waitForSelector`, `waitForTimeout`
  - Data extraction: `extractText`, `extractAttribute`, `extractTable`
  - Utilities: `screenshot`, `evaluate`, `closeSession`
- Added session management with support for:
  - Creating new browser sessions
  - Reusing previous sessions across workflow nodes
  - Automatic session cleanup after 5 minutes of inactivity
  - Graceful shutdown handlers to prevent orphaned browser processes
- Added comprehensive node properties:
  - Session mode selection (new/previous)
  - Browser configuration options (type, headless mode, viewport size)
  - Step-based action configuration with dynamic field visibility
  - Output field mapping for data extraction actions
- Added TypeScript type definitions for all actions and configurations
- Added Playwright as dependency with automatic Chromium installation via postinstall script
- Added cleanup script to kill orphaned browser processes

### Changed

- Renamed default example node class and filename to `Npilot` / `Npilot.node.ts`
- Moved and updated icon paths to `nodes/npilot/icons/` (added dark-mode icon variant)
- Updated `package.json` with correct package description, GitHub repository URL, and node directory references
- Refactored action execution to use switch-case pattern for better type safety and performance
- Improved error messages with proper `NodeOperationError` formatting

### Fixed

- Fixed empty error messages by passing strings instead of objects to `NodeOperationError`
- Added validation for empty session IDs with descriptive error messages
- Added graceful shutdown handlers to prevent browser processes from becoming orphaned on n8n restart
- Added `ignoreDeprecations` to `tsconfig.json` to suppress TypeScript 5.0 deprecation warnings

### Technical Details

- Uses Playwright 1.59.1 for browser automation
- Supports Chromium, Firefox, and Webkit browsers
- Implements singleton pattern for `SessionManager`
- Uses TypeScript 5.9.2 with strict mode enabled
- Follows n8n community node standards and UX guidelines
