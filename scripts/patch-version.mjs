/**
 * Patches the release JSON (fetched from the live /api/version) into the
 * static public/version.json used by Cloudflare Pages and the desktop
 * app's update-bird.
 *
 * Env:
 *   DL_BASE      — public R2 base URL, e.g. "https://dl.zorareader.us.kg"
 *                  (empty -> relative /api/download/... URLs, dev mode)
 *   FILES_READY  — "1" when the exe files are actually uploaded to R2
 *
 * Input : /tmp/zora-release.json  (raw /api/version response)
 * Output: public/version.json
 */
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const DL_BASE = (process.env.DL_BASE || "").replace(/\/+$/, "");
const FILES_READY = process.env.FILES_READY === "1";
const SRC = "/tmp/zora-release.json";
const OUT = "public/version.json";

const info = JSON.parse(readFileSync(SRC, "utf8"));

info.downloads = (info.downloads ?? []).map((d) => ({
  ...d,
  available: FILES_READY,
  url: DL_BASE ? `${DL_BASE}/${d.filename}` : `/api/download/${d.filename}`,
}));
info.anyAvailable = (info.downloads ?? []).some((d) => d.available);

writeFileSync(OUT, JSON.stringify(info, null, 2) + "\n", "utf8");
unlinkSync(SRC);
console.log(
  `version.json -> ${OUT} (filesReady=${FILES_READY}, base='${DL_BASE || "(relative)"}')`
);
