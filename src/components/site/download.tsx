"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HardDrive,
  Usb,
  Download as DownloadIcon,
  Loader2,
  CircleAlert,
  CircleCheck,
  Monitor,
  Cpu,
  WifiOff,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fmtMB, toFa, fileUrl } from "@/lib/zora";
import { Reveal } from "./reveal";

interface DownloadFileStatus {
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

interface ReleaseInfo {
  version: string;
  codeName: string;
  releaseDateFa: string;
  notes: readonly string[];
  nextTeaser: string;
  downloads: DownloadFileStatus[];
  anyAvailable: boolean;
}

function DownloadCard({ file, delay }: { file: DownloadFileStatus; delay: number }) {
  const [busy, setBusy] = useState(false);
  const Icon = file.id === "setup" ? HardDrive : Usb;

  const onDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!file.available) {
      e.preventDefault();
      toast({
        title: "فایل هنوز آماده نیست",
        description: "این فایل به‌زودی روی سرور قرار می‌گیرد؛ کمی صبور باش! 🐣",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    toast({
      title: "دانلود شروع شد! 🎉",
      description: `${file.filename} — از سایت رسمی zora`,
    });
    // the browser handles the actual file; relax the spinner afterwards
    setTimeout(() => setBusy(false), 4000);
  };

  return (
    <Reveal delay={delay}>
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-7 ${
          file.available
            ? "border-zora-lav/35 bg-gradient-to-b from-zora-tint/50 to-zora-900 shadow-[0_24px_70px_-24px_rgba(141,125,232,0.45)]"
            : "border-zora-700/60 bg-zora-900/60"
        }`}
      >
        <div className="mb-5 flex items-start justify-between">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              file.available
                ? "bg-zora-lav text-zora-950 shadow-[0_0_28px_-4px_rgba(169,155,255,0.8)]"
                : "bg-zora-800 text-zora-silver5"
            }`}
          >
            <Icon className="h-7 w-7" />
          </span>
          <span
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold ${
              file.available
                ? "bg-zora-lav/15 text-zora-lavh ring-1 ring-zora-lav/35"
                : "bg-zora-gold/10 text-zora-gold ring-1 ring-zora-gold/30"
            }`}
          >
            {file.available ? file.badge : "در حال آماده‌سازی"}
          </span>
        </div>

        <h3 className="text-xl font-black text-zora-silver">{file.label}</h3>
        <p className="mt-1 text-xs font-semibold text-zora-silver5">{file.sub}</p>
        <p className="mt-3 flex-1 text-sm leading-7 text-zora-silver5">{file.desc}</p>

        <div className="mt-5 flex items-center gap-2 text-xs text-zora-silver5">
          <Package className="h-3.5 w-3.5 text-zora-lav" />
          <span className="tabular-fa">حجم: {file.sizeMB ? fmtMB(file.sizeMB) : "—"}</span>
          <span aria-hidden="true">·</span>
          <span dir="ltr" className="font-mono text-[10px] text-zora-silver7">
            {file.filename}
          </span>
        </div>

        <a
          href={file.url}
          download
          onClick={onDownload}
          aria-disabled={!file.available}
          className={`group relative mt-6 inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-4 text-sm font-extrabold transition-all duration-200 ${
            file.available
              ? "bg-gradient-to-l from-zora-lavp to-zora-lav text-zora-950 shadow-[0_14px_40px_-12px_rgba(169,155,255,0.75)] hover:scale-[1.02] active:scale-95"
              : "cursor-not-allowed bg-zora-800 text-zora-silver7"
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              در حال آماده‌سازی…
            </>
          ) : (
            <>
              <DownloadIcon className="h-4.5 w-4.5 transition-transform group-hover:translate-y-0.5" />
              {file.available ? "دانلود مستقیم" : "به‌زودی"}
            </>
          )}
          {file.available && (
            <span aria-hidden="true" className="absolute inset-y-0 w-1/3 animate-shine bg-white/25 blur-md" />
          )}
        </a>
      </motion.article>
    </Reveal>
  );
}

const REQUIREMENTS = [
  { icon: Monitor, text: "ویندوز ۷ / ۸ / ۱۰ / ۱۱" },
  { icon: Cpu, text: "حداقل ۲ گیگ رم — سبک و روان" },
  { icon: WifiOff, text: "بدون نیاز به اینترنت" },
];

const STEPS = [
  { title: "دانلود کن", body: "نسخه‌ی نصبی یا پرتابل را از همین صفحه بگیر." },
  { title: "نصب کن", body: "روی فایل کلیک کن و مراحل را مثل هر اپ دیگری دنبال کن." },
  { title: "شورتکات آماده!", body: "پس از نصب، آیکون zora روی دسکتاپ منتظرت است." },
  { title: "پرواز کن", body: "zora را باز کن؛ پرنده‌ها به استقبالت می‌آیند!" },
];

