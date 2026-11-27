'use client';

import { useEffect, useRef, useState } from 'react';
import type { BitsplashPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { acidShape, type AcidShapeId } from '@/lib/acid-shapes';
import { bitsplash as T, corkGrid } from '@/lib/tokens';

const CELL = 8;
const SHAPES: AcidShapeId[] = ['f1', 'f4', 'f11', 'f13', 'f22', 'f34'];
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const GLYPHS = '#%@&*+=01<>/\\░▒▓';

/**
 * bitsplash (canvas "lab: bitsplash", 2026-11-26). The landing's grid, grey and
 * empty. Every click throws an acid shape that bursts out cell by cell behind a
 * front of flickering glyphs, then settles in two dithered acids; a few drops
 * land around it. "clean" wipes the grid; "download" keeps it as a PNG.
 */
export function Bitsplash({ page }: { page: BitsplashPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ splash: (x: number, y: number) => void; wipe: () => void } | null>(null);
  const [n, setN] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const root = rootRef.current, cv = cvRef.current; if (!root || !cv) return;
    setTop(root.getBoundingClientRect().top + window.scrollY);
    const reduce = prefersReducedMotion();
    let GW = 0, GH = 0, born = new Float32Array(0), pair = new Uint8Array(0), seed = new Uint8Array(0), pending: [number, number, number][] = [];
    const fit = () => {
      const w = Math.ceil(cv.clientWidth / CELL), h = Math.ceil(cv.clientHeight / CELL);
      if (w === GW && h === GH) return;
      // keep what is already there when the window changes size
      const nb = new Float32Array(w * h).fill(-1), np = new Uint8Array(w * h), ns = new Uint8Array(w * h);
      for (let y = 0; y < Math.min(h, GH); y++) for (let x = 0; x < Math.min(w, GW); x++) { nb[y * w + x] = born[y * GW + x]; np[y * w + x] = pair[y * GW + x]; ns[y * w + x] = seed[y * GW + x]; }
      GW = w; GH = h; born = nb; pair = np; seed = ns; pending = [];
      cv.width = GW * CELL; cv.height = GH * CELL;
    };
    fit();
    const stamp = (cx: number, cy: number, k: number, now: number, pi: number, spread: number) => {
      const sh = acidShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]), sw = Math.ceil(sh.w / k), shh = Math.ceil(sh.h / k);
      const ox = Math.round(cx - sw / 2), oy = Math.round(cy - shh / 2), rot = Math.floor(Math.random() * 4);
      for (let y = 0; y < shh; y++) for (let x = 0; x < sw; x++) {
        if (!sh.cells[Math.min(sh.h - 1, y * k) * sh.w + Math.min(sh.w - 1, x * k)]) continue;
        const X = rot & 1 ? ox + (sw - 1 - x) : ox + x, Y = rot & 2 ? oy + (shh - 1 - y) : oy + y;
        if (X < 0 || Y < 0 || X >= GW || Y >= GH) continue;
        pending.push([Y * GW + X, now + (reduce ? 0 : Math.hypot(X - cx, Y - cy) * spread * (0.8 + Math.random() * 0.5)), pi]);
      }
    };
    api.current = {
      splash(px, py) {
        const now = performance.now(), cx = px / CELL, cy = py / CELL, k = 4, pi = Math.floor(Math.random() * T.pairs.length);
        stamp(cx, cy, k, now, pi, 9);
        const drops = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < drops; i++) { const a = Math.random() * 6.283, r = 10 + Math.random() * 18; stamp(cx + Math.cos(a) * r, cy + Math.sin(a) * r, k + 5 + Math.floor(Math.random() * 4), now + 120 + Math.random() * 200, pi, 6); }
      },
      wipe() { born.fill(-1); pending = []; },
    };
    const ctx = cv.getContext('2d')!;
    let raf = 0, last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 40) return; last = now;
      fit();
      const keep: typeof pending = [];
      for (const q of pending) { if (q[1] <= now) { if (born[q[0]] < 0) { born[q[0]] = now; pair[q[0]] = q[2]; seed[q[0]] = Math.floor(Math.random() * 255); } } else keep.push(q); }
      pending = keep;
      ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = `500 ${CELL}px ${getComputedStyle(cv).fontFamily}`; ctx.textBaseline = 'top';
      const tt = Math.floor(now / 70);
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const id = y * GW + x, b = born[id], X = x * CELL, Y = y * CELL;
        if (b < 0) { if (((x + y) & 1) === 0) { ctx.fillStyle = corkGrid.dot; ctx.fillRect(X + 3, Y + 3, 2, 2); } continue; }
        const age = now - b;
        if (age < 260 && !reduce) { ctx.fillStyle = T.ink; ctx.fillText(GLYPHS[(seed[id] + tt) % GLYPHS.length], X, Y); continue; }
        // it settles: the second acid comes in through the Bayer threshold
        const P = T.pairs[pair[id]], tm = reduce ? 0.6 : Math.min(0.6, (age - 260) / 900);
        ctx.fillStyle = (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < tm ? P[1] : P[0];
        ctx.fillRect(X, Y, CELL, CELL);
        if (seed[id] % 31 === 0) { ctx.fillStyle = corkGrid.paper; ctx.fillText(GLYPHS[seed[id] % GLYPHS.length], X, Y); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const download = () => cvRef.current?.toBlob((b) => {
    if (!b) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `bitsplash-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png');

  return (
    <section ref={rootRef} className="bitsplash" aria-label={page.title} style={{ height: `calc(100svh - ${top}px)` }}>
      <canvas
        ref={cvRef} className="bitsplash__cv" role="img" aria-label={page.canvasLabel}
        onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); api.current?.splash(e.clientX - r.left, e.clientY - r.top); setN((v) => v + 1); }}
      />
      <div className="bitsplash__head">
        <h1 className="bitsplash__title">{page.title}</h1>
        <p className="bitsplash__lead">{page.lead}</p>
      </div>
      <div className="bitsplash__actions">
        <span className="label bitsplash__count">{n} {n === 1 ? page.one : page.many}</span>
        <button type="button" className="btn btn--ink btn--sm" onClick={() => { api.current?.wipe(); setN(0); }}>{page.clean}</button>
        <button type="button" className="btn btn--ink btn--sm" onClick={download}>{page.download}</button>
      </div>
      {n === 0 && <p className="label bitsplash__hint">{page.hint}</p>}
    </section>
  );
}
