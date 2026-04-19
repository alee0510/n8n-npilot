# Stage 1: Install Chromium on standard Alpine (has apk)
FROM alpine:3.22 AS chromium-deps
RUN apk add --no-cache \
    chromium \
    ca-certificates \
    ttf-freefont && \
    mkdir -p /chrom/usr/bin /chrom/usr/lib /chrom/usr/share && \
    # Copy the actual ELF binary directly (not the wrapper script)
    cp /usr/lib/chromium/chromium /chrom/usr/bin/chromium && \
    cp -r /usr/lib/chromium /chrom/usr/lib/chromium && \
    # Recursively copy all shared libs preserving subdirectory structure
    find /usr/lib -name '*.so*' -exec sh -c \
        'dest="/chrom$(dirname "$1")"; mkdir -p "$dest"; cp -P "$1" "$dest/"' \
        _ {} \; && \
    cp -r /usr/share/fonts /chrom/usr/share/fonts && \
    cp -r /usr/share/ca-certificates /chrom/usr/share/ca-certificates 2>/dev/null || true

# Stage 2: Package installer – use Alpine's npm to avoid bugs in the hardened
# image's bundled npm. Downloads the package from the registry, extracts it as
# a direct subdirectory (the structure n8n expects when scanning
# N8N_CUSTOM_EXTENSIONS), then installs only its production dependencies.
FROM alpine:3.22 AS pkg-installer
RUN apk add --no-cache nodejs npm && \
    mkdir -p /n8n-community/n8n-nodes-npilot && \
    npm pack --pack-destination /tmp n8n-nodes-npilot && \
    tar xzf /tmp/n8n-nodes-npilot-*.tgz --strip-components=1 \
        -C /n8n-community/n8n-nodes-npilot && \
    cd /n8n-community/n8n-nodes-npilot && \
    npm install --no-fund --no-audit --ignore-scripts --omit=dev

# Stage 3: n8n production image (Docker Hardened Image – Alpine 3.22, no apk)
FROM n8nio/n8n:latest

USER root

COPY --from=chromium-deps /chrom/usr/ /usr/
COPY --from=pkg-installer /n8n-community/ /usr/local/lib/n8n-community/
RUN chown -R node:node /usr/local/lib/n8n-community

ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/lib/chromium/chromium
ENV PLAYWRIGHT_LAUNCH_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"
# n8n scans this directory for packages with an "n8n" field in package.json.
# Pointing to the dedicated dir (not global node_modules) prevents n8n from
# accidentally scanning itself and breaking node loading.
ENV N8N_CUSTOM_EXTENSIONS=/usr/local/lib/n8n-community

USER node
