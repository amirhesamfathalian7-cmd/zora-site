#!/usr/bin/env bash
# ============================================================
# zora official site — deploy ./out to Cloudflare Pages
# (direct upload, no git integration needed)
#
# Usage:  bash scripts/cf-deploy.sh
# Needs:  .secrets/cf-token  (Cloudflare API token)
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

CF_TOKEN=$(cat .secrets/cf-token)
ACC=69a46b828fbe5f30ef66f1890181aed3
NAME_FILE=.secrets/pages-project

# 1) create Pages project once — try candidate names until one is free
#    (pages.dev subdomains are globally unique across all CF users)
if [ -f "$NAME_FILE" ]; then
  NAME=$(cat "$NAME_FILE")
  echo "using existing Pages project: $NAME"
else
  CREATED=""
  for NAME in zora zorareader zora-reader zora-reader-app zora-official zora-site; do
    RES=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACC/pages/projects" \
      -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
      --data "{\"name\":\"$NAME\",\"production_branch\":\"main\"}")
    if echo "$RES" | grep -q '"success":true'; then
      echo "$NAME" > "$NAME_FILE"
      CREATED="$NAME"
      echo "Pages project created: $NAME"
      break
    fi
    MSG=$(echo "$RES" | grep -o '"message":"[^"]*"' | head -1 || true)
    echo "name '$NAME' not available $MSG"
  done
  [ -n "$CREATED" ] || { echo "ERROR: could not create any Pages project" >&2; exit 1; }
  NAME="$CREATED"
fi

# 2) deploy ./out as production
CLOUDFLARE_API_TOKEN="$CF_TOKEN" CLOUDFLARE_ACCOUNT_ID="$ACC" WRANGLER_SEND_METRICS=false \
  npx wrangler pages deploy out --project-name "$NAME" --branch main --commit-dirty=true

echo "deployment done -> https://$NAME.pages.dev"
