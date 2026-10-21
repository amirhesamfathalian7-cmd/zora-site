#!/usr/bin/env bash
# ============================================================
# Mirror the live zora-site Worker (static assets) into ./out
# so we can patch version.json and redeploy without a rebuild.
#
# Usage:  bash scripts/mirror-site.sh
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="https://zora-site.amirhesamfathalian7.workers.dev"
OUT="out"

rm -rf "$OUT"
mkdir -p "$OUT"

# 1) crawl the site (structure preserved) — tolerate individual 404s
wget -q -r -l 6 -np --no-host-directories --no-check-certificate \
     --user-agent="Mozilla/5.0 (ZORA-mirror)" \
     -P "$OUT" "$SRC/" || echo "wget finished with partial errors (ok)"

# 2) extra root files that crawlers may not discover
for f in version.json 404.html robots.txt sitemap.xml emblem.png favicon.ico manifest.json; do
  curl -sf --max-time 20 "$SRC/$f" -o "$OUT/$f" 2>/dev/null || true
done

# 3) report
echo "--- mirrored files: $(find "$OUT" -type f | wc -l)"
du -sh "$OUT"
echo "--- root listing:"
ls "$OUT" | head -20
