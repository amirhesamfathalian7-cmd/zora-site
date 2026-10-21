"use client";

/* ============================================================
   ZORA — پرنده‌ی پیام‌رسانِ اطلاع‌رسانی اپدیت
   مسیر پیشنهادی: src/components/update-bird.tsx
   وابستگی‌ها: framer-motion (همان که در اپ هست)
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { OFFICIAL_DOWNLOAD_URL } from "@/lib/zora-config";
import { checkForUpdate, dismissUpdate, type RemoteRelease } from "@/lib/update-check";

/** پرنده‌ی پیام‌رسان — همان SVG سایت، self-contained */
function BirdSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 150" fill="none" className={className} role="img" aria-label="پرنده پیام‌رسان">
      <defs>
        <linearGradient id="ub-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BDB3FF" />
          <stop offset="100%" stopColor="#8D7DE8" />
        </linearGradient>
      </defs>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
        <g fill="#7A68D6">
          <ellipse cx="26" cy="82" rx="17" ry="7" transform="rotate(-24 26 82)" />
          <ellipse cx="24" cy="92" rx="15" ry="6" transform="rotate(-8 24 92)" fill="#8D7DE8" />
        </g>
        <ellipse cx="78" cy="80" rx="37" ry="33" fill="url(#ub-body)" />
        <ellipse cx="80" cy="92" rx="22" ry="17" fill="#EDE9FF" />
        <path d="M52 44c2-13.5 13.5-22 27.5-22S104.5 30.5 106.5 44c-8.5-4.6-17.4-6.9-27.2-6.9S60.6 39.4 52 44Z" fill="#E8B86D" />
        <path d="M52 44c9-5.4 17.5-8 27.3-8s18.6 2.6 27.2 8c1.9 1.1 1.2 4.4-1 4.4H53c-2.2 0-2.9-3.3-1-4.4Z" fill="#D9A55C" />
        <circle cx="79.5" cy="24.5" r="3.4" fill="#F2E7CE" />
        <circle cx="66" cy="57" r="7.4" fill="#fff" />
        <circle cx="92" cy="57" r="7.4" fill="#fff" />
        <circle cx="67.4" cy="57" r="3.6" fill="#202127" />
        <circle cx="93.4" cy="57" r="3.6" fill="#202127" />
        <path d="M75 64.5 79 76l4-11.5c-2.6-1.5-5.4-1.5-8 0Z" fill="#F5A66B" />
        <circle cx="57" cy="70" r="4.2" fill="rgba(240,128,128,0.4)" />
        <circle cx="101" cy="70" r="4.2" fill="rgba(240,128,128,0.4)" />
        <motion.g
          style={{ originX: "86px", originY: "76px" }}
          animate={{ rotate: [8, -30, 8] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M88 74c14-3 26 1.5 31 10.5-9.5 6.5-24 6-32-2.5-2.6-2.8-2.4-7 1-8Z" fill="#7A68D6" />
        </motion.g>
        <path d="M60 58 96 102" stroke="#B07B4F" strokeWidth="4.6" strokeLinecap="round" opacity="0.9" />
        <rect x="92" y="96" width="26" height="20" rx="5" fill="#C08A57" />
        <rect x="96" y="88" width="19" height="13" rx="2.5" fill="#FDFDFB" />
        <path d="M96 89.6l9.5 6 9.5-6" stroke="#A99BFF" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/**
 * در صفحه‌ی اصلی (لندینگ) اپ فقط یک‌بار رندر کنید:  <UpdateBird />
 * وقتی سرویس نسخه، نسخه‌ی جدیدتری اعلام کند، پرنده با پیام خوشحال‌کننده می‌آید.
 * در حالت آفلاین/خطا کاملاً بی‌صدا است و هیچ‌چیز نشان نمی‌دهد.
 */
export function UpdateBird() {
  const [release, setRelease] = useState<RemoteRelease | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    checkForUpdate().then((res) => {
      if (!alive || !res.updateAvailable || !res.release) return;
      // کمی تاخیر تا کاربر اول با صفحه آشنا شود، بعد پرنده بیاید
      setTimeout(() => {
        if (!alive) return;
        setRelease(res.release!);
        setVisible(true);
      }, 2500);
    });
    return () => {
      alive = false;
    };
  }, []);

  const openSite = useCallback(() => {
    window.open(OFFICIAL_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  }, []);

  const later = useCallback(() => {
    if (release) dismissUpdate(release.version);
    setVisible(false);
  }, [release]);

  return (
    <AnimatePresence>
      {visible && release && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-5 start-5 z-[9999] flex max-w-[92vw] items-end gap-3 sm:max-w-md"
        >
          <motion.div
            initial={{ x: -140, y: 26, rotate: -22, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 13 }}
            className="w-20 shrink-0 sm:w-24"
          >
            <BirdSvg />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="relative rounded-2xl border border-[#252A34] bg-[#181B22]/95 p-4 pe-9 shadow-[0_18px_60px_-16px_rgba(141,125,232,0.55)] backdrop-blur"
          >
            <button
              type="button"
              onClick={later}
              aria-label="بستن"
              className="absolute end-2.5 top-2.5 rounded-lg p-1 text-[#929AA8] transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm font-extrabold leading-7 text-[#F2F3F5]">
              اپدیت جدید از راه رسید دوست من! 🎉
            </p>
            <p className="text-[13px] leading-6 text-[#C8CDD6]">
              همین حالا می‌تونی از سایت رسمی ما دانلودش کنی و لذت ببری ❤️🌊
            </p>
            <button
              type="button"
              onClick={openSite}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#8D7DE8] to-[#A99BFF] px-4 py-2.5 text-xs font-extrabold text-[#090A0D] transition hover:scale-[1.03] active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              دانلود از سایت رسمی ما
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
