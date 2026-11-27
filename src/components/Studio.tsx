'use client';

import { useEffect, useRef } from 'react';
import type { StudioPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { createStudio } from '@/lib/studio-engine';
import { StudioWindow } from './StudioWindow';

/** Studio (design G8, estudio v3, with the window onto fommo.studio): FOMMO's colours eat the paper behind the text. */
export function Studio({ page }: { page: StudioPage }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const engine = useRef<ReturnType<typeof createStudio> | null>(null);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const e = createStudio(cv, titleRef.current, { reduce: prefersReducedMotion(), font: getComputedStyle(cv).fontFamily });
    engine.current = e;
    let raf = 0, last = -1;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const s = Math.floor(((now - t0) / 1000) * 12);
      if (s !== last) { last = s; e.step(s); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main
      className="section section--studio" aria-label={page.title}
      onPointerMove={(ev) => { const r = ev.currentTarget.getBoundingClientRect(); engine.current?.pointer(ev.clientX - r.left, ev.clientY - r.top); }}
      onPointerLeave={() => engine.current?.pointer(null)}
    >
      <canvas ref={cvRef} className="sv3__cv" role="img" aria-label={page.canvasLabel} />
      <StudioWindow preview={page.preview} />
      <div className="sv3__layer">
        <p className="sv3__eyebrow">{page.eyebrow}</p>
        <div className="sv3__block">
          <h1 ref={titleRef} className="sv3__name">{page.name}</h1>
          <div className="sv3__row">
            <p className="sv3__lead">{page.lead}</p>
            <a href={page.cta.href} className="sv3__cta" rel="noopener">{page.cta.label} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </main>
  );
}
