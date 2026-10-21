"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import Image from "next/image";
import { BRAND, NAV_LINKS, toFa } from "@/lib/zora";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* scroll progress */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2.5px] origin-right bg-gradient-to-l from-zora-lav via-zora-sky to-zora-lavh"
        style={{ scaleX: progress }}
      />
      <div
        className={`transition-all duration-300 ${
          scrolled ? "glass border-b border-zora-700/50 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.8)]" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6" aria-label="ناوبری اصلی">
          {/* brand */}
          <a href="#top" className="group flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-zora-700/70 bg-zora-950 shadow-inner">
              <Image
                src="/emblem.png"
                alt="نشان zora"
                fill
                sizes="40px"
                className="emblem-blend object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
            </span>
            <span className="flex flex-col leading-none" dir="ltr">
              <span className="text-gradient-lav text-[1.35rem] font-black lowercase tracking-tight">{BRAND.name}</span>
              <span className="mt-0.5 text-[9px] font-semibold tracking-[0.34em] text-zora-silver5">reader</span>
            </span>
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                    active === link.href
                      ? "text-zora-silver"
                      : "text-zora-silver5 hover:text-zora-silver"
                  }`}
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-zora-tint ring-1 ring-zora-lav/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#download"
              className="group relative hidden overflow-hidden rounded-full bg-gradient-to-l from-zora-lavp to-zora-lav px-5 py-2.5 text-sm font-bold text-zora-950 shadow-[0_8px_30px_-8px_rgba(169,155,255,0.65)] transition-transform duration-200 hover:scale-[1.04] active:scale-95 sm:inline-flex sm:items-center sm:gap-2"
            >
              <Download className="h-4 w-4" />
              دانلود رایگان
              <span aria-hidden="true" className="absolute inset-y-0 w-1/3 animate-shine bg-white/25 blur-md" />
            </a>
            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zora-700/70 bg-zora-900/80 text-zora-silver3 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="glass border-b border-zora-700/50 lg:hidden"
          >
            <ul className="mx-auto max-w-6xl space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                      active === link.href
                        ? "bg-zora-tint text-zora-silver ring-1 ring-zora-lav/30"
                        : "text-zora-silver5 hover:bg-zora-800/70 hover:text-zora-silver"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#download"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-zora-lavp to-zora-lav px-4 py-3 text-sm font-bold text-zora-950"
                >
                  <Download className="h-4 w-4" />
                  دانلود رایگان zora
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Small brand chip reused in footer etc. */
export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16" : size === "sm" ? "h-8 w-8" : "h-12 w-12";
  return (
    <span className={`relative ${dim} overflow-hidden rounded-2xl border border-zora-700/70 bg-zora-950`}>
      <Image src="/emblem.png" alt="نشان zora" fill sizes="64px" className="emblem-blend object-cover" />
    </span>
  );
}

export function FaNum({ children }: { children: string | number }) {
  return <span className="tabular-fa">{toFa(children)}</span>;
}
