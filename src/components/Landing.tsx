'use client';

import { useEffect, useRef, useState } from 'react';
import type { HomePage, Link, Settings } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { loadGallop, loadRider } from '@/lib/media';
import { canvasSize, createLanding, DESKTOP, fitConfig, MOBILE, sectionStart, span, type LandingConfig, type LandingDom } from '@/lib/landing-engine';
import { CarcomaLink, useCarcoma } from './Carcoma';
import { LimaClock } from './LimaClock';
import { MobileMenu } from './MobileMenu';

/** As a lab piece the story plays on its own page: narrated, with no hero, header or sheets. */
type Piece = { label: string; hint: string; replay: string };
type Props = { page: HomePage; nav: Link[]; links: Link[]; ui: Settings['ui']; glyphFamily: string; piece?: Piece };

const pad = (n: number) => (n < 10 ? '0' : '') + n;
const MOBILE_MAX = 760;
const ORDER = ['jugar', 'lab', 'notas', 'studio', 'contacto'];
/** Sheet index for "#jugar", "jugar", "#lab"...; -1 when it is not a sheet. */
const sectionIndex = (hash: string) => ORDER.indexOf(hash.replace(/^#/, ''));

/**
 * Home G7.4. The stage keeps the design scale (1440 x 900 on desktop, 390 x 844
 * on phones) on the tighter axis of the window and extends on the other, so the
 * dot grid fills the screen edge to edge. Page scroll drives the timeline.
 */
export function Landing({ page, nav, links, ui, glyphFamily, piece }: Props) {
  const go = useCarcoma();
  const narrated = !!piece || page.intro.narrated;
  // the piece ends when the horse has turned into letters, before the sheets
  const end = (c: LandingConfig) => (piece ? sectionStart(c) - 1 : span(c));
  const [top, setTop] = useState(0);
  const [phase, setPhase] = useState<'start' | 'mid' | 'end'>('start');
  const phaseRef = useRef(phase);
  const [fit, setFit] = useState<{ mobile: boolean; C: LandingConfig; s: number }>({ mobile: false, C: DESKTOP, s: 1 });
  const { mobile, C, s: scale } = fit;
  const fitKey = `${mobile ? 'm' : 'd'}${C.W}x${C.H}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [flight, setFlight] = useState(6);

  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dom = useRef<LandingDom>({ hero: null, counter: null, strip: null, sheets: null, title: null, jside: null, sh: [], inner: [], narr: [] });
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const manual = useRef(false);
  const selRef = useRef<number | null>(null);
  const engineRef = useRef<ReturnType<typeof createLanding> | null>(null);
  const scaleRef = useRef(1);

  const pickFrame = (k: number, byHand: boolean) => { manual.current = byHand; selRef.current = k; setSelected(k); };

  // frame and scale follow the window
  useEffect(() => {
    let t = 0;
    const apply = () => {
      const head = piece ? (document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 0 : 0;
      setTop(head);
      const m = window.innerWidth < MOBILE_MAX, f = fitConfig(m ? MOBILE : DESKTOP, window.innerWidth, window.innerHeight - head);
      scaleRef.current = f.s;
      setFit((old) => (old.mobile === m && old.C.W === f.C.W && old.C.H === f.C.H && old.s === f.s ? old : { mobile: m, C: f.C, s: f.s }));
    };
    const onResize = () => { clearTimeout(t); t = window.setTimeout(apply, 120); };
    apply();
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const reduce = prefersReducedMotion();
    let raf = 0, dead = false, sys = 0;
    Promise.all([loadGallop(), piece ? Promise.resolve(null) : loadRider().catch(() => null)]).then(([g, rider]) => {
      if (dead) return;
      setFlight(g.flight);
      engineRef.current = createLanding({
        C, canvas, gallop: g, dom: () => dom.current, reduce, mode: 1, narrated, glyphFamily, rider,
        title: page.jugar.title, glyphText: page.intro.glyphText, labels: { camera: ui.cameraCounter, frame: ui.frameCounter },
        onFrame: (k) => pickFrame(k, false),
      });
      // arriving with a hash (for example "/#jugar" from a section) lands on that sheet
      const k = sectionIndex(window.location.hash);
      if (k >= 0) requestAnimationFrame(() => scrollToSection(k, true));
    });
    const loop = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const eng = engineRef.current; if (!eng) return;
      const s = scaleRef.current, rect = wrap.getBoundingClientRect();
      const target = Math.min(end(C), Math.max(0, (top - rect.top) / s));
      if (piece) {
        const ph = target < 40 ? 'start' : target >= end(C) - 2 ? 'end' : 'mid';
        if (ph !== phaseRef.current) { phaseRef.current = ph; setPhase(ph); }
      }
      sys += (target - sys) * (reduce ? 1 : 0.16);
      if (Math.abs(target - sys) < 0.5) sys = target;
      eng.frame({ sys, now, ptr: ptr.current, manual: manual.current, selected: selRef.current });
    };
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); engineRef.current = null; };
    // the engine is rebuilt when the stage changes size or switches frame
  }, [fitKey, top]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { engineRef.current?.remeasure(); }, [scale, mobile]);

  const scrollToSection = (k: number, instant = false) => {
    const wrap = wrapRef.current, eng = engineRef.current; if (!wrap) return;
    const at = wrap.getBoundingClientRect().top + window.scrollY - top;
    const y = k < 0 ? 0 : (eng ? eng.jumpOffset(k) : 0) * scaleRef.current;
    window.scrollTo({ top: at + y, behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const jump = (k: number) => (e: React.MouseEvent) => { e.preventDefault(); scrollToSection(k); };
  // "/#jugar" scrolls inside the landing; any other route goes through the carcoma
  const navigate = (href: string, e: React.MouseEvent) => {
    const k = sectionIndex(href.replace(/^\//, ''));
    if (href === '/' || k >= 0) { e.preventDefault(); scrollToSection(href === '/' ? -1 : k); return; }
    if (href.startsWith('/')) { e.preventDefault(); go(href); }
  };

  // pointer in design coordinates
  const onMove = (e: React.PointerEvent) => {
    const st = stageRef.current; if (!st) return;
    const r = st.getBoundingClientRect();
    ptr.current = { x: ((e.clientX - r.left) / r.width) * C.W, y: ((e.clientY - r.top) / r.height) * C.H };
    manual.current = false;
  };

  const { intro, jugar, sheets } = page;
  const { lab, notes, studio, contact } = sheets;
  const shown = selected ?? flight;
  const cv = canvasSize(C);
  const navLabel = (href: string, fallback: string) => nav.find((l) => l.href === href)?.label ?? fallback;
  const sectionHeads = [jugar.title, lab.title, notes.title, studio.title, navLabel('/contacto', contact.title)];
  const setSh = (i: number) => (el: HTMLElement | null) => { dom.current.sh[i] = el; };
  const setIn = (i: number) => (el: HTMLElement | null) => { dom.current.inner[i] = el; };
  const head = (i: number) => (
    <button type="button" className="sheet__strip" onClick={jump(i)}>
      <span className="label">{pad(i + 1)}</span>{sectionHeads[i]}
    </button>
  );

  return (
    <section id={piece ? undefined : 'inicio'} ref={wrapRef} className={piece ? 'landing landing--piece' : 'landing'} aria-label={piece?.label} style={{ height: `calc(100svh - ${top}px + ${end(C) * scale}px)` }}>
      <div className="landing__sticky" style={piece ? { top, height: `calc(100svh - ${top}px)` } : undefined}>
        <div
          ref={stageRef}
          className="stage"
          data-frame={mobile ? 'm' : 'd'}
          style={{ width: C.W, height: C.H, transform: `translate(-50%, -50%) scale(${scale})` }}
          onPointerMove={onMove}
          onPointerLeave={() => { ptr.current = null; }}
        >
          <canvas ref={canvasRef} key={fitKey} className="stage__canvas" width={cv.w} height={cv.h} role="img" aria-label={intro.canvasLabel} />

          {!piece && <div ref={(el) => { dom.current.hero = el; }} className="stage__hero">
            <h1 className="stage__name">
              {mobile ? <>{intro.name.split(' ')[0]}<br />{intro.name.split(' ').slice(1).join(' ')}</> : intro.name}
              <span lang="zh-Hant" className="stage__zh">({intro.nameZh})</span>
            </h1>
            <p className="stage__role">{intro.role}</p>
            <div className="stage__ctas">
              {intro.ctas.map((c, i) => (
                <a key={c.href} href={c.href} onClick={(e) => navigate(c.href, e)} className={i === 0 ? 'btn btn--ink' : 'btn btn--signal'}>
                  {c.label} <span aria-hidden="true">-&gt;</span>
                </a>
              ))}
            </div>
          </div>}

          {narrated && (
            <>
              {intro.narration.lines.map((line, i) => (
                <div key={i} ref={(el) => { dom.current.narr[i] = el; }} className="stage__narr"><p className="mark">{line}</p></div>
              ))}
              <div ref={(el) => { dom.current.narr[3] = el; }} className="stage__narr stage__narr--quote">
                <blockquote><p className="mark mark--quote">{intro.narration.quote}</p></blockquote>
                <p className="mark mark--source">{intro.narration.quoteSource}</p>
                <p className="mark mark--coda">{intro.narration.coda}</p>
              </div>
            </>
          )}

          <span ref={(el) => { dom.current.counter = el; }} className="stage__counter">{ui.cameraCounter} 00/12</span>

          <div ref={(el) => { dom.current.strip = el; }} className="stage__strip" role="group" aria-label={ui.frameStripLabel}>
            {mobile ? (
              <>
                <button type="button" aria-label={ui.framePrev} onClick={() => pickFrame((shown + 14) % 15, true)}>&lt;</button>
                <span aria-live="polite" className="stage__frame">{ui.frameCounter} {pad(shown + 1)}/15</span>
                <button type="button" aria-label={ui.frameNext} className="is-signal" onClick={() => pickFrame((shown + 1) % 15, true)}>&gt;</button>
              </>
            ) : (
              Array.from({ length: 15 }, (_, k) => (
                <button key={k} type="button" aria-pressed={shown === k} data-flight={k === flight} onClick={() => pickFrame(k, true)} aria-label={`${ui.frameCounter} ${k + 1} / 15`}>{pad(k + 1)}</button>
              ))
            )}
          </div>

          {piece && (
            <div className="piece__ui">
              {phase === 'start' && <p className="label piece__hint">{piece.hint} <span aria-hidden="true">↓</span></p>}
              {phase === 'end' && <button type="button" className="btn btn--ink piece__replay" onClick={() => scrollToSection(-1)}>{piece.replay} <span aria-hidden="true">↑</span></button>}
            </div>
          )}

          {!piece && <div ref={(el) => { dom.current.sheets = el; }} className="sheets" aria-hidden="true">
            <section ref={setSh(0)} id="jugar" aria-label={jugar.title} className="sheet sheet--jugar">
              {head(0)}
              <div ref={setIn(0)} className="sheet__inner">
                <div ref={(el) => { dom.current.jside = el; }} className="jugar__side">
                  <h2 className="jugar__title"><span className="vh">{jugar.title}</span><span ref={(el) => { dom.current.title = el; }} aria-hidden="true">{jugar.title}</span></h2>
                </div>
              </div>
            </section>

            <section ref={setSh(1)} id="lab" aria-label={lab.title} className="sheet">
              {head(1)}
              <div ref={setIn(1)} className="sheet__inner sheet__fill">
                <h2 className="sheet__title">{lab.title}</h2>
                <p className="sheet__line">{lab.line}</p>
                <CarcomaLink href={lab.href} className="btn btn--ink sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(2)} id="notas" aria-label={notes.title} className="sheet">
              {head(2)}
              <div ref={setIn(2)} className="sheet__inner sheet__fill">
                <h2 className="sheet__title">{notes.title}</h2>
                <p className="sheet__line">{notes.line}</p>
                <CarcomaLink href={notes.href} className="btn btn--ink sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(3)} id="studio" aria-label={studio.title} className="sheet sheet--studio">
              {head(3)}
              <div ref={setIn(3)} className="sheet__inner sheet__fill">
                <p className="studio__lead">{studio.line}</p>
                <p className="studio__sub">{studio.sub}</p>
                <CarcomaLink href={studio.href} className="btn btn--paper-signal sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(4)} id="contacto" aria-label={contact.title} className="sheet sheet--contact">
              {head(4)}
              <div ref={setIn(4)} className="sheet__inner sheet__fill">
                <h2 className="contact__title">{contact.title}</h2>
                <p className="contact__lead">{contact.line} <a href={contact.email.href}>{contact.email.label}</a></p>
                <CarcomaLink href={contact.href} className="btn btn--paper sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>
          </div>}

          {!piece && <header className="stage__header">
            <span className="stage__status">
              <span aria-hidden="true" className="stage__dot" />
              {intro.availability} <LimaClock />
              <span aria-hidden="true" className="cursor" />
            </span>
            {mobile ? (
              <button type="button" className="stage__index" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => go(() => setMenuOpen(true))}>{ui.menuLabel}</button>
            ) : (
              <nav aria-label={ui.navLabel} className="stage__nav">
                {nav.map((l) => <a key={l.href} href={l.href} onClick={(e) => navigate(l.href, e)}>{l.label}</a>)}
              </nav>
            )}
          </header>}
        </div>
      </div>
      {menuOpen && (
        <MobileMenu
          name={intro.name} nameZh={intro.nameZh} availability={intro.availability} nav={nav} links={links} closeLabel={ui.closeLabel}
          onClose={() => setMenuOpen(false)}
          onSelect={(href, e) => {
            e.preventDefault();
            setMenuOpen(false);
            const k = sectionIndex(href.replace(/^\//, ''));
            // wait for the menu to close and the page to scroll again
            requestAnimationFrame(() => requestAnimationFrame(() => { if (href === '/' || k >= 0) scrollToSection(href === '/' ? -1 : k); else go(href); }));
          }}
        />
      )}
    </section>
  );
}

