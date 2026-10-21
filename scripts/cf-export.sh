#!/usr/bin/env bash
# ============================================================
# zora official site — Cloudflare Pages static export
#
# Produces ./out (pure static site) deployable to Cloudflare Pages.
# Exe downloads are NOT included: they live in Cloudflare R2 and
# their public URL is baked into the build via DL_BASE.
#
# Usage:
#   DL_BASE="https://dl.zorareader.us.kg" FILES_READY=0 \
#     bash scripts/cf-export.sh
#
# Env:
#   DL_BASE      R2 public base URL (empty -> relative /api/download)
#   FILES_READY  1 when exe files are uploaded to R2 (cards turn "ready")
#
# Lifecycle: captures version.json from the running dev server,
# stops it for the build (both use .next), restarts it afterwards.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

DL_BASE="${DL_BASE:-}"
FILES_READY="${FILES_READY:-0}"
API_DIR="src/app/api"
PARK=".cf-api-parked"

# restore any leftovers from a previous interrupted run
if [ -d "$PARK" ]; then
  echo "restoring parked api dir from previous run..."
  rm -rf "$API_DIR"
  mv "$PARK" "$API_DIR"
fi
if [ ! -d "$API_DIR" ]; then
  echo "ERROR: $API_DIR not found — nothing to export." >&2
  exit 1
fi

restore() {
  if [ -d "$PARK" ]; then
    mv "$PARK" "$API_DIR"
    echo "api routes restored."
  fi
}
trap restore EXIT

echo "[1/5] capturing release info from the running dev server..."
if ! curl -sf --retry 3 --retry-delay 2 http://localhost:3000/api/version -o /tmp/zora-release.json; then
  echo "ERROR: dev server on :3000 is not responding — start it first (bun run dev)." >&2
  exit 1
fi
DL_BASE="$DL_BASE" FILES_READY="$FILES_READY" node scripts/patch-version.mjs

echo "[2/5] parking $API_DIR (static export cannot include API routes)..."
mv "$API_DIR" "$PARK"

echo "[3/5] stopping the dev server (build shares .next)..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "bun run dev" 2>/dev/null || true
sleep 2

echo "[4/5] building static export (CF_EXPORT=1)..."
CF_EXPORT=1 NEXT_PUBLIC_DL_BASE="$DL_BASE" bunx next build

echo "[5/5] verifying output..."
test -f out/index.html || { echo "ERROR: out/index.html missing" >&2; exit 1; }
test -f out/version.json || echo "WARN: out/version.json missing"

echo "restarting the dev server..."
( setsid nohup bun run dev </dev/null >/dev/null 2>&1 & )
for i in $(seq 1 20); do
  sleep 3
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 4 http://localhost:3000/api/version 2>/dev/null || echo 000)
  [ "$code" = "200" ] && break
done
if [ "${code:-000}" != "200" ]; then
  echo "WARN: dev server did not come back up — restart manually with: bun run dev"
else
  echo "dev server is back up (:3000)."
fi

echo "OK — static site ready in ./out"
