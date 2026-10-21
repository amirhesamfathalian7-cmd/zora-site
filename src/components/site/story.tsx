"use client";

import { Backpack, Lightbulb, Heart, Sparkles } from "lucide-react";
import { STORY } from "@/lib/zora";
import { Reveal } from "./reveal";

const ICONS = {
  backpack: Backpack,
  bulb: Lightbulb,
  heart: Heart,
} as const;

export function Story() {
  return (
    <section id="story" className="relative py-20 sm:py-28">
      {/* soft section glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-24 h-72 w-72 rounded-full bg-zora-lavp/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            <Sparkles className="h-3.5 w-3.5" />
            داستان zora
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            چرا <span className="text-gradient-lav">zora</span> را ساختیم؟
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            هر اپ خوب، از یک «چرا»ی قشنگ شروع می‌شود. این، قصه‌ی zora است — قصه‌ای که
            هنوز هم هر روز ادامه دارد.
          </p>
        </Reveal>

        <div className="relative space-y-14 sm:space-y-20">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute inset-y-6 start-[27px] hidden w-px bg-gradient-to-b from-zora-lav/50 via-zora-lav/15 to-transparent sm:block"
          />
          {STORY.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            const reversed = i % 2 === 1;
            return (
              <Reveal key={s.num} delay={0.05}>
                <article
                  className={`relative flex flex-col gap-6 sm:flex-row sm:items-start ${
                    reversed ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* number badge on the line */}
                  <div className="hidden sm:block">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zora-lav/30 bg-zora-tint text-sm font-black text-zora-lavh shadow-[0_0_30px_-6px_rgba(169,155,255,0.5)]">
                      {s.num}
                    </span>
                  </div>
                  <div className={`flex-1 ${reversed ? "sm:text-end" : ""}`}>
                    <div className={`mb-3 flex items-center gap-3 ${reversed ? "sm:flex-row-reverse" : ""}`}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zora-lav/15 text-zora-lavh ring-1 ring-zora-lav/25 sm:hidden">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-extrabold text-zora-silver sm:text-2xl">{s.title}</h3>
                    </div>
                    <p className={`max-w-2xl text-[15px] leading-8 text-zora-silver5 ${reversed ? "sm:ms-auto" : ""}`}>
                      {s.body}
                    </p>
                  </div>
                  <div className={`hidden lg:block ${reversed ? "" : ""}`}>
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zora-800/80 text-zora-lav ring-1 ring-zora-700">
                      <Icon className="h-7 w-7" />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
