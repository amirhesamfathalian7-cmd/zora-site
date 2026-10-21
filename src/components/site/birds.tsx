"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ============================================================
   ZORA's beloved bird characters, hand-drawn in SVG.
   - MessengerBird: lavender postman bird with cap & satchel
   - FlipBird: mint bookish bird with glasses & a page
   Both blink, flap and bob — fully vector, fully ours.
   ============================================================ */

function BirdShadow({ className }: { className?: string }) {
  return (
    <motion.svg
      width="72"
      height="14"
      viewBox="0 0 72 14"
      className={className}
      animate={{ scaleX: [1, 0.82, 1], opacity: [0.35, 0.22, 0.35] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <ellipse cx="36" cy="7" rx="30" ry="5" fill="rgba(141,125,232,0.45)" />
    </motion.svg>
  );
}

function Blush({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r="4.2" fill="rgba(240,128,128,0.4)" />;
}

function Eye({ cx, cy, delay = 0 }: { cx: number; cy: number; delay?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="7.4" fill="#FFFFFF" />
      <motion.g
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
        animate={{ scaleY: [1, 1, 0.06, 1, 1] }}
        transition={{ duration: 4.4, repeat: Infinity, times: [0, 0.88, 0.92, 0.95, 1], delay }}
      >
        <circle cx={cx + 1.4} cy={cy} r="3.6" fill="#202127" />
        <circle cx={cx + 2.8} cy={cy - 1.6} r="1.15" fill="#FFFFFF" />
      </motion.g>
    </g>
  );
}

interface BirdProps {
  className?: string;
  /** gentle levitation of the whole bird */
  float?: boolean;
  /** idle bobbing of body (perched feel) */
  bob?: boolean;
}

/* ------------------------------------------------------------
   MessengerBird — brings science facts & update news
   ------------------------------------------------------------ */
export function MessengerBird({ className, float = false, bob = true }: BirdProps) {
  const reduce = useReducedMotion();
  const flapOn = !reduce;
  const bobOn = !reduce && bob;

  return (
    <motion.div
      className={className}
      animate={float && !reduce ? { y: [0, -12, 0] } : undefined}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 150 150" fill="none" className="h-full w-full" role="img" aria-label="پرنده پیام‌رسان zora">
        <defs>
          <linearGradient id="mb-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BDB3FF" />
            <stop offset="100%" stopColor="#8D7DE8" />
          </linearGradient>
          <linearGradient id="mb-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F1FF" />
            <stop offset="100%" stopColor="#D9D2FF" />
          </linearGradient>
          <linearGradient id="mb-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A99BFF" />
            <stop offset="100%" stopColor="#7A68D6" />
          </linearGradient>
        </defs>

        <motion.g
          animate={bobOn ? { y: [0, -4, 0], rotate: [0, -1.5, 0] } : undefined}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* tail feathers */}
          <g fill="#7A68D6">
            <ellipse cx="26" cy="82" rx="17" ry="7" transform="rotate(-24 26 82)" />
            <ellipse cx="24" cy="92" rx="15" ry="6" transform="rotate(-8 24 92)" fill="#8D7DE8" />
            <ellipse cx="26" cy="101" rx="13" ry="5.4" transform="rotate(10 26 101)" fill="#6E5CC8" />
          </g>

          {/* body */}
          <ellipse cx="78" cy="80" rx="37" ry="33" fill="url(#mb-body)" />
          {/* belly */}
          <ellipse cx="80" cy="92" rx="22" ry="17" fill="url(#mb-belly)" />

          {/* head tuft */}
          <path d="M74 34c2.5-7 8-10.5 13-11-1.2 4.4.2 8.2 2.4 11.4C86 33 80 32.4 74 34Z" fill="#A99BFF" />

          {/* postman cap */}
          <g>
            <path d="M52 44c2-13.5 13.5-22 27.5-22S104.5 30.5 106.5 44c-8.5-4.6-17.4-6.9-27.2-6.9S60.6 39.4 52 44Z" fill="#E8B86D" />
            <path d="M52 44c9-5.4 17.5-8 27.3-8s18.6 2.6 27.2 8c1.9 1.1 1.2 4.4-1 4.4H53c-2.2 0-2.9-3.3-1-4.4Z" fill="#D9A55C" />
            <circle cx="79.5" cy="24.5" r="3.4" fill="#F2E7CE" />
          </g>

          {/* eyes */}
          <Eye cx={66} cy={57} />
          <Eye cx={92} cy={57} delay={0.35} />

          {/* beak */}
          <path d="M75 64.5 79 76l4-11.5c-2.6-1.5-5.4-1.5-8 0Z" fill="#F5A66B" />
          <path d="M75 64.5c2.6-1.5 5.4-1.5 8 0l-1.8 2.6c-1.5-.8-3-.8-4.4 0l-1.8-2.6Z" fill="#E08A4C" />

          <Blush cx={57} cy={70} />
          <Blush cx={101} cy={70} />

          {/* wing (front) */}
          <motion.g
            style={{ originX: "86px", originY: "76px" }}
            animate={flapOn ? { rotate: [8, -30, 8] } : undefined}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M88 74c14-3 26 1.5 31 10.5-9.5 6.5-24 6-32-2.5-2.6-2.8-2.4-7 1-8Z"
              fill="url(#mb-wing)"
            />
            <path d="M92 79c9-1.4 17.5.8 23 5.4" stroke="#6E5CC8" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          </motion.g>

          {/* satchel strap */}
          <path d="M60 58 96 102" stroke="#B07B4F" strokeWidth="4.6" strokeLinecap="round" opacity="0.9" />
          {/* satchel with love letter */}
          <g>
            <rect x="92" y="96" width="26" height="20" rx="5" fill="#C08A57" />
            <rect x="96" y="88" width="19" height="13" rx="2.5" fill="#FDFDFB" />
            <path d="M96 89.6l9.5 6 9.5-6" stroke="#A99BFF" strokeWidth="1.7" fill="none" strokeLinecap="round" />
            <path d="M105.5 111.5c-2.4-2.1-4.8-4.2-4.8-6.4 0-1.5 1.2-2.6 2.6-2.6 1 0 1.7.4 2.2 1.2.5-.8 1.2-1.2 2.2-1.2 1.4 0 2.6 1.1 2.6 2.6 0 2.2-2.4 4.3-4.8 6.4Z" fill="#F08080" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------
   FlipBird — the page-flipping buddy with glasses
   ------------------------------------------------------------ */
export function FlipBird({ className, float = false, bob = true }: BirdProps) {
  const reduce = useReducedMotion();
  const flapOn = !reduce;
  const bobOn = !reduce && bob;

  return (
    <motion.div
      className={className}
      animate={float && !reduce ? { y: [0, -10, 0] } : undefined}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 150 150" fill="none" className="h-full w-full" role="img" aria-label="پرنده ورق‌زن zora">
        <defs>
          <linearGradient id="fb-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FDDBE" />
            <stop offset="100%" stopColor="#4FB89A" />
          </linearGradient>
          <linearGradient id="fb-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0FBF6" />
            <stop offset="100%" stopColor="#C9EEDF" />
          </linearGradient>
          <linearGradient id="fb-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7BD2B0" />
            <stop offset="100%" stopColor="#3FA486" />
          </linearGradient>
        </defs>

        <motion.g
          animate={bobOn ? { y: [0, -4.5, 0], rotate: [0, 1.6, 0] } : undefined}
          transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* tail */}
          <g fill="#3FA486">
            <ellipse cx="30" cy="78" rx="16" ry="6.6" transform="rotate(-26 30 78)" />
            <ellipse cx="28" cy="88" rx="14" ry="5.6" transform="rotate(-9 28 88)" fill="#4FB89A" />
            <ellipse cx="30" cy="97" rx="12" ry="5" transform="rotate(11 30 97)" fill="#358C74" />
          </g>

          {/* body */}
          <ellipse cx="80" cy="80" rx="36" ry="32" fill="url(#fb-body)" />
          <ellipse cx="82" cy="92" rx="21" ry="16" fill="url(#fb-belly)" />

          {/* hair tuft */}
          <path d="M84 34c0-6.5 4-11.5 9.5-13.5-.4 4.3 1.3 7.8 4.2 10.6-4.6-.2-9.1.7-13.7 2.9Z" fill="#7BD2B0" />

          {/* round glasses */}
          <g stroke="#5F6673" strokeWidth="2.4" fill="rgba(255,255,255,0.92)">
            <circle cx="66" cy="58" r="9.6" />
            <circle cx="93" cy="58" r="9.6" />
          </g>
          <path d="M75.4 57.4c2.4-1.8 6.4-1.8 8.8 0" stroke="#5F6673" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <motion.g
            style={{ originX: "79px", originY: "58px" }}
            animate={flapOn ? { scaleY: [1, 1, 0.06, 1, 1] } : undefined}
            transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
          >
            <circle cx="66" cy="58.5" r="3.6" fill="#202127" />
            <circle cx="93" cy="58.5" r="3.6" fill="#202127" />
            <circle cx="67.4" cy="57" r="1.15" fill="#FFF" />
            <circle cx="94.4" cy="57" r="1.15" fill="#FFF" />
          </motion.g>

          {/* beak holding page corner */}
          <path d="M76.5 66 80.5 77l4-11c-2.6-1.4-5.4-1.4-8 0Z" fill="#F5A66B" />
          <g>
            <path d="M84 70l20 4.5-4 12.5-17.5-6.5Z" fill="#FDFCF8" stroke="#DDD8CA" strokeWidth="1.2" />
            <path d="M104 74.5l-9 5.2 5.5 7.3Z" fill="#E7E2D4" />
            <path d="M89 76.5l10 2.2M88 80l8.5 2" stroke="#B9C4DE" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          <Blush cx={58} cy={72} />
          <Blush cx={104} cy={69} />

          {/* wing */}
          <motion.g
            style={{ originX: "88px", originY: "78px" }}
            animate={flapOn ? { rotate: [6, -26, 6] } : undefined}
            transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M90 76c13.5-2.6 25 2 30 10.8-9.2 6.2-23 5.6-30.6-2.6-2.4-2.7-2.3-6.8.6-8.2Z"
              fill="url(#fb-wing)"
            />
            <path d="M94 81c8.6-1.2 16.6.9 21.8 5.2" stroke="#2F7D68" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </motion.g>

          {/* tiny feet */}
          <g stroke="#F5A66B" strokeWidth="2.6" strokeLinecap="round">
            <path d="M70 111v7M78 112v7" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------
   Speech bubble used by birds
   ------------------------------------------------------------ */
export function BirdBubble({
  children,
  className,
  tailSide = "bottom",
}: {
  children: ReactNode;
  className?: string;
  tailSide?: "bottom" | "top";
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="rounded-2xl border border-zora-700/80 bg-zora-800/90 px-5 py-4 text-sm leading-7 text-zora-silver shadow-[0_14px_44px_-14px_rgba(141,125,232,0.45)]">
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`absolute h-4 w-4 rotate-45 border-zora-700/80 bg-zora-800/90 ${
          tailSide === "bottom"
            ? "-bottom-2 start-10 border-b border-e"
            : "-top-2 start-10 border-s border-t"
        }`}
      />
    </div>
  );
}

export { BirdShadow };
