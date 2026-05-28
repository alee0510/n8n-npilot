# Changelog

All notable changes to this project will be documented in this file.

## [0.1.6] - 2026-05-28

### Added
- Docker Hub image now available at `alee0510/n8n-npilot`
- Pre-built Docker image for quick deployment without building from source

### Changed
- Updated README.md with Docker Hub installation instructions
- Reorganized Docker installation section to prioritize pre-built image
- Added Docker Compose example using pre-built image

### Fixed
- Configured npm automation token for CI/CD publishing without 2FA prompts

## [0.1.5] - 2026-05-28

### Fixed
- Removed `prepublishOnly` script for CI/CD compatibility
- Added inline ESLint disable for `process.env` usage in SessionManager
- Fixed npm publishing workflow to use direct `npm publish` command

### Changed
- Updated GitHub Actions workflow to publish with npm provenance
- Improved CI/CD pipeline for automated releases

## [0.1.4] - 2026-05-28

### Added
- Initial release with browser automation capabilities
- Session-based browser management
- Support for Chromium, Firefox, and WebKit browsers
- Multiple browser actions (navigate, click, type, screenshot, etc.)
- Docker support with Playwright

### Features
- Session pooling with automatic garbage collection
- Configurable session TTL and max concurrent sessions
- Screenshot capture with binary data support
- Table extraction and text extraction
- Custom HTTP headers and user agent support
