#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh
#
# Use for every update AFTER the first setup (init-letsencrypt.sh).
# Pulls latest code, rebuilds images, and restarts services with zero downtime.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "→ Pulling latest changes…"
git pull

echo "→ Rebuilding images and restarting services…"
docker compose up -d --build

echo "→ Removing dangling images…"
docker image prune -f

echo ""
echo "✅  Deployment complete!"
docker compose ps
