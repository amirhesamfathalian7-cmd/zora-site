/* ============================================================
   ZORA — منطق بررسی اپدیت (بدون وابستگی به فریم‌ورک)
   مسیر پیشنهادی در پروژه‌ی اپ: src/lib/update-check.ts
   ============================================================ */
import { APP_VERSION, CHECK_INTERVAL_MS, VERSION_CHECK_URL } from "./zora-config";

export interface RemoteRelease {
  version: string;
  codeName?: string;
  releaseDateFa?: string;
  notes?: readonly string[];
  anyAvailable?: boolean;
}

/** مقایسه‌ی semver ساده: اگر remote جدیدتر از local باشد true */
export function isNewer(remote: string, local: string): boolean {
  const parse = (v: string) =>
    v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
  const [r1, r2, r3] = parse(remote);
  const [l1, l2, l3] = parse(local);
  if (r1 !== l1) return r1 > l1;
  if (r2 !== l2) return r2 > l2;
  return r3 > l3;
}

const LS_LAST_CHECK = "zora_update_last_check";
const LS_DISMISSED = "zora_update_dismissed_version";

/** کاربر برای این نسخه «بعداً» زده؟ */
export function wasDismissed(remoteVersion: string): boolean {
  try {
    return localStorage.getItem(LS_DISMISSED) === remoteVersion;
  } catch {
    return false;
  }
}

export function dismissUpdate(remoteVersion: string): void {
  try {
    localStorage.setItem(LS_DISMISSED, remoteVersion);
  } catch {
    /* private mode */
  }
}

export interface CheckResult {
  updateAvailable: boolean;
  release?: RemoteRelease;
}

/**
 * سرویس نسخه را صدا می‌زند؛ در حالت آفلاین/خطا بی‌صدا undefined برمی‌گرداند.
 * هر ۶ ساعت یک‌بار واقعاً fetch می‌کند و نتیجه را کش می‌کند.
 */
export async function checkForUpdate(force = false): Promise<CheckResult> {
  try {
    const last = Number(localStorage.getItem(LS_LAST_CHECK) ?? 0);
    if (!force && Date.now() - last < CHECK_INTERVAL_MS) {
      return { updateAvailable: false };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(VERSION_CHECK_URL, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) return { updateAvailable: false };
    const release = (await res.json()) as RemoteRelease;
    localStorage.setItem(LS_LAST_CHECK, String(Date.now()));
    const newer = isNewer(release.version, APP_VERSION);
    if (newer && wasDismissed(release.version)) {
      return { updateAvailable: false };
    }
    return { updateAvailable: newer, release };
  } catch {
    return { updateAvailable: false };
  }
}
