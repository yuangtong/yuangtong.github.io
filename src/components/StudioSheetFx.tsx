'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/dither';
import { color } from '@/lib/tokens';
import { createStudio } from '@/lib/studio-engine';

/**
 * The landing's studio sheet (canvas "hoja studio v2"): FOMMO's colours break
 * out of the word and slowly take the blue around it. It only runs while the
 * sheet is on screen; "enter" then goes through the carcoma to /studio.
 */
export function StudioSheetFx({ word }: { word: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const eng = createStudio(cv, word.current, { reduce: prefersReducedMotion(), font: getComputedStyle(cv).fontFamily, paper: color.signal, halo: { max: 26 } });
    let raf = 0, visible = false, last = -1;
    const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && e.intersectionRatio > 0.2; }, { threshold: [0, 0.2, 0.6] });
    io.observe(cv);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const s = Math.floor(((now - t0) / 1000) * 12);
      if (s !== last) { last = s; eng.step(s); }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [word]);
  return <canvas ref={ref} className="sheet__fx" aria-hidden="true" />;
}
