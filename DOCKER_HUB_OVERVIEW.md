# n8n with Npilot Browser Automation

A production-ready Docker image that bundles **n8n** workflow automation with the **Npilot** community node for Playwright-powered browser automation. This image includes Chromium and all required dependencies — no additional setup needed.

## 🚀 Quick Start

```bash
docker run -d \
  -p 5678:5678 \
  --name n8n-npilot \
  --shm-size=512m \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=changeme \
  YOUR_DOCKERHUB_USERNAME/n8n-npilot:latest
```

Access n8n at: http://localhost:5678

## 📦 What's Included

- **n8n** (latest) - Workflow automation platform
- **n8n-nodes-npilot** - Browser automation community node
- **Chromium** - Pre-installed and configured
- **Playwright** - Browser automation library
- All required system dependencies

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `N8N_BASIC_AUTH_ACTIVE` | `true` | Enable basic authentication |
| `N8N_BASIC_AUTH_USER` | `admin` | Username for n8n login |
| `N8N_BASIC_AUTH_PASSWORD` | `changeme` | Password for n8n login |
| `N8N_HOST` | `localhost` | Hostname for webhooks |
| `BROWSER_MAX_SESSIONS` | `5` | Max concurrent browser sessions |
| `BROWSER_DEFAULT_TTL_MINUTES` | `5` | Session idle timeout (minutes) |

### Docker Compose

```yaml
services:
  n8n:
    image: YOUR_DOCKERHUB_USERNAME/n8n-npilot:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
    volumes:
      - n8n_data:/home/node/.n8n
    shm_size: "512mb"
    deploy:
      resources:
        limits:
          memory: 2g

volumes:
  n8n_data:
```

## 🎯 Use Cases

- **Web Scraping** - Extract data from dynamic websites
- **UI Testing** - Automate browser-based testing workflows
- **Screenshot Capture** - Generate page screenshots on demand
- **Form Automation** - Fill and submit web forms programmatically
- **Data Extraction** - Parse tables and structured content

## 🛠️ Npilot Features

The Npilot node provides 18 browser automation actions:

**Navigation**: Navigate, Go Back, Go Forward, Reload, Wait  
**Interaction**: Click, Type, Select, Upload File  
**Extraction**: Extract Text, Extract Attribute, Extract Table  
**Utilities**: Take Screenshot, Evaluate JavaScript, Debug, Close Session

## 📋 System Requirements

- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Shared Memory**: 512MB `/dev/shm` (configured via `--shm-size`)
- **CPU**: 2+ cores recommended for concurrent sessions

## 🔗 Resources

- **npm Package**: https://www.npmjs.com/package/n8n-nodes-npilot
- **GitHub Repository**: https://github.com/alee0510/n8n-npilot
- **n8n Documentation**: https://docs.n8n.io
- **Playwright Docs**: https://playwright.dev

## 📝 Example Workflow

1. Add the **Npilot** node to your workflow
2. Choose **Navigate** action and enter a URL
3. Add another Npilot node with **Extract Text** action
4. Use the same Session ID to reuse the browser
5. Process the extracted data with other n8n nodes

## 🐛 Troubleshooting

**Browser crashes or hangs?**
- Increase `--shm-size` to 1gb or higher
- Reduce `BROWSER_MAX_SESSIONS` if running low on memory

**Session timeout errors?**
- Increase `BROWSER_DEFAULT_TTL_MINUTES`
- Ensure workflows complete within the TTL window

**Permission errors?**
- The container runs as user `node` (UID 1000)
- Ensure volume permissions match if mounting custom paths

## 📄 License

- **n8n**: Fair-code licensed (Sustainable Use License)
- **n8n-nodes-npilot**: MIT License
- **Chromium**: BSD-style license

## 👤 Maintainer

**Ali Muksin**  
Email: ali.muksin0510@gmail.com  
GitHub: [@alee0510](https://github.com/alee0510)

---

**Tags**: n8n, automation, browser-automation, playwright, chromium, web-scraping, rpa, workflow