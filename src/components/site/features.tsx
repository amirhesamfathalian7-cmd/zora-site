"use client";

import { motion } from "framer-motion";
import {
  Library,
  PenLine,
  Bird,
  ScrollText,
  Clock3,
  WifiOff,
  MonitorSmartphone,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { FEATURES } from "@/lib/zora";
import { Reveal } from "./reveal";

const ICONS = {
  library: Library,
  pen: PenLine,
  bird: Bird,
  page: ScrollText,
  clock: Clock3,
  "wifi-off": WifiOff,
  monitor: MonitorSmartphone,
  sparkles: Sparkles,
  download: RefreshCw,
} as const;

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-zora-sky/8 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            امکانات
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            هر چیزی که برای <span className="text-gradient-lav">خواندنِ خوش</span> لازم داری
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            از قفسه‌بندی کتاب‌خانه تا پرنده‌های بامزه — همه‌چیز با وسواس طراحی شده تا
            درس‌خواندن روی تخته‌ی هوشمند و رایانه، حس یک ماجراجویی بدهد.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-zora-700/60 bg-zora-900/60 p-6 transition-colors duration-300 hover:border-zora-lav/40 hover:bg-zora-850"
                >
                  {/* hover glow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 start-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-zora-lav/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zora-lav/12 text-zora-lav ring-1 ring-zora-lav/25 transition-all duration-300 group-hover:bg-zora-lav group-hover:text-zora-950 group-hover:shadow-[0_0_24px_-2px_rgba(169,155,255,0.8)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2.5 text-lg font-extrabold text-zora-silver">{f.title}</h3>
                  <p className="text-sm leading-7 text-zora-silver5">{f.body}</p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
