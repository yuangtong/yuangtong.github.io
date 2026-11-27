'use client';

import { useEffect, useRef } from 'react';
import type { Note, Settings } from '@/content/types';
import { pixelView, prefersReducedMotion, type PixelView } from '@/lib/dither';
import { loadGallop, loadOriginal, type Gallop } from '@/lib/media';
import { drawNote } from '@/lib/note-cards';
import { CarcomaLink } from './Carcoma';

/** Notes as dithered cards, one accent each. A note not published yet is switched off: it says what it is about and opens nothing (owner, 2026-11-27). */
export function NotesGrid({ items, ui, soon }: { items: Note[]; ui: Settings['ui']; soon: string }) {
  const els = useRef<Record<string, HTMLCanvasElement | null>>({});
  useEffect(() => {
    let g: Gallop | undefined, orig: Float32Array[] | undefined, raf = 0, dead = false, last = -1;
    loadGallop().then((x) => { g = x; last = -1; });
    loadOriginal().then((x) => { orig = x; last = -1; });
    const views: Record<string, PixelView | null> = {}, reduce = prefersReducedMotion(), t0 = performance.now();
    const loop = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const step = reduce ? 20 : Math.floor(((now - t0) / 1000) * 12);
      if (step === last) return;
      last = step;
      for (const n of items) {
        const el = els.current[n.id]; if (!el) continue;
        const v = views[n.id] ?? (views[n.id] = pixelView(el));
        if (v) drawNote(v, n, step, g, orig);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, [items]);
  return (
    <div className="notes__grid">
      {items.map((n) => {
        const inner = (
          <>
            <span className="note-card__media"><canvas ref={(el) => { els.current[n.id] = el; }} width={110} height={60} role="img" aria-label={n.alt} /></span>
            <span className="note-card__body">
              <span className="note-card__title">{n.title}</span>
              <span className="note-card__excerpt">{n.excerpt}</span>
              {n.soon ? <span className="label note-card__meta"><span className="note-card__soon">{soon}</span></span> : <span className="label note-card__meta">{n.meta}</span>}
              {!n.soon && <span className="note-card__cta">{ui.readNoteLabel}</span>}
            </span>
          </>
        );
        return n.soon
          ? <article key={n.id} className="note-card note-card--soon" data-accent={n.accent}>{inner}</article>
          : <CarcomaLink key={n.id} href={n.href} className="note-card" data-accent={n.accent}>{inner}</CarcomaLink>;
      })}
    </div>
  );
}
