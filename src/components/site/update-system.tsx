"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Globe, MousePointerClick, Download, RotateCcw } from "lucide-react";
import { toFa } from "@/lib/zora";
import { Reveal } from "./reveal";
import { MessengerBird, BirdBubble } from "./birds";

const STEPS = [
  {
    icon: BellRing,
    title: "نسخه‌ی جدید منتشر می‌شود",
    body: "تیم zora اپدیت تازه را آماده می‌کند و روی سایت رسمی قرار می‌دهد.",
  },
  {
    icon: Globe,
    title: "پرنده‌ی پیام‌رسان خبر می‌دهد",
    body: "داخل اپ، زیپ بال می‌زند و برای کاربرانی که نسخه‌ی قدیمی دارند، پیام می‌آورد.",
  },
  {
    icon: MousePointerClick,
    title: "یک کلیک تا دانلود",
    body: "با کلیک روی «سایت رسمی ما»، مستقیم به همین صفحه‌ی دانلود می‌رسی. همین!",
  },
];

export function UpdateSystem() {
  const [state, setState] = useState<"idle" | "flying" | "arrived" | "dismissed">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const simulate = () => {
    timers.current.forEach(clearTimeout);
    setState("flying");
    timers.current.push(setTimeout(() => setState("arrived"), 1100));
  };

  const dismiss = () => setState("dismissed");

  return (
    <section id="updates" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-zora-gold/8 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zora-gold/30 bg-zora-gold/10 px-4 py-1.5 text-xs font-bold text-zora-gold">
            <BellRing className="h-3.5 w-3.5" />
            سیستم هوشمند اطلاع‌رسانی
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            اپدیت‌ها دیگر <span className="text-gradient-lav">سکوت نمی‌کنند</span>
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            هر وقت نسخه‌ی تازه‌ای از zora آماده شود، پرنده‌ی پیام‌رسان داخل اپ خودش
            سراغ کاربران می‌رود و خبر خوشحال‌کننده را می‌رساند.
          </p>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
          {/* flow steps */}
          <ol className="relative space-y-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.08 * i}>
                <li className="relative flex gap-4 rounded-2xl border border-zora-700/60 bg-zora-900/60 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zora-lav/12 text-zora-lavh ring-1 ring-zora-lav/25">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zora-lav tabular-fa">{toFa(i + 1)}</span>
                      <h3 className="font-extrabold text-zora-silver">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-7 text-zora-silver5">{s.body}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3.5 right-[38px] h-3.5 w-px bg-gradient-to-b from-zora-lav/50 to-transparent"
                    />
                  )}
                </li>
              </Reveal>
            ))}
          </ol>

          {/* live simulation */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-3xl border border-zora-700/60 bg-gradient-to-b from-zora-900/90 to-zora-950 p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-extrabold text-zora-silver">داخل اپ چه می‌گذرد؟</h3>
                <button
                  type="button"
                  onClick={simulate}
                  className="inline-flex items-center gap-2 rounded-full bg-zora-lav/15 px-4 py-2 text-xs font-bold text-zora-lavh ring-1 ring-zora-lav/30 transition hover:bg-zora-lav/25"
                >
                  {state === "idle" ? (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      شبیه‌سازی انتشار اپدیت
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      دوباره اجرا کن
                    </>
                  )}
                </button>
              </div>

              {/* mini app window */}
              <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-zora-700/70 bg-[#20232A] p-5">
                <div className="mb-4 flex items-center gap-2 text-xs text-zora-silver5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zora-mint" />
                  zora در حال اجراست — همه‌چیز آرام است…
                </div>

                <AnimatePresence mode="wait">
                  {state === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-44 items-center justify-center rounded-xl border border-dashed border-zora-700/60 text-sm text-zora-silver7"
                    >
                      دکمه‌ی بالا را بزن تا پرنده‌ی خبررسان پرواز کند ✨
                    </motion.div>
                  )}

                  {state === "flying" && (
                    <motion.div
                      key="flying"
                      className="absolute bottom-4 -start-20 w-24"
                      initial={{ x: 0, y: 30, rotate: -14, opacity: 1 }}
                      animate={{ x: 680, y: -10, rotate: 10 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.05, ease: "easeIn" }}
                    >
                      <MessengerBird bob={false} />
                    </motion.div>
                  )}

                  {state === "arrived" && (
                    <motion.div
                      key="arrived"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:items-end"
                    >
                      <motion.div
                        initial={{ x: -140, y: 30, rotate: -20, opacity: 0 }}
                        animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 110, damping: 13 }}
                        className="w-24 shrink-0 sm:w-28"
                      >
                        <MessengerBird bob />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.45, duration: 0.4 }}
                        className="flex-1"
                      >
                        <BirdBubble>
                          <p className="font-bold leading-7 text-zora-silver">
                            اپدیت جدید از راه رسید دوست من! 🎉
                          </p>
                          <p className="leading-7 text-zora-silver3">
                            همین حالا می‌تونی از سایت رسمی ما دانلودش کنی و لذت ببری ❤️🌊
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <a
                              href="#download"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-l from-zora-lavp to-zora-lav px-4 py-2 text-xs font-extrabold text-zora-950 transition hover:scale-[1.03]"
                            >
                              <Download className="h-3.5 w-3.5" />
                              دانلود از سایت
                            </a>
                            <button
                              type="button"
                              onClick={dismiss}
                              className="rounded-lg border border-zora-700 px-4 py-2 text-xs font-bold text-zora-silver5 transition hover:text-zora-silver"
                            >
                              باشه، بعداً
                            </button>
                          </div>
                        </BirdBubble>
                      </motion.div>
                    </motion.div>
                  )}

                  {state === "dismissed" && (
                    <motion.div
                      key="dismissed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-44 items-center justify-center text-sm text-zora-silver5"
                    >
                      زیپ با لبخند خداحافظی کرد و پشت درس‌ها پنهان شد 🕊️
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-5 text-xs leading-6 text-zora-silver7">
                این همان سیستمِ اطلاع‌رسانی است که در نسخه‌های بعدی zora داخل خود اپ
                فعال می‌شود؛ پرنده فقط برای کسانی می‌آید که هنوز نسخه‌ی جدید را
                ندارند.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
