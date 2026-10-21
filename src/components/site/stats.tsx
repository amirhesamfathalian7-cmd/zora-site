"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { STATS, toFa } from "@/lib/zora";
import { Reveal } from "./reveal";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 0.65, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-fa text-4xl font-black text-gradient-lav sm:text-5xl">
      {toFa(display)}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section id="stats" className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-zora-700/60 bg-zora-900/50 p-6 backdrop-blur sm:gap-6 sm:p-10 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.08 * i} className="text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <CountUp value={s.value} suffix={s.suffix} />
                  <span className="text-sm font-bold text-zora-silver sm:text-base">{s.label}</span>
                  <span className="text-xs text-zora-silver5">{s.sub}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