export function DownloadCenter() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [totalDownloads, setTotalDownloads] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      // Release info: live API first (dev / standalone server),
      // static /version.json as fallback (Cloudflare Pages build).
      try {
        let d: ReleaseInfo | null = null;
        try {
          const r = await fetch("/api/version");
          if (r.ok) d = await r.json();
        } catch {}
        if (!d) {
          const r = await fetch("/version.json");
          if (r.ok) d = await r.json();
        }
        if (alive && d) setRelease(d);
      } catch {}
      // Download counter — only exists on the live server; static build hides it.
      try {
        const r = await fetch("/api/stats");
        if (r.ok) {
          const d = await r.json();
          if (alive) setTotalDownloads(d.total);
        }
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="download" className="relative scroll-mt-20 py-20 sm:py-28">
      {/* section aurora */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-72 w-[560px] -translate-x-1/2 rounded-full bg-zora-lavp/14 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-zora-sky/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            دانلود اپ
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            zora را <span className="text-gradient-lav">رایگان</span> ببر خانه
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            آخرین نسخه همیشه اول این‌جا منتشر می‌شود؛ همان‌جا که پرنده‌ی داخل اپ به تو
            می‌گوید.
          </p>
        </Reveal>

        {/* version header */}
        <Reveal>
          <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-zora-700/60 bg-zora-900/70 px-6 py-5 backdrop-blur sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zora-lav/15 text-zora-lavh ring-1 ring-zora-lav/30">
                <CircleCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-zora-silver">
                  آخرین نسخه:{" "}
                  <span className="tabular-fa text-zora-lavh" dir="ltr">
                    {release ? `v${toFa(release.version)}` : "…"}
                  </span>{" "}
                  {release && <span className="text-zora-silver5">({release.codeName})</span>}
                </p>
                <p className="mt-0.5 text-xs text-zora-silver7">
                  {release ? `منتشر شده در ${release.releaseDateFa}` : "در حال دریافت اطلاعات نسخه…"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {totalDownloads !== null && (
                <span className="rounded-full bg-zora-800 px-4 py-2 text-xs font-bold text-zora-silver3 tabular-fa">
                  {toFa(totalDownloads.toLocaleString("en-US"))} دانلود
                </span>
              )}
              {release && (
                <span
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold ${
                    release.anyAvailable
                      ? "bg-zora-mint/12 text-zora-mint"
                      : "bg-zora-gold/10 text-zora-gold"
                  }`}
                >
                  {release.anyAvailable ? (
                    <>
                      <CircleCheck className="h-3.5 w-3.5" /> فایل‌ها روی سرور آماده‌اند
                    </>
                  ) : (
                    <>
                      <CircleAlert className="h-3.5 w-3.5" /> فایل‌ها در حال قرارگیری
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* download cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {(release?.downloads ?? [
            {
              id: "setup",
              filename: "ZORA-Reader-Setup.exe",
              label: "نسخه‌ی نصبی",
              sub: "پیشنهاد ما",
              desc: "نصب راحت روی سیستم، مثل هر اپ حرفه‌ای دیگر.",
              badge: "پیشنهادی",
              available: false,
              sizeMB: 915,
              url: fileUrl("ZORA-Reader-Setup.exe"),
            },
            {
              id: "portable",
              filename: "ZORA-Reader-Portable.exe",
              label: "نسخه‌ی پرتابل",
              sub: "بدون نصب",
              desc: "بدون نصب، بدون ردپا؛ حتی از روی فلش‌مموری.",
              badge: "بدون نصب",
              available: false,
              sizeMB: 870,
              url: fileUrl("ZORA-Reader-Portable.exe"),
            },
          ]).map((f, i) => (
            <DownloadCard key={f.id} file={f} delay={0.08 * i} />
          ))}
        </div>

        {/* requirements */}
        <Reveal className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-3 text-xs text-zora-silver5">
            {REQUIREMENTS.map((r) => (
              <li
                key={r.text}
                className="inline-flex items-center gap-2 rounded-full border border-zora-700/60 bg-zora-900/70 px-4 py-2"
              >
                <r.icon className="h-3.5 w-3.5 text-zora-lav" />
                {r.text}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* install steps */}
        <Reveal className="mt-14">
          <div className="rounded-3xl border border-zora-700/60 bg-zora-900/50 p-6 sm:p-9">
            <h3 className="mb-8 text-center text-lg font-extrabold text-zora-silver">
              نصبش ۴ قدم بیشتر طول نمی‌کشد!
            </h3>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative text-center">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zora-lav/30 bg-zora-tint text-base font-black text-zora-lavh tabular-fa">
                    {toFa(i + 1)}
                  </span>
                  <p className="font-extrabold text-zora-silver">{s.title}</p>
                  <p className="mx-auto mt-1.5 max-w-[220px] text-xs leading-6 text-zora-silver5">{s.body}</p>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -start-3 top-6 hidden h-px w-6 bg-gradient-to-l from-zora-lav/50 to-transparent lg:block"
                    />
                  )}
                </li>
              ))}
            </ol>

            {/* SmartScreen note */}
            <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-zora-gold/25 bg-zora-gold/[0.07] p-4 text-start">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-zora-gold" />
              <p className="text-xs leading-6 text-zora-silver3">
                <span className="font-extrabold text-zora-gold">نکته‌ی ویندوز:</span> چون فایل نصب،
                امضای دیجیتال تجاری ندارد، ممکن است ویندوز هشدار بدهد. روی{" "}
                <span dir="ltr" className="font-bold">More info</span> و بعد{" "}
                <span dir="ltr" className="font-bold">Run anyway</span> کلیک کن و خیالت راحت باشد —
                فایل مستقیم از سایت رسمی ماست. 💙
              </p>
            </div>
          </div>
        </Reveal>

        {/* release notes */}
        {release && (
          <Reveal className="mt-10">
            <div className="mx-auto max-w-3xl rounded-3xl border border-zora-700/60 bg-zora-900/50 p-6 sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-base font-extrabold text-zora-silver">
                <CheckCircle2 className="h-5 w-5 text-zora-mint" />
                چه چیزهایی در نسخه‌ی {toFa(release.version)} هست؟
              </h3>
              <ul className="space-y-3">
                {release.notes.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-7 text-zora-silver3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zora-lav" />
                    {n}
                  </li>
                ))}
              </ul>
              {release.nextTeaser && (
                <p className="mt-6 rounded-xl bg-zora-tint/70 px-4 py-3 text-xs leading-6 text-zora-lavh">
                  🚀 در نسخه‌ی بعدی: {release.nextTeaser}
                </p>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
