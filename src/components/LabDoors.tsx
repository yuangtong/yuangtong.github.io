'use client';

import { useEffect, useRef, useState } from 'react';
import type { LabPage } from '@/content/types';
import { boletoSrc, METRO_CITIES, SKETCHBOOK } from '@/content/collections';
import { prefersReducedMotion } from '@/lib/dither';
import { drawPreview, type PreviewMedia } from '@/lib/lab-previews';
import { loadGallop, loadPhoto } from '@/lib/media';
import { CarcomaLink } from './Carcoma';

const ROW = 4;

/**
 * The lab's index, one grid of doors (canvas "lab: índice v2", approved
 * 2026-11-26). Hover a door, or focus it, and it widens slowly while its
 * piece's live preview slides in from its right edge; the other doors of the
 * row give way, so the row never reflows. Pieces still coming keep a still
 * frame and do not open. Touch screens get no preview: one tap opens the piece.
 */
export function LabDoors({ page }: { page: LabPage }) {
  const [open, setOpen] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);
  openRef.current = open;
  const cvs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const rows = Array.from({ length: Math.ceil(page.doors.length / ROW) }, (_, r) => page.doors.slice(r * ROW, r * ROW + ROW));

  useEffect(() => {
    const media: PreviewMedia = {}, reduce = prefersReducedMotion(), drawn = new Map<string, number>();
    let raf = 0, last = -1, dirty = true;
    const img = (src: string) => { const im = new Image(); im.onload = () => { dirty = true; }; im.src = src; return im; };
    media.tickets = ['b07', 'b16', 'b21', 'b39'].map((id) => img(boletoSrc(id)));
    media.card = img(METRO_CITIES[0].variants[0].front);
    media.pages = SKETCHBOOK.slice(0, 2).map((l) => img(l.src));
    loadGallop().then((g) => { media.gallop = g; dirty = true; }).catch(() => {});
    loadPhoto().then((p) => { media.photo = p; dirty = true; }).catch(() => {});
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const step = reduce ? 0 : Math.floor(((now - t0) / 1000) * 12);   // 12 fps, like the rest of the site
      if (step === last && !dirty) return;
      last = step;
      for (const d of page.doors) {
        const cv = cvs.current[d.id]; if (!cv || !cv.clientWidth) continue;   // hidden on touch screens
        const w = Math.max(1, Math.round(cv.clientWidth)), h = Math.max(1, Math.round(cv.clientHeight));
        // travesía sizes its own canvas, to its cell grid
        const resized = d.preview !== 'tunnel' && (cv.width !== w || cv.height !== h); if (resized) { cv.width = w; cv.height = h; }
        // only the open door runs; the others keep one still frame
        const live = openRef.current === d.id && !d.soon && !reduce;
        if (!live && !resized && !dirty && drawn.has(d.id)) continue;
        drawPreview(cv, d.soon ? 'still' : d.preview, live ? step : 0, media); drawn.set(d.id, step);
      }
      dirty = false;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [page.doors]);

  return (
    <div className="lab-doors">
      {rows.map((row, r) => (
        <ul key={r} className="lab-doors__row">
          {row.map((d) => {
            const n = page.doors.indexOf(d) + 1, isOpen = open === d.id && !d.soon;
            return (
              <li
                key={d.id} className={d.soon ? 'lab-door lab-door--soon' : 'lab-door'} data-open={isOpen}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(d.id); }} onPointerLeave={() => setOpen(null)}
                onFocus={() => setOpen(d.id)} onBlur={() => setOpen(null)}
              >
                <div className="lab-door__text">
                  <span className="label lab-door__n">{String(n).padStart(2, '0')} / {page.groups[d.group]}{d.soon && <span className="lab-door__soon">{page.soon.label}</span>}</span>
                  <h2 className="lab-door__title">{d.title}</h2>
                  <p className="lab-door__body">{d.text}</p>
                  <CarcomaLink href={d.cta.href} className="lab-door__cta">{d.cta.label} <span aria-hidden="true">→</span></CarcomaLink>
                </div>
                <div className="lab-door__preview" aria-hidden="true">
                  <canvas ref={(el) => { cvs.current[d.id] = el; }} />
                  {!d.soon && <span className="label lab-door__cap">{page.previewLabel.replace('{title}', d.title)}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
