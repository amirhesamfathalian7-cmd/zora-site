"use client";

import { motion } from "framer-motion";
import {
  PenLine,
  Highlighter,
  Eraser,
  Clock3,
  Settings2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Library,
} from "lucide-react";
import type { ReactNode } from "react";

/* ============================================================
   CSS/SVG illustrated mockups of the ZORA Reader app —
   used in the Hero and the interactive Tour section.
   ============================================================ */

export function MockupFrame({
  children,
  title = "zora — علوم تجربی پایه‌ی هفتم",
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zora-700/80 bg-zora-900/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(169,155,255,0.08)] ${className ?? ""}`}
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-zora-700/60 bg-zora-850 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zora-rose/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-zora-gold/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-zora-mint/80" />
        </div>
        <p className="truncate text-xs font-medium text-zora-silver5">{title}</p>
        <span className="ms-auto flex items-center gap-1.5 rounded-full bg-zora-800 px-2.5 py-1 text-[10px] font-semibold text-zora-silver3 tabular-fa">
          <Clock3 className="h-3 w-3 text-zora-lav" />
          ۱۰:۲۴
        </span>
      </div>
      {children}
    </div>
  );
}

/** A paper page with skeleton text, animated highlight & pen scribble */
export function PaperPage({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative flex h-full items-start justify-center overflow-hidden bg-[#20232A] p-3 sm:p-5">
      <div className="w-full max-w-[300px] rounded-lg bg-zora-paper p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] sm:p-5">
        {/* title */}
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-zora-lavp" />
          <div className="h-2.5 w-24 rounded-full bg-zora-ink/70" />
          <div className="h-2.5 w-10 rounded-full bg-zora-ink/25" />
        </div>
        {/* text lines */}
        <div className="space-y-2">
          {[92, 100, 96, 60].map((w, i) => (
            <div key={i} className="flex justify-end" style={{ width: "100%" }}>
              <div className="h-[7px] rounded-full bg-zora-ink/[0.16]" style={{ width: `${w}%` }} />
            </div>
          ))}
          {/* highlighted sentence — draws itself */}
          <div className="flex justify-end">
            <motion.div
              className="h-[9px] rounded-full bg-zora-gold/50 ring-1 ring-zora-gold/40"
              initial={{ width: 0 }}
              whileInView={{ width: "78%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          {[100, 88].map((w, i) => (
            <div key={`b${i}`} className="flex justify-end">
              <div className="h-[7px] rounded-full bg-zora-ink/[0.16]" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
        {/* pen scribble */}
        <svg viewBox="0 0 220 34" className="mt-2 h-7 w-full" aria-hidden="true">
          <motion.path
            d="M6 24 C 34 6, 52 30, 78 18 S 128 4, 150 20 S 196 30, 214 12"
            fill="none"
            stroke="#8D7DE8"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
          />
        </svg>
        {!compact && (
          <div className="mt-3 space-y-2">
            {[96, 70].map((w, i) => (
              <div key={`c${i}`} className="flex justify-end">
                <div className="h-[7px] rounded-full bg-zora-ink/[0.13]" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** The bottom reading toolbar with an active pen */
export function ReaderToolbar() {
  const tools = [
    { icon: PenLine, active: true, label: "قلم" },
    { icon: Highlighter, active: false, label: "ماژیک" },
    { icon: Eraser, active: false, label: "پاک‌کن" },
    { icon: Clock3, active: false, label: "ساعت تمرکز" },
    { icon: Settings2, active: false, label: "تنظیمات" },
  ];
  return (
    <div className="flex items-center justify-center gap-1.5 border-t border-zora-700/60 bg-zora-850 px-3 py-2.5">
      <button aria-label="صفحه‌ی قبل" className="rounded-lg p-1.5 text-zora-silver5 transition hover:bg-zora-800 hover:text-zora-silver">
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="mx-1 flex items-center gap-1">
        {tools.map((t) => (
          <span
            key={t.label}
            title={t.label}
            className={`rounded-lg p-2 transition ${
              t.active
                ? "bg-zora-lav text-zora-950 shadow-[0_0_18px_-2px_rgba(169,155,255,0.7)]"
                : "text-zora-silver5"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
      <button aria-label="صفحه‌ی بعد" className="rounded-lg p-1.5 text-zora-silver5 transition hover:bg-zora-800 hover:text-zora-silver">
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Sidebar with grade→subject tree, used by HomeMock */
export function SidebarNav() {
  const rows = [
    { label: "دبستان", level: 0, active: false },
    { label: "متوسطه‌ی اول", level: 0, active: false },
    { label: "پایه‌ی هفتم", level: 1, active: true },
    { label: "علوم تجربی", level: 2, active: true },
    { label: "ریاضی", level: 2, active: false },
    { label: "فارسی", level: 2, active: false },
    { label: "پایه‌ی هشتم", level: 1, active: false },
  ];
  return (
    <aside className="hidden w-40 shrink-0 flex-col gap-1 border-e border-zora-700/50 bg-zora-850/80 p-3 sm:flex">
      <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-bold tracking-wide text-zora-silver5">
        <Library className="h-3 w-3" /> کتاب‌خانه
      </p>
      {rows.map((r) => (
        <span
          key={r.label}
          className={`rounded-lg px-2 py-1.5 text-[11px] transition ${
            r.active
              ? "bg-zora-tint font-bold text-zora-lavh ring-1 ring-zora-lav/30"
              : "text-zora-silver5"
          }`}
          style={{ marginInlineStart: r.level * 10 }}
        >
          {r.label}
        </span>
      ))}
    </aside>
  );
}

/** Grid of colorful book covers — the "home" screen */
export function BookGridMock() {
  const books = [
    { t: "فارسی", g: "from-rose-400/80 to-rose-600/80" },
    { t: "ریاضی", g: "from-sky-400/80 to-sky-600/80" },
    { t: "علوم", g: "from-emerald-400/80 to-emerald-600/80" },
    { t: "مطالعات", g: "from-amber-400/80 to-amber-600/80" },
    { t: "انگلیسی", g: "from-violet-400/80 to-violet-600/80" },
    { t: "قرآن", g: "from-teal-400/80 to-teal-600/80" },
  ];
  return (
    <div className="grid flex-1 grid-cols-3 content-center gap-2.5 bg-[#20232A] p-4 sm:gap-3 sm:p-5">
      {books.map((b, i) => (
        <motion.div
          key={b.t}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 * i, duration: 0.5, ease: "easeOut" }}
          className={`relative aspect-[3/4] rounded-lg bg-gradient-to-br ${b.g} p-2 shadow-lg`}
        >
          <span className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/35 via-transparent to-white/25" />
          <span className="absolute start-1.5 top-1.5 h-1 w-6 rounded-full bg-white/50" />
          <span className="absolute bottom-2 start-0 end-0 text-center text-[10px] font-extrabold text-white drop-shadow sm:text-xs">
            {b.t}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Full reader view: sidebar + page + toolbar */
export function ReaderMock({ withSidebar = true }: { withSidebar?: boolean }) {
  return (
    <div className="flex min-h-[240px] flex-col">
      <div className="flex flex-1 overflow-hidden">
        {withSidebar && <SidebarNav />}
        <div className="relative flex-1">
          <PaperPage />
        </div>
      </div>
      <ReaderToolbar />
    </div>
  );
}

/** Focus mode: clock + energy + flip bird hints */
export function FocusMock() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 bg-[#20232A] p-5">
      {/* clock */}
      <div className="relative h-24 w-24 rounded-full border-[5px] border-zora-800 bg-zora-850 shadow-inner">
        <span className="absolute inset-0 rounded-full border-2 border-zora-lav/25" />
        <motion.span
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 h-9 w-[2.5px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-zora-lav" />
        </motion.span>
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zora-lavh" />
        <span className="absolute -bottom-6 start-0 end-0 text-center text-[10px] font-bold text-zora-silver3 tabular-fa">
          ۲۵:۰۰ — زمان تمرکز
        </span>
      </div>
      {/* energy */}
      <div className="mt-6 w-full max-w-[260px] rounded-xl border border-zora-700/60 bg-zora-850 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold">
          <span className="text-zora-silver3">انرژی پرنده‌ی ورق‌زن</span>
          <span className="text-zora-mint tabular-fa">۷۴٪</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-zora-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-zora-mint to-emerald-300"
            initial={{ width: "10%" }}
            whileInView={{ width: "74%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
