"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Play, WifiOff, BadgeCheck, HeartHandshake, ChevronDown } from "lucide-react";
import { Starfield } from "./starfield";
import { MessengerBird } from "./birds";
import { MockupFrame, ReaderMock } from "./app-mockup";

function Aurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 start-[-12%] h-[480px] w-[560px] animate-aurora-a rounded-full bg-zora-lavp/25 blur-[130px]" />
      <div className="absolute bottom-[-20%] end-[-10%] h-[520px] w-[600px] animate-aurora-b rounded-full bg-zora-sky/16 blur-[150px]" />
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-zora-lav/10 blur-[120px]" />
    </div>
  );
}

export function Hero() {
  // subtle mouse parallax for the mockup
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-10"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <Starfield />
      <Aurora />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* ---- copy ---- */}
        <div className="text-center lg:text-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-semibold text-zora-lavh"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zora-lav opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zora-lav" />
            </span>
            سایت رسمی zora — نسخه‌ی ۱.۰ برای ویندوز ۷ تا ۱۱
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="text-gradient-silver">همه‌ی کتاب‌های درسی،</span>
            <br />
            <span className="text-gradient-lav">یک کلیک دورتر</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-zora-silver5 sm:text-lg sm:leading-9 lg:mx-0"
          >
            <span className="font-bold text-zora-silver">zora</span>؛ کتاب‌خوانِ رسمی و کاملاً آفلاین مدارس ایران — از اول دبستان تا دوازدهم،
            با ابزارهای یادداشت حرفه‌ای، پرنده‌های بامزه‌ی دانش و تجربه‌ای که خواندن را
            به کاری دوست‌داشتنی تبدیل می‌کند.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#download"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-l from-zora-lavp to-zora-lav px-8 py-4 text-base font-extrabold text-zora-950 shadow-[0_18px_50px_-12px_rgba(169,155,255,0.7)] transition-all duration-200 hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              <Download className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              دانلود zora — رایگان
              <span aria-hidden="true" className="absolute inset-y-0 w-1/3 animate-shine bg-white/30 blur-md" />
            </a>
            <a
              href="#tour"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-zora-700 bg-zora-900/60 px-8 py-4 text-base font-bold text-zora-silver3 backdrop-blur transition-all duration-200 hover:border-zora-lav/40 hover:text-zora-silver sm:w-auto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zora-lav/20">
                <Play className="h-3 w-3 fill-zora-lavh text-zora-lavh" />
              </span>
              تور مجازی اپ
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zora-silver5 lg:justify-start"
          >
            <li className="flex items-center gap-1.5">
              <WifiOff className="h-3.5 w-3.5 text-zora-lav" /> ۱۰۰٪ آفلاین
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-zora-lav" /> بدون تبلیغ و اشتراک
            </li>
            <li className="flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-zora-lav" /> ساخته‌شده با عشق برای ایران
            </li>
          </motion.ul>
        </div>

        {/* ---- mockup ---- */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative mx-auto w-full max-w-[560px]"
          style={{ perspective: 1200 }}
        >
          {/* glow under the window */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-[40px] bg-zora-lavp/20 blur-3xl animate-pulse-glow"
          />
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
            <MockupFrame>
              <ReaderMock />
            </MockupFrame>

            {/* messenger bird delivering a fact */}
            <motion.div
              className="absolute -top-10 -start-4 w-24 sm:-start-10 sm:w-28"
              initial={{ opacity: 0, x: -60, rotate: -14 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 1.1, duration: 0.8, type: "spring", stiffness: 90 }}
            >
              <MessengerBird float />
            </motion.div>

            {/* floating emblem chip */}
            <motion.div
              className="absolute -bottom-6 -end-3 h-16 w-16 rounded-2xl border border-zora-700/80 bg-zora-950/90 p-1.5 shadow-xl backdrop-blur sm:-end-6 sm:h-20 sm:w-20"
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-xl">
                <Image src="/emblem.png" alt="نشان فلزی zora" fill sizes="80px" className="emblem-blend object-cover" />
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#stats"
        aria-label="رفتن به بخش بعدی"
        className="relative z-10 mx-auto mt-12 flex h-10 w-10 items-center justify-center rounded-full border border-zora-700/60 text-zora-silver5"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
