'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/dither';
import { asciiCursor as T } from '@/lib/tokens';

const POOL = 'YUANGTONGDEV唐源!@#$%^&*()_+{}[]|:;<>,.?/~';
const CELL = 12, RADIUS = 26, DENSITY = 20, HOLD = 12;
type Cell = { char: string; at: number; delay: number; duration: number; hidden: boolean };

/**
 * The site's cursor on a computer (owner, 2026-11-27; after Originkit's
 * "Character Cursor"): the system pointer is hidden from the moment the site
 * opens, and a blue cell follows the mouse; moving it lights a small trail of
 * cells with scrambled characters (the owner's name among them) that flicker
 * and go out. Touch screens and reduced motion keep the system pointer.
 */
export function AsciiCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const html = document.documentElement, font = getComputedStyle(cv).fontFamily;
    html.classList.add('ascii-cursor');
    let w = 1, h = 1, cols = 1, rows = 1, grid: Cell[] = [], active = new Set<number>();
    const rebuild = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1; rows = Math.ceil(h / CELL) + 1;
      grid = Array.from({ length: cols * rows }, () => ({ char: ' ', at: 0, delay: 0.05, duration: 0.25, hidden: false }));
      active = new Set();
    };
    rebuild(); window.addEventListener('resize', rebuild);
    let mx = -1e4, my = -1e4, tx = -1e4, ty = -1e4, raf = 0, last = performance.now();
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY; };
    const leave = () => { mx = my = tx = ty = -1e4; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('mouseleave', leave);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      if (document.hidden) return;
      const t = now / 1000;
      let moving = false;
      if (mx <= -1e4) { tx = ty = -1e4; }
      else if (tx <= -1e4) { tx = mx; ty = my; }
      else {
        const dx = mx - tx, dy = my - ty;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) { const e = 1 - Math.exp(-dt / 0.004); tx += dx * e; ty += dy * e; moving = true; }
        else { tx = mx; ty = my; }
      }
      // the trail: cells near the pointer light up while it moves
      if (moving) {
        const r = RADIUS, impact = DENSITY / 8, hs = HOLD / 10;
        const c0 = Math.max(0, Math.floor((tx - r) / CELL)), c1 = Math.min(cols - 1, Math.ceil((tx + r) / CELL));
        const r0 = Math.max(0, Math.floor((ty - r) / CELL)), r1 = Math.min(rows - 1, Math.ceil((ty + r) / CELL));
        for (let c = c0; c <= c1; c++) for (let rw = r0; rw <= r1; rw++) {
          const dx = tx - (c * CELL + CELL / 2), dy = ty - (rw * CELL + CELL / 2), d2 = dx * dx + dy * dy;
          if (d2 >= r * r) continue;
          if (Math.random() >= Math.pow(1 - Math.sqrt(d2) / r, 1.5) * impact) continue;
          const idx = c * rows + rw, cell = grid[idx]; if (!cell) continue;
          if (cell.at === 0 || t - cell.at > 0.2) { cell.delay = (0.03 + Math.random() * 0.05) * hs; cell.duration = (0.1 + Math.random() * 0.15) * hs; cell.hidden = Math.random() < 0.04; }
          cell.at = t;
          if (cell.char === ' ' || Math.random() < 0.15) cell.char = POOL[Math.floor(Math.random() * POOL.length)];
          active.add(idx);
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.font = `600 ${CELL - 3}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const scr = 1 - Math.exp(-7.2 * dt);
      for (const idx of active) {
        const cell = grid[idx], el = t - cell.at;
        if (cell.at === 0 || el >= cell.delay + cell.duration) { cell.char = ' '; cell.at = 0; cell.hidden = false; active.delete(idx); continue; }
        if (cell.hidden) continue;
        if (el >= cell.delay && Math.random() < scr) cell.char = POOL[Math.floor(Math.random() * POOL.length)];
        const x = Math.floor(idx / rows) * CELL, y = (idx % rows) * CELL;
        ctx.fillStyle = T.box; ctx.fillRect(x, y, CELL, CELL);
        ctx.fillStyle = T.text; ctx.fillText(cell.char, x + CELL / 2, y + CELL / 2);
      }
      // the pointer itself: one blue cell, edged in paper so it shows on blue too
      if (mx > -1e4) {
        ctx.fillStyle = T.edge; ctx.fillRect(mx - CELL / 2 - 1, my - CELL / 2 - 1, CELL + 2, CELL + 2);
        ctx.fillStyle = T.box; ctx.fillRect(mx - CELL / 2, my - CELL / 2, CELL, CELL);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); html.classList.remove('ascii-cursor');
      window.removeEventListener('resize', rebuild); window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave); document.removeEventListener('mouseleave', leave);
    };
  }, []);
  return <canvas ref={ref} className="ascii-cursor__cv" aria-hidden="true" />;
}
