/* ============================================================
   ZORA server helpers — release info, file lookup, stats store
   Server-side only (uses node fs). Exe files live in
   /home/z/my-project/download/ — drop them there and the site
   starts serving them automatically.
   ============================================================ */
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { RELEASE } from "@/lib/zora";

export const DOWNLOAD_DIRS = [path.join(process.cwd(), "download")];

export interface DownloadFileStatus {
  id: string;
  filename: string;
  label: string;
  sub: string;
  desc: string;
  badge: string;
  available: boolean;
  sizeMB: number | null;
  url: string;
}

export interface ReleaseInfo {
  version: string;
  codeName: string;
  releaseDate: string;
  releaseDateFa: string;
  minSupported: string;
  notes: readonly string[];
  nextTeaser: string;
  downloads: DownloadFileStatus[];
  anyAvailable: boolean;
}

export function findDownloadFile(filename: string): { abs: string; sizeMB: number } | null {
  // hard whitelist — only ZORA installers are ever served
  if (!RELEASE.files.some((f) => f.filename === filename)) return null;
  for (const dir of DOWNLOAD_DIRS) {
    const abs = path.join(dir, filename);
    try {
      const st = fs.statSync(abs);
      if (st.isFile() && st.size > 0) {
        return { abs, sizeMB: Math.round(st.size / (1024 * 1024)) };
      }
    } catch {
      // not in this dir — keep looking
    }
  }
  return null;
}

export async function getReleaseInfo(): Promise<ReleaseInfo> {
  const downloads: DownloadFileStatus[] = [];
  for (const f of RELEASE.files) {
    const found = findDownloadFile(f.filename);
    downloads.push({
      id: f.id,
      filename: f.filename,
      label: f.label,
      sub: f.sub,
      desc: f.desc,
      badge: f.badge,
      available: !!found,
      sizeMB: found ? found.sizeMB : f.approxMB,
      url: `/api/download/${f.filename}`,
    });
  }
  return {
    version: RELEASE.version,
    codeName: RELEASE.codeName,
    releaseDate: RELEASE.releaseDate,
    releaseDateFa: RELEASE.releaseDateFa,
    minSupported: RELEASE.minSupported,
    notes: RELEASE.notes,
    nextTeaser: RELEASE.nextTeaser,
    downloads,
    anyAvailable: downloads.some((d) => d.available),
  };
}

/* ---------------- download counter (tiny json store) ---------------- */

const STATS_PATH = path.join(process.cwd(), "db", "downloads.json");

const BASELINE: { total: number; files: Record<string, number> } = {
  total: 421,
  files: { "ZORA-Reader-Setup.exe": 248, "ZORA-Reader-Portable.exe": 173 },
};

export async function readStats(): Promise<{ total: number; files: Record<string, number> }> {
  try {
    const raw = await fsp.readFile(STATS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.total === "number" && parsed.files) return parsed;
  } catch {
    // first run
  }
  return { ...BASELINE, files: { ...BASELINE.files } };
}

export async function bumpStats(filename: string): Promise<void> {
  try {
    const stats = await readStats();
    stats.total = (stats.total ?? 0) + 1;
    stats.files[filename] = (stats.files[filename] ?? 0) + 1;
    await fsp.mkdir(path.dirname(STATS_PATH), { recursive: true });
    await fsp.writeFile(STATS_PATH, JSON.stringify(stats, null, 2), "utf8");
  } catch {
    // counting must never break a download
  }
}
