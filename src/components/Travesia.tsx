'use client';

import { useEffect, useRef, useState } from 'react';
import type { TravesiaPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { travesia, type TravesiaRamp } from '@/lib/tokens';
import { createTravesia, type TravesiaState } from '@/lib/travesia-engine';
import { useCarcoma } from './Carcoma';

const CELLS = [4, 8, 16] as const;
const RAMPS = ['todos', ...(Object.keys(travesia.ramps) as TravesiaRamp[])] as const;
type Ramp = (typeof RAMPS)[number];

/**
 * Travesía ácida (canvas "lab: travesía ácida"). The piece fills the space
 * under the header; while the pointer is over it, scroll moves the tunnel and
 * not the page, since the loop has no end. Full screen uses the browser's.
 */
export function Travesia({ page, backHref }: { page: TravesiaPage; backHref: string }) {
  const go = useCarcoma();
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const readRef = useRef<HTMLParagraphElement>(null);
  const ptr = useRef<[number, number] | null>(null);
  const eng = useRef<ReturnType<typeof createTravesia> | null>(null);
  const [cell, setCell] = useState<number>(8);
  const [ramp, setRamp] = useState<Ramp>('todos');
  const [full, setFull] = useState(false);
  const [touch, setTouch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [top, setTop] = useState(0);
  const st = useRef<TravesiaState>({ cell: 8, ramp: 'todos', base: 0.45, reduce: false });
  st.current.cell = cell; st.current.ramp = ramp;

  // a shared link opens with its cell, color and depth
  useEffect(() => {
    const q = new URLSearchParams(location.search), c = Number(q.get('celda')), r = q.get('color') as Ramp | null;
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    setCell((CELLS as readonly number[]).includes(c) ? c : mobile ? 4 : 8);
    if (r && (RAMPS as readonly string[]).includes(r)) setRamp(r);
    st.current.reduce = prefersReducedMotion();
    const cv = cvRef.current; if (!cv) return;
    eng.current = createTravesia(cv, Number(q.get('profundidad')) || 0);
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const info = eng.current?.frame(now, st.current, ptr.current);
      if (info && readRef.current) {
        const txt = `${page.ui.depth} ${String(info.depth).padStart(4, '0')}, ${page.ui.rampNames[info.ramp]}, ×${info.speed.toFixed(1)}`;
        if (readRef.current.textContent !== txt) readRef.current.textContent = txt;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the piece sits under the section header
  useEffect(() => {
    const measure = () => setTop((document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 0);
    measure();
    window.addEventListener('resize', measure);
    const onFs = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => { window.removeEventListener('resize', measure); document.removeEventListener('fullscreenchange', onFs); };
  }, []);

  // scroll and swipe move the tunnel, not the page
  useEffect(() => {
    const el = cvRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); eng.current?.push(e.deltaY * 0.004); };
    let y0 = 0, last = 0, t0 = 0;
    const onStart = (e: TouchEvent) => { y0 = last = e.touches[0].clientY; t0 = performance.now(); };
    const onMove = (e: TouchEvent) => { e.preventDefault(); const y = e.touches[0].clientY; eng.current?.push((last - y) * 0.015); last = y; };
    const onEnd = () => { if (Math.abs(last - y0) < 6 && performance.now() - t0 < 300) setRamp((r) => RAMPS[(RAMPS.indexOf(r) + 1) % RAMPS.length]); };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    return () => { el.removeEventListener('wheel', onWheel); el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); el.removeEventListener('touchend', onEnd); };
  }, []);

  // without the browser's full screen, the page header still steps aside
  useEffect(() => { document.documentElement.classList.toggle('is-piece-full', full); return () => document.documentElement.classList.remove('is-piece-full'); }, [full]);

  const toggleFull = () => {
    const el = rootRef.current; if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => setFull((f) => !f));
    else setFull((f) => !f);
  };
  const close = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (full) setFull(false); else go(backHref); };
  const copy = () => {
    const d = Math.floor(eng.current?.depth ?? 0);
    const url = `${location.origin}${location.pathname}?celda=${cell}&color=${ramp}&profundidad=${d}`;
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }, () => {});
  };
  const swatch = (r: Ramp) => (r === 'todos' ? undefined : travesia.ramps[r][2]);

  return (
    <section ref={rootRef} className="travesia" data-full={full} aria-label={page.title} style={full ? undefined : { height: `calc(100svh - ${top}px)` }}>
      <canvas
        ref={cvRef} className="travesia__cv" role="img" aria-label={page.canvasLabel}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); ptr.current = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }}
        onPointerLeave={() => { ptr.current = null; }}
      />
      <p ref={readRef} className="label travesia__read" aria-hidden="true" />
      {!full ? (
        <div className="travesia__panel" role="group" aria-label={page.ui.controls}>
          <div className="travesia__head">
            <h1 className="travesia__title">{page.title}</h1>
            <p className="travesia__lead">{page.lead}</p>
          </div>
          <div className="travesia__controls">
            <div role="group" aria-label={page.ui.cell} className="travesia__group">
              <span className="label">{page.ui.cell}</span>
              {CELLS.map((n) => <button key={n} type="button" className="travesia__seg" aria-pressed={cell === n} onClick={() => setCell(n)}>{n}px</button>)}
            </div>
            <div role="group" aria-label={page.ui.color} className="travesia__group">
              <span className="label">{page.ui.color}</span>
              {RAMPS.map((r) => (
                <button key={r} type="button" className="travesia__swatch" data-ramp={r} aria-pressed={ramp === r} aria-label={r === 'todos' ? page.ui.all : page.ui.rampNames[r]} onClick={() => setRamp(r)} style={swatch(r) ? { background: swatch(r) } : undefined} />
              ))}
            </div>
          </div>
          <p className="label travesia__hint">{touch ? page.hintTouch : page.hint}</p>
          <div className="travesia__actions">
            <button type="button" className="btn btn--line" onClick={toggleFull}>{page.ui.full}</button>
            <button type="button" className="btn btn--ink" onClick={copy}>{copied ? page.ui.copied : page.ui.copyLink}</button>
          </div>
        </div>
      ) : (
        <div className="travesia__bar">
          <span>{page.title}</span>
          <button type="button" className="btn btn--ink" onClick={close}>{page.ui.close}</button>
        </div>
      )}
    </section>
  );
}
