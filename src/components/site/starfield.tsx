"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  speed: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/** Living night-sky: twinkling stars + occasional shooting stars */
export function Starfield({ density = 150, className }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = performance.now() + 2500;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      stars.length = 0;
      const count = Math.min(density, Math.floor((w * h) / 9000) + 40);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.3,
          base: 0.25 + Math.random() * 0.4,
          amp: 0.25 + Math.random() * 0.35,
          speed: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnMeteor = (now: number) => {
      const fromX = Math.random() * w * 0.7 + w * 0.15;
      const speed = 5.5 + Math.random() * 3;
      meteors.push({
        x: fromX,
        y: Math.random() * h * 0.3,
        vx: -speed * (0.7 + Math.random() * 0.5),
        vy: speed * (0.45 + Math.random() * 0.3),
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
      nextMeteor = now + 3800 + Math.random() * 5200;
    };

    const draw = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const t = now / 1000;
      for (const s of stars) {
        const a = reduce ? s.base : s.base + Math.sin(t * s.speed + s.phase) * s.amp;
        const alpha = Math.max(0.05, Math.min(1, a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${214 + Math.floor(s.r * 20)}, ${218 + Math.floor(s.r * 18)}, 235, ${alpha})`;
        ctx.fill();
      }

      if (!reduce) {
        if (now > nextMeteor) spawnMeteor(now);
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life++;
          const fade = 1 - m.life / m.maxLife;
          if (fade <= 0) {
            meteors.splice(i, 1);
            continue;
          }
          const grad = ctx.createLinearGradient(
            m.x,
            m.y,
            m.x - m.vx * 12,
            m.y - m.vy * 12
          );
          grad.addColorStop(0, `rgba(220, 214, 255, ${0.9 * fade})`);
          grad.addColorStop(1, "rgba(169, 155, 255, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
