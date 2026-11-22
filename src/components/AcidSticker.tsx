'use client';

import { useEffect, useRef } from 'react';
import type { Accent } from '@/content/types';
import { acidShape, type AcidShapeId } from '@/lib/acid-shapes';
import { prefersReducedMotion, u32 } from '@/lib/dither';
import { color, ramp } from '@/lib/tokens';

type Props = { shape: AcidShapeId; accent: Accent; className?: string; outline?: 'ink' | 'paper' };

/**
 * A shape from the acid pack, drawn at two screen pixels per cell. Each color
 * layer takes a tone of one accent; the tones cycle through the layers so the
 * shape pulses, and it floats. Decorative: hidden from assistive technology.
 */
export function AcidSticker({ shape, accent, className, outline = 'ink' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const s = acidShape(shape);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext('2d'); if (!ctx) return;
    const img = ctx.createImageData(s.w, s.h), px = new Uint32Array(img.data.buffer);
    const reduce = prefersReducedMotion(), tones = ramp[accent].map(u32), line = u32(outline === 'ink' ? color.ink : color.paper);
    let raf = 0, last = -1, visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const t0 = performance.now(), seed = shape.length * 1.7;
    const draw = (cyc: number) => {
      const cols = [0, line];
      for (let L = 2; L <= 8; L++) cols.push(tones[(L - 2 + cyc) % 4]);
      for (let i = 0; i < s.cells.length; i++) px[i] = cols[s.cells[i]] || 0;
      ctx.putImageData(img, 0, 0);
    };
    draw(0);
    if (reduce) return () => io.disconnect();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const step = Math.floor(((now - t0) / 1000) * 12), cyc = Math.floor(step / 6);
      el.style.transform = `translateY(${(Math.sin(((now - t0) / 1000) * 0.8 + seed) * 6).toFixed(1)}px)`;
      if (cyc !== last) { draw(cyc); last = cyc; }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [s, accent, shape, outline]);
  return <canvas ref={ref} width={s.w} height={s.h} aria-hidden="true" className={'acid ' + (className ?? '')} style={{ width: s.w * 2, height: s.h * 2 }} />;
}
