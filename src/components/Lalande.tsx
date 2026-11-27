'use client';

import { useEffect, useRef, useState } from 'react';
import type { LalandePage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { loadGallop, type Gallop } from '@/lib/media';
import { createLalande, FRAME, type LalandeDom } from '@/lib/lalande-engine';

const TRACK = 6900; // design pixels of scroll, as in the prototype (7800 - 900)
const PHONE = 760;
// on phones the scene is scaled far down, so the track would be short and a
// fling would cross the whole story; it keeps at least this share of its length
const PHONE_SCALE = 0.6;
// and the story catches up at most this much progress per frame (as the landing)
const PHONE_CAP = 0.0065;
// desktop: a trackpad fling or a fast wheel also catches up at a capped pace,
// and short laptop screens keep most of the track
const DESK_CAP = 0.009;
const DESK_SCALE = 0.85;

/** Pixels of scroll for the whole story: the design track at the scene's scale, longer on phones. */
const trackPx = (f: { w: number; s: number }) => TRACK * Math.max(f.s, f.w < PHONE ? PHONE_SCALE : DESK_SCALE);

/**
 * Lalande, historia 02, as a piece in the lab. The 1440 x 900 scene keeps its
 * scale on the tighter axis and the grid extends on the other; scroll drives it.
 */
export function Lalande({ page, coverSrc }: { page: LalandePage; coverSrc: string }) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dom = useRef<LalandeDom>({ n1: null, n2: null, spec: null, breeze: null, cue: null, title: null, book: null, hinge: null });
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const [fit, setFit] = useState<{ top: number; w: number; h: number; s: number; W: number; H: number; OX: number; OY: number }>({ top: 0, w: 0, h: 0, s: 1, W: FRAME.W, H: FRAME.H, OX: 0, OY: 0 });
  const [gallop, setGallop] = useState<Gallop | null>(null);
  const [ended, setEnded] = useState(false);
  const endedRef = useRef(false);

  useEffect(() => { loadGallop().then(setGallop); }, []);

  // the scene follows the window, under the section header
  useEffect(() => {
    let t = 0, lastW = 0, lastH = 0;
    const apply = (force = false) => {
      const top = (document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 0;
      const w = window.innerWidth, h = window.innerHeight;
      // phones: the browser bar showing or hiding is not a new layout; refitting
      // then rebuilt the scene in the middle of a scroll
      if (!force && w === lastW && w < PHONE && Math.abs(h - lastH) < 160) return;
      lastW = w; lastH = h;
      const vh = h - top, s = Math.min(w / FRAME.W, vh / FRAME.H);
      setFit((o) => (o.top === top && o.w === w && o.h === vh ? o : { ...o, top, w, h: vh, s, W: w / s, H: vh / s }));
    };
    const onResize = () => { clearTimeout(t); t = window.setTimeout(apply, 120); };
    apply(true);
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap || !gallop || !fit.w) return;
    const reduce = prefersReducedMotion();
    const css = getComputedStyle(canvas);
    const eng = createLalande({
      canvas, gallop, dom: () => dom.current, reduce, W: fit.W, H: fit.H,
      fonts: { word: css.getPropertyValue('--lalande-word') || css.fontFamily, mono: css.fontFamily },
      word: page.word, closeText: page.closeText, breezeLabel: page.breezeLabel,
    });
    canvas.style.width = `${eng.size.W * fit.s}px`; canvas.style.height = `${eng.size.H * fit.s}px`;
    setFit((o) => (o.OX === eng.size.OX && o.OY === eng.size.OY ? o : { ...o, OX: eng.size.OX, OY: eng.size.OY }));
    let raf = 0, ps = 0, last = 0;
    const phone = fit.w < PHONE, cap = reduce ? Infinity : phone ? PHONE_CAP : DESK_CAP;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const r = wrap.getBoundingClientRect(), track = trackPx(fit);
      const target = Math.min(1, Math.max(0, (fit.top - r.top) / track));
      const step = (target - ps) * (reduce ? 1 : 0.14);
      ps += Math.max(-cap, Math.min(cap, step));
      if (Math.abs(target - ps) < 0.0002) ps = target;
      const end = ps > 0.995;
      if (end !== endedRef.current) { endedRef.current = end; setEnded(end); }
      if (now - last < 30) return;
      last = now;
      eng.draw(ps, now, ptr.current);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gallop, fit.W, fit.H, fit.top, fit.w]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    ptr.current = { x: (e.clientX - r.left) / fit.s, y: (e.clientY - r.top) / fit.s };
  };
  const set = (k: keyof LalandeDom) => (el: HTMLElement | null) => { dom.current[k] = el; };
  const replay = () => { const w = wrapRef.current; if (w) window.scrollTo({ top: w.getBoundingClientRect().top + window.scrollY - fit.top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); };

  return (
    <section ref={wrapRef} className="lalande" aria-label={page.title} style={{ height: `calc(100svh - ${fit.top}px + ${trackPx(fit)}px)` }}>
      <div className="lalande__sticky" style={{ top: fit.top, height: `calc(100svh - ${fit.top}px)` }} onPointerMove={onMove} onPointerLeave={() => { ptr.current = null; }}>
        <canvas ref={canvasRef} className="lalande__canvas" role="img" aria-label={page.canvasLabel} />
        <div className="lalande__layer" style={{ width: fit.W, height: fit.H, transform: `scale(${fit.s})`, ['--s' as string]: fit.s }}>
          <div className="lalande__persp">
            <div ref={set('book')} className="book" role="img" aria-label={page.book.label}>
              <div className="book__edge book__edge--fore" />
              <div className="book__edge book__edge--top" />
              <div className="book__edge book__edge--bottom" />
              <div className="book__back" />
              <div className="book__spine"><span>{page.book.author}<span className="book__spine-title">  {page.book.title}</span></span></div>
              <div className="book__page">
                <blockquote>{page.book.quote}</blockquote>
                <span>{page.book.quoteSource}</span>
              </div>
              <div ref={set('hinge')} className="book__hinge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverSrc} alt="" />
                <div className="book__shine" />
                <div className="book__inside" />
              </div>
            </div>
          </div>
          {page.quotes.map((q, i) => (
            <figure key={i} ref={set(i ? 'n2' : 'n1')} className="lalande__quote">
              <blockquote>{q.text}</blockquote>
              <figcaption>{q.source}</figcaption>
            </figure>
          ))}
          <div ref={set('spec')} aria-hidden="true" className="lalande__spec">
            {page.spec.map((l) => <span key={l}>{l}</span>)}
            <span ref={set('breeze')}>{page.breezeLabel} 0.00</span>
            <span>{page.breezeHint}</span>
          </div>
          <p ref={set('title')} className="lalande__close" style={{ left: fit.OX + 680, top: fit.OY + 360 }}>{page.closeTitle}</p>
          <span className="vh">{page.closeText}</span>
        </div>
        <span ref={set('cue')} className="label lalande__cue">{page.hint} <span aria-hidden="true">↓</span></span>
        {ended && <button type="button" className="btn btn--ink lalande__replay" onClick={replay}>{page.replay} <span aria-hidden="true">↑</span></button>}
      </div>
    </section>
  );
}
