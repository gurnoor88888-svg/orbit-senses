import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
};

/** Lightweight canvas starfield: twinkling stars + slow drift. Fixed behind content. */
export function StarField({ density = 0.00012 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.min(320, Math.floor(w * h * density * devicePixelRatio));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.1 + 0.3) * devicePixelRatio,
        base: Math.random() * 0.45 + 0.2,
        speed: Math.random() * 0.9 + 0.35,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(s.phase + (t / 1000) * s.speed);
        const alpha = s.base * (0.55 + 0.45 * tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.92 0.03 220 / ${alpha.toFixed(3)})`;
        ctx.fill();
        s.y += 0.02 * devicePixelRatio * s.speed;
        if (s.y > h) s.y = 0;
      }
      raf = requestAnimationFrame(draw);
    };

    seed();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(seed);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
