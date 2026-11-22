'use client';

import { useEffect, useRef } from 'react';
import { BAYER, prefersReducedMotion } from '@/lib/dither';
import { color, introPalette } from '@/lib/tokens';

const CS = 6, R = 30, LIFE = 360;
const TONES = [color.signal, introPalette.cardMid, color.echo];

/**
 * The dithered cursor (canvas "cursor tramado"): a small disc of 6 px cells,
 * ordered so its edge breaks up, with a short trail that cools from signal
 * blue to the pale echo. No lens and no bubble; the system cursor stays.
 * It is on wherever `html[data-cursor]` is set: the section pages, and the
 * landing once the story has ended. Off for touch and reduced motion.
 */
export function DitherCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const ctx = cv.getContext('2d')!;
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0, ring: { x: number; y: number; t: number } | null = null, drawn = false;
    const on = () => document.documentElement.hasAttribute('data-cursor');
    const move = (e: PointerEvent) => { if (e.pointerType === 'mouse' && on()) pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); };
    const down = (e: PointerEvent) => { if (e.pointerType === 'mouse' && on()) ring = { x: e.clientX, y: e.clientY, t: performance.now() }; };
    const size = () => { cv.width = Math.ceil(window.innerWidth / CS) * CS; cv.height = Math.ceil(window.innerHeight / CS) * CS; };
    size();
    const heat = (x: number, y: number, now: number) => {
      let best = 0;
      for (const p of pts) {
        const age = (now - p.t) / LIFE; if (age >= 1) continue;
        const rr = R * (1 - 0.5 * age), d = Math.hypot(x - p.x, y - p.y);
        if (d < rr) best = Math.max(best, (1 - d / rr) * (1 - age));
      }
      if (ring) { const ra = (now - ring.t) / 500; if (ra < 1) { const rd = Math.abs(Math.hypot(x - ring.x, y - ring.y) - ra * 90); if (rd < 8) best = Math.max(best, (1 - rd / 8) * (1 - ra)); } }
      return best;
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      if (ring && now - ring.t > 500) ring = null;
      if (!pts.length && !ring) { if (drawn) { ctx.clearRect(0, 0, cv.width, cv.height); drawn = false; } return; }
      ctx.clearRect(0, 0, cv.width, cv.height); drawn = true;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
      if (ring) { x0 = Math.min(x0, ring.x - 100); y0 = Math.min(y0, ring.y - 100); x1 = Math.max(x1, ring.x + 100); y1 = Math.max(y1, ring.y + 100); }
      const c0 = Math.max(0, Math.floor((x0 - R) / CS)), c1 = Math.floor((x1 + R) / CS), r0 = Math.max(0, Math.floor((y0 - R) / CS)), r1 = Math.floor((y1 + R) / CS);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
        const h = heat(c * CS + 3, r * CS + 3, now);
        if (h <= 0 || h * 1.15 < (BAYER[(r & 3) * 4 + (c & 3)] + 0.5) / 16) continue;
        ctx.fillStyle = TONES[h > 0.6 ? 0 : h > 0.3 ? 1 : 2];
        ctx.fillRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2);
      }
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('resize', size);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="dither-cursor" aria-hidden="true" />;
}
