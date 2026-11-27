'use client';

import { useEffect, useRef, useState } from 'react';
import type { SketchbookPage } from '@/content/types';
import { SKETCHBOOK } from '@/content/collections';
import { prefersReducedMotion } from '@/lib/dither';
import type { PageFlip } from 'page-flip';


/**
 * sketchbook (owner, 2026-11-27). The scanned pages as a book you leaf
 * through: a hard cover, the pages in order (menta, then lola; more are being
 * scanned), a hard back. page-flip (the engine behind react-pageflip) turns
 * them: drag a corner, click, or use the arrows and the keyboard. Phones get
 * one page at a time. The book is built outside React's tree, because
 * page-flip moves and removes its own nodes; its text is still real DOM text.
 */
export function Sketchbook({ page }: { page: SketchbookPage }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const flip = useRef<PageFlip | null>(null);
  const [at, setAt] = useState(0);
  const [count, setCount] = useState(SKETCHBOOK.length + 2);

  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    let dead = false;
    const book = document.createElement('div'); book.className = 'sk__book'; host.appendChild(book);
    const leaf = (cls: string, hard: boolean) => { const el = document.createElement('div'); el.className = `sk__page ${cls}`; if (hard) el.dataset.density = 'hard'; book.appendChild(el); return el; };
    const cover = leaf('sk__page--cover', true);
    const t = document.createElement('p'); t.className = 'sk__cover-title'; t.textContent = page.cover;
    const by = document.createElement('p'); by.className = 'sk__cover-by'; by.textContent = page.coverBy;
    cover.append(t, by);
    for (const l of SKETCHBOOK) {
      const el = leaf('sk__page--scan', false), img = document.createElement('img');
      img.src = l.src; img.alt = page.alts[l.id] ?? ''; img.draggable = false; img.decoding = 'async';
      el.appendChild(img);
    }
    const back = leaf('sk__page--back', true);
    const b = document.createElement('p'); b.className = 'sk__back-text'; b.textContent = page.back; back.appendChild(b);

    const fitH = Math.max(320, Math.round(window.innerHeight - host.getBoundingClientRect().top - 96));
    host.style.maxWidth = `${Math.round(fitH * 0.72 * 2)}px`;
    import('page-flip').then(({ PageFlip }) => {
      if (dead) return;
      const pf = new PageFlip(book, {
        // the whole book fits on the screen, with room for the title and the arrows
        width: 540, height: 750, size: 'stretch', minWidth: 200, maxWidth: Math.round(fitH * 0.72), minHeight: 280, maxHeight: fitH,
        showCover: true, usePortrait: true, mobileScrollSupport: false, maxShadowOpacity: 0.35, flippingTime: prefersReducedMotion() ? 1 : 800,
      });
      pf.loadFromHTML(book.querySelectorAll('.sk__page'));
      pf.on('flip', (e) => setAt(e.data));
      flip.current = pf; setCount(pf.getPageCount());
    });
    const key = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') flip.current?.flipNext(); if (e.key === 'ArrowLeft') flip.current?.flipPrev(); };
    window.addEventListener('keydown', key);
    return () => { dead = true; window.removeEventListener('keydown', key); try { flip.current?.destroy(); } catch { /* already gone */ } flip.current = null; host.replaceChildren(); };
  }, [page]);

  return (
    <section className="sk" aria-label={page.title}>
      <div className="sk__head">
        <h1 className="sk__title">{page.title}</h1>
        <p className="sk__lead">{page.lead}</p>
      </div>
      <div ref={hostRef} className="sk__host" role="region" aria-label={page.bookLabel} />
      <div className="sk__nav">
        <button type="button" className="btn btn--line btn--sm" onClick={() => flip.current?.flipPrev()} disabled={at === 0} aria-label={page.prev}><span aria-hidden="true">←</span></button>
        <span className="label sk__count" aria-live="polite">{String(at + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <button type="button" className="btn btn--line btn--sm" onClick={() => flip.current?.flipNext()} disabled={at >= count - 1} aria-label={page.next}><span aria-hidden="true">→</span></button>
      </div>
    </section>
  );
}
