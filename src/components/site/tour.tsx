"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Library, BookOpen, AlarmClock } from "lucide-react";
import { Reveal } from "./reveal";
import { MockupFrame, BookGridMock, ReaderMock, FocusMock } from "./app-mockup";

const TABS = [
  {
    id: "home",
    label: "خانه و کتاب‌ها",
    icon: Library,
    title: "کتاب‌خانه‌ای که خودش راه می‌رود",
    body:
      "مقطع را انتخاب کن، پایه را ببین، درس را باز کن. جلد هر کتاب، همان جلد آشنای خودش است؛ فقط این‌بار داخل یک قفسه‌ی شیشه‌ای زیبا و همیشه مرتب.",
  },
  {
    id: "reading",
    label: "حین خواندن",
    icon: BookOpen,
    title: "بخوان، رنگ کن، فهمیده باش",
    body:
      "با قلم، زیر نکته‌های مهم خط بکش؛ با ماژیک، جمله‌های طلایی را هایلایت کن. ساعت تمرکز گوشه‌ی صفحه حواست را جمع می‌کند و زیپ هم هر از گاهی یک نکته‌ی علمی می‌آورد.",
  },
  {
    id: "focus",
    label: "انرژی و تمرکز",
    icon: AlarmClock,
    title: "خستگی را شکار کن",
    body:
      "پرنده‌ی ورق‌زن با انرژی پر، صفحه‌ها را برایت می‌گردد و ساعت تمرکز با چرخش آرامش، زمان مطالعه را قدری بازی‌گونه و لذت‌بخش می‌کند.",
  },
] as const;

export function Tour() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("home");
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section id="tour" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-zora-lavp/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            تور مجازی
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            قبل از نصب، <span className="text-gradient-lav">zora را بگرد</span>
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            سه تا ایستگاه کوتاه — ببین داخل اپ چه خبر است.
          </p>
        </Reveal>

        {/* tabs */}
        <Reveal className="mb-10 flex justify-center">
          <div
            role="tablist"
            aria-label="تور اپلیکیشن"
            className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl border border-zora-700/60 bg-zora-900/70 p-1.5 backdrop-blur"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors sm:px-6 ${
                  tab === t.id ? "text-zora-950" : "text-zora-silver5 hover:text-zora-silver"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tour-tab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-l from-zora-lavp to-zora-lav shadow-[0_8px_28px_-8px_rgba(169,155,255,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <t.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* mockup */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-[620px]">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-b from-zora-lavp/15 to-transparent blur-2xl"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.985 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <MockupFrame
                    title={
                      tab === "home"
                        ? "zora — کتاب‌خانه‌ی درسی"
                        : tab === "reading"
                          ? "zora — علوم تجربی پایه‌ی هفتم"
                          : "zora — حالت تمرکز"
                    }
                  >
                    {tab === "home" && <BookGridMock />}
                    {tab === "reading" && <ReaderMock />}
                    {tab === "focus" && <FocusMock />}
                  </MockupFrame>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* description */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-4 text-2xl font-black text-zora-silver sm:text-3xl">{current.title}</h3>
                <p className="text-[15px] leading-8 text-zora-silver5">{current.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(tab === "home"
                    ? ["ناوبری مرحله‌به‌مرحله", "جلد واقعی کتاب‌ها", "۱۲ پایه، همه‌ی درس‌ها"]
                    : tab === "reading"
                      ? ["قلم و هایلایت", "پاک‌کن و کالیبراسیون", "نکته‌های علمی زیپ"]
                      : ["انرژی ورقو", "ساعت تمرکز", "شکار خستگی"]
                  ).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-zora-700/70 bg-zora-800/60 px-3.5 py-1.5 text-xs font-semibold text-zora-silver3"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
