"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, Bird, Zap } from "lucide-react";
import { FACTS, toFa } from "@/lib/zora";
import { Reveal } from "./reveal";
import { MessengerBird, FlipBird, BirdBubble } from "./birds";

function MessengerCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % FACTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zora-700/60 bg-gradient-to-b from-zora-900/80 to-zora-950 p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-zora-lavp/15 blur-[90px]"
      />
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zora-lav/15 text-zora-lavh ring-1 ring-zora-lav/25">
          <Sparkles className="h-4.5 w-4.5" />
        </span>
        <h3 className="text-lg font-extrabold text-zora-silver">زیپ — پرنده‌ی پیام‌رسان</h3>
      </div>

      <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <div className="relative w-40 shrink-0 sm:w-44">
          <MessengerBird bob />
          <BirdShadowLocal />
        </div>
        <div className="flex-1">
          <BirdBubble>
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-zora-lavh">
              <Bird className="h-3 w-3" /> نکته‌ی علمی زیپ
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="min-h-[56px]"
              >
                {FACTS[idx]}
              </motion.p>
            </AnimatePresence>
          </BirdBubble>
          <p className="mt-5 text-sm leading-7 text-zora-silver5">
            زیپ کنجکاوترین پرنده‌ی تیم است؛ هر جا درس سخت شود، بال می‌زند و می‌آید تا
            با یک نکته‌ی علمی باحال، لبخند روی صورتت بگذارد.
          </p>
        </div>
      </div>
    </div>
  );
}

function BirdShadowLocal() {
  return <span aria-hidden="true" className="mx-auto mt-1 block h-2 w-16 rounded-full bg-zora-lavp/20 blur-[6px]" />;
}

interface Particle {
  id: number;
  dx: number;
  emoji: "heart" | "zap";
}

function FlipCard() {
  const [energy, setEnergy] = useState(42);
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const [bump, setBump] = useState(0);

  // slow natural decay — invites the user to keep cheering
  useEffect(() => {
    const t = setInterval(() => {
      setEnergy((e) => Math.max(12, e - 1));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const cheer = useCallback(() => {
    setEnergy((e) => Math.min(100, e + 16));
    setBump((b) => b + 1);
    const batch: Particle[] = Array.from({ length: 5 }, () => ({
      id: ++idRef.current,
      dx: (Math.random() - 0.5) * 90,
      emoji: Math.random() > 0.4 ? "heart" : "zap",
    }));
    setParticles((p) => [...p, ...batch]);
    setTimeout(() => {
      setParticles((p) => p.filter((x) => !batch.some((b) => b.id === x.id)));
    }, 1300);
  }, []);

  const mood =
    energy >= 90 ? "پَر پَرشه! آماده‌ی ورق زدن ساعت‌ها درسه 🚀" : energy >= 55 ? "حالش خوبه! یک تشویق دیگه هم بدی نمی‌سازه" : energy >= 30 ? "کمی خسته شده… تشویقش کن!" : "خیلی کم‌انرژیه! یه دست براش بزن 👏";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zora-700/60 bg-gradient-to-b from-zora-900/80 to-zora-950 p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -start-16 h-64 w-64 rounded-full bg-zora-mint/12 blur-[90px]"
      />
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zora-mint/15 text-zora-mint ring-1 ring-zora-mint/25">
          <Zap className="h-4.5 w-4.5" />
        </span>
        <h3 className="text-lg font-extrabold text-zora-silver">ورقو — پرنده‌ی ورق‌زن</h3>
      </div>

      <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <div className="relative w-40 shrink-0 sm:w-44">
          <motion.div
            key={bump}
            animate={bump > 0 ? { y: [0, -26, 0], rotate: [0, -8, 6, 0] } : undefined}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <FlipBird bob />
          </motion.div>
          {/* floating hearts */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 0, y: 10, x: p.dx, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -70, scale: [0.6, 1.2, 1, 0.8] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute bottom-10 left-1/2 text-lg"
                >
                  {p.emoji === "heart" ? "❤️" : "⚡"}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <BirdShadowLocal />
        </div>

        <div className="flex-1">
          <div className="rounded-2xl border border-zora-700/70 bg-zora-850/90 p-5">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="text-zora-silver3">انرژی ورقو</span>
              <span className="text-zora-mint tabular-fa">{toFa(energy)}٪</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zora-800">
              <motion.div
                className={`h-full rounded-full ${
                  energy >= 55
                    ? "bg-gradient-to-l from-zora-mint to-emerald-300"
                    : "bg-gradient-to-l from-zora-gold to-amber-300"
                }`}
                animate={{ width: `${energy}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <p className="mt-3 text-xs leading-6 text-zora-silver5">{mood}</p>
            <button
              type="button"
              onClick={cheer}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-zora-mint to-emerald-300 px-5 py-3 text-sm font-extrabold text-zora-950 shadow-[0_10px_30px_-10px_rgba(120,201,165,0.8)] transition-transform duration-150 hover:scale-[1.02] active:scale-95"
            >
              <Heart className="h-4 w-4 fill-zora-950/80" />
              تشویقش کن!
            </button>
          </div>
          <p className="mt-4 text-sm leading-7 text-zora-silver5">
            وقتی حوصله‌ات سر می‌رود، ورقو خودش صفحات را می‌ورزد؛ فقط باید انرژی‌اش را
            با تشویق پر نگه داری! همین بازی کوچک، خستگی درس را با خنده عوض می‌کند.
          </p>
        </div>
      </div>
    </div>
  );
}

export function BirdsSection() {
  return (
    <section id="birds" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            آشنایی با دوست‌های جدید
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            پرنده‌های <span className="text-gradient-lav">zora</span> را ببین!
          </h2>
          <p className="mt-4 leading-8 text-zora-silver5">
            دو تا همراه کوچک که درس‌خواندن را به یک تجربه‌ی زنده تبدیل می‌کنند — اینجا
            هم می‌توانی باشان بازی کنی!
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <MessengerCard />
          </Reveal>
          <Reveal delay={0.12}>
            <FlipCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
