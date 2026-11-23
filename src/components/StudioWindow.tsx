'use client';

import { useEffect, useRef, useState } from 'react';
import type { StudioPreview } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { fommoWindow as FW } from '@/lib/tokens';

const W = 520, H = 325, CW = 8, CH = 12.5, COLS = 65, ROWS = 26;
const RAMP = ' .:-=+*%#@';

/**
 * The window onto fommo.studio (canvas "studio: glitch FOMMO + ventana"). At
 * rest the screenshot is screened as ASCII in FOMMO's colours on the studio's
 * night; hovering (or a tap on touch screens) starts the carcoma from the
 * pointer and the real page shows through. Leaving lets the glyphs eat it back.
 * Reduced motion swaps the two states without the front.
 */
export function StudioWindow({ preview }: { preview: StudioPreview }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const st = useRef({ on: false, p: { x: W / 2, y: H / 2 } });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const reduce = prefersReducedMotion();
    const ctx = cv.getContext('2d')!;
    const img = new Image();
    const reveal = new Float32Array(COLS * ROWS), seed = Float32Array.from({ length: COLS * ROWS }, () => Math.random());
    let cells: { L: number; c: string }[] | null = null, raf = 0, last = 0, visible = true;
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = COLS; c.height = ROWS;
      const x = c.getContext('2d', { willReadFrequently: true })!; x.drawImage(img, 0, 0, COLS, ROWS);
      const d = x.getImageData(0, 0, COLS, ROWS).data;
      cells = [];
      for (let k = 0; k < COLS * ROWS; k++) {
        const r = d[k * 4], g = d[k * 4 + 1], b = d[k * 4 + 2];
        let best = 0, bd = Infinity;
        FW.palette.forEach((P, i) => { const dd = (P[0] - r) ** 2 + (P[1] - g) ** 2 + (P[2] - b) ** 2; if (dd < bd) { bd = dd; best = i; } });
        cells.push({ L: (0.3 * r + 0.59 * g + 0.11 * b) / 255, c: `rgb(${FW.palette[best].join(',')})` });
      }
    };
    img.src = preview.src;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !cells || now - last < 40) return;
      last = now;
      const { on: inside, p } = st.current, k2 = img.naturalWidth / W;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.fillStyle = FW.night; ctx.fillRect(0, 0, W, H);
      ctx.font = `500 10px ${getComputedStyle(cv).fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const q = r * COLS + c, X = c * CW, Y = r * CH;
        if (inside) reveal[q] = Math.min(1, reveal[q] + (reduce ? 1 : Math.max(0.015, 0.1 + 0.12 * seed[q] - (Math.hypot(X - p.x, Y - p.y) / W) * 0.2)));
        else reveal[q] = Math.max(0, reveal[q] - (reduce ? 1 : 0.05 + 0.08 * seed[q]));
        if (reveal[q] >= 1) { ctx.drawImage(img, X * k2, Y * k2, CW * k2, CH * k2, X, Y, CW, CH); continue; }
        const cell = cells[q];
        if (reveal[q] > 0.35) { ctx.fillStyle = cell.c; ctx.fillRect(X, Y, CW, CH); continue; }
        let gi = Math.min(RAMP.length - 1, Math.floor(cell.L * RAMP.length * 1.25));
        if (!reduce && Math.random() < 0.012) gi = (gi + 3) % RAMP.length;
        if (!gi) continue;
        ctx.fillStyle = cell.L > 0.62 ? FW.light : cell.c;
        ctx.fillText(RAMP[gi], X + CW / 2, Y + CH / 2 + 1);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [preview.src]);

  const local = (e: React.PointerEvent) => { const r = e.currentTarget.getBoundingClientRect(), k = r.width / W; return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; };
  const set = (v: boolean) => { st.current.on = v; setOn(v); };

  return (
    <figure className="fwin">
      <a
        className="fwin__frame" href={preview.href} rel="noopener"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') { st.current.p = local(e); set(true); } }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') set(false); }}
        onPointerMove={(e) => { st.current.p = local(e); }}
        onClick={(e) => { if (!st.current.on) { e.preventDefault(); set(true); } }}
        onBlur={() => set(false)} onFocus={() => set(true)}
      >
        <span className="fwin__bar"><span>{preview.host}</span><span className="fwin__state"><span className="fwin__dot" data-on={on} aria-hidden="true" />{on ? preview.live : preview.screened}</span></span>
        <canvas ref={cvRef} className="fwin__cv" width={W * 2} height={H * 2} role="img" aria-label={preview.alt} />
      </a>
      <figcaption className="fwin__cap">{preview.caption}</figcaption>
    </figure>
  );
}
