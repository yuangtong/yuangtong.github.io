'use client';

import { useEffect, useRef, useState } from 'react';
import type { Experiment, Settings } from '@/content/types';
import { pixelView, prefersReducedMotion, type PixelView } from '@/lib/dither';
import { CELLS, drawCard, type Media } from '@/lib/lab-cards';
import { loadGallop, loadOriginal, loadPhoto } from '@/lib/media';

/** The lab pieces: live dithered visuals, cell sizes and copy-link. */
export function LabGrid({ experiments, ui }: { experiments: Experiment[]; ui: Settings['ui'] }) {
  const [cells, setCells] = useState<Record<string, number>>(() => Object.fromEntries(experiments.map((e) => [e.id, e.defaultCell])));
  const [copied, setCopied] = useState<string | null>(null);
  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const els = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    const media: Media = {}, views: Record<string, PixelView | null> = {};
    let raf = 0, dead = false, last = -1, key = '';
    loadGallop().then((g) => { media.gallop = g; last = -1; });
    loadOriginal().then((o) => { media.original = o; last = -1; });
    loadPhoto().then((p) => { media.photo = p; last = -1; });
    const reduce = prefersReducedMotion(), t0 = performance.now();
    const loop = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const step = reduce ? 20 : Math.floor(((now - t0) / 1000) * 12), k = JSON.stringify(cellsRef.current);
      if (step === last && k === key) return;
      last = step; key = k;
      for (const e of experiments) {
        const el = els.current[e.id]; if (!el) continue;
        const v = views[e.id] ?? (views[e.id] = pixelView(el));
        if (v) drawCard(v, e.visual, cellsRef.current[e.id], step, media);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, [experiments]);

  useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(null), 1800); return () => clearTimeout(id); }, [copied]);

  return (
    <div className="lab__grid">
      {experiments.map((e) => (
        <article key={e.id} id={`pieza-${e.id}`} className="lab-card">
          <div className="lab-card__text">
            <h2 className="lab-card__title">{e.title}</h2>
            <span className="label">{e.meta}</span>
            <span aria-hidden="true" className="dot-rule" />
            <div className="lab-card__controls">
              <div role="group" aria-label={`${ui.cellGroupLabel} ${e.title}`} className="seg">
                {CELLS.map((n) => <button key={n} type="button" aria-pressed={cells[e.id] === n} onClick={() => setCells((c) => ({ ...c, [e.id]: n }))}>{n}px</button>)}
              </div>
              <a href={e.href} className="btn btn--ink btn--sm">{ui.openLabel}</a>
            </div>
          </div>
          <div className="lab-card__visual">
            <canvas ref={(el) => { els.current[e.id] = el; }} width={344} height={338} role="img" aria-label={e.alt} />
            <button type="button" className="chip" onClick={() => {
              const url = `${location.origin}/lab/${e.id}?celda=${cells[e.id]}`;
              try { navigator.clipboard?.writeText(url).catch(() => {}); } catch {}
              setCopied(e.id);
            }}>{copied === e.id ? ui.copiedLabel : ui.copyLinkLabel}</button>
          </div>
        </article>
      ))}
    </div>
  );
}
