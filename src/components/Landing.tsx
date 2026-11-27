'use client';

import { useEffect, useRef, useState } from 'react';
import type { HomePage, Link, Settings } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { loadGallop, loadRider } from '@/lib/media';
import { createHeroFall } from '@/lib/hero-fall';
import { canvasSize, createLanding, DESKTOP, fitConfig, MOBILE, sectionStart, span, type LandingConfig, type LandingDom } from '@/lib/landing-engine';

/** Chapters a phone's scroll settles near in the story (1): hero, the void, three scenes, the letters. */
const chapters = (c: LandingConfig) => [0, c.VOID, c.VOID + c.STORY * 0.25, c.VOID + c.STORY * 0.55, c.VOID + c.STORY * 0.78, c.VOID + c.STORY];
/** Where each sheet (2 to 6: about, lab, studio, notes, contact) rests open; on phones one swipe moves exactly one. */
const sheetStops = (c: LandingConfig) => { const s0 = sectionStart(c); return [s0, ...[1, 2, 3, 4].map((k) => s0 + k * c.SECT + c.SECT * 0.12)]; };
/** How far, in screen pixels, you pull up from the first sheet before the story starts again. */
const PULL = 220;
import { CarcomaLink, useCarcoma } from './Carcoma';
import { LimaClock } from './LimaClock';
import { MobileMenu } from './MobileMenu';
import { LangSwitch } from './LangSwitch';
import { localePath, splitPath } from '@/content/locale';
import { StudioSheetFx } from './StudioSheetFx';

/** As a lab piece the story plays on its own page: narrated, with no hero, header or sheets. */
type Piece = { label: string; hint: string; replay: string };
type Props = { page: HomePage; nav: Link[]; links: Link[]; ui: Settings['ui']; languages: Settings['languages']; glyphFamily: string; piece?: Piece };

const pad = (n: number) => (n < 10 ? '0' : '') + n;
const MOBILE_MAX = 760;
// the navigation's order (owner, 2026-11-23): about, lab, studio, notes, contact
const ORDER = ['jugar', 'lab', 'studio', 'notes', 'contact'];
// hashes from before the English paths still land on their sheet
const ALIAS: Record<string, string> = { notas: 'notes', contacto: 'contact' };
/** Sheet index for "#jugar", "jugar", "#lab"...; -1 when it is not a sheet. */
const sectionIndex = (hash: string) => { const h = hash.replace(/^#/, ''); return ORDER.indexOf(ALIAS[h] ?? h); };

/** Each letter in its own span, so the hero can come apart letter by letter (hero-fall). Spaces stay plain. */
const letters = (text: string) => [...text].map((ch, i) => (ch === ' ' ? ' ' : <span key={i} data-fall="">{ch}</span>));

/** The tagline: two words from content and a fixed ampersand, large and blue on its own line on phones (G7.5 mobile). */
const tagline = ([a, b]: [string, string]) => (
  <><span className="stage__role-a">{letters(a)}</span> <span className="stage__amp" data-fall="">&amp;</span> <span className="stage__role-b">{letters(b)}</span></>
);

/**
 * Home G7.4. The stage keeps the design scale (1440 x 900 on desktop, 390 x 844
 * on phones) on the tighter axis of the window and extends on the other, so the
 * dot grid fills the screen edge to edge. Page scroll drives the timeline.
 */
export function Landing({ page, nav, links, ui, languages, glyphFamily, piece }: Props) {
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
  const dom = useRef<LandingDom>({ hero: null, counter: null, strip: null, sheets: null, title: null, jside: null, sh: [], inner: [], narr: [], heads: [] });
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const manual = useRef(false);
  const selRef = useRef<number | null>(null);
  const engineRef = useRef<ReturnType<typeof createLanding> | null>(null);
  const scaleRef = useRef(1);
  const brandRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef(true);
  const hintRef2 = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  // "keep scrolling": on whenever the visitor stops between the first scroll and the first sheet
  const [keep, setKeep] = useState(false);
  const keepRef = useRef({ on: false, lastTarget: -1, lastMove: 0 });
  const fallRef = useRef<ReturnType<typeof createHeroFall> | null>(null);
  const [hint, setHint] = useState(true);
  // phones, from the first sheet on: which sheet is open (-1 in the story), and the pull back to the start
  const [sheetUi, setSheetUi] = useState<{ idx: number; pull: number; going: boolean }>({ idx: -1, pull: 0, going: false });
  const sheetRef = useRef({ armed: false, going: false, last: -1, settle: 0, jump: false, ui: '', rest: -1, idx: -1, restT: 0 });

  const pickFrame = (k: number, byHand: boolean) => { manual.current = byHand; selRef.current = k; setSelected(k); };

  // frame and scale follow the window
  useEffect(() => {
    let t = 0, lastW = 0, lastH = 0;
    const apply = (force = false) => {
      // phones: the address bar hiding or showing changes only the height; keep the stage as it is
      const w = window.innerWidth, h = window.innerHeight;
      if (!force && w === lastW && w < MOBILE_MAX && Math.abs(h - lastH) < 160) return;
      lastW = w; lastH = h;
      const head = piece ? (document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 0 : 0;
      setTop(head);
      const sticky = wrapRef.current?.querySelector('.landing__sticky') as HTMLElement | null;
      const vh = (w < MOBILE_MAX && sticky?.clientHeight) || h;
      const m = w < MOBILE_MAX, f = fitConfig(m ? MOBILE : DESKTOP, w, vh - head, m);
      scaleRef.current = f.s;
      setFit((old) => (old.mobile === m && old.C.W === f.C.W && old.C.H === f.C.H && old.s === f.s ? old : { mobile: m, C: f.C, s: f.s }));
    };
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => apply(), 120); };
    apply(true);
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const reduce = prefersReducedMotion();
    let raf = 0, dead = false, sys = 0, statusBack = false;
    Promise.all([loadGallop(), piece ? Promise.resolve(null) : loadRider().catch(() => null)]).then(([g, rider]) => {
      if (dead) return;
      setFlight(g.flight);
      engineRef.current = createLanding({
        C, canvas, gallop: g, dom: () => dom.current, reduce, mode: 1, narrated, glyphFamily, rider, heroFall: !piece && !reduce,
        title: page.jugar.title, glyphText: page.intro.glyphText, labels: { camera: ui.cameraCounter, frame: ui.frameCounter },
        onFrame: (k) => pickFrame(k, false),
      });
      // the hero comes apart on the first scroll (canvas "hero: secuencia completa"); still with reduced motion
      if (!piece && !reduce && stageRef.current && dom.current.hero) fallRef.current = createHeroFall(stageRef.current, dom.current.hero, [hintRef2.current, statusRef.current].filter((el): el is HTMLParagraphElement | HTMLSpanElement => !!el), { W: C.W, H: C.H });
      // arriving with a hash (for example "/#jugar" from a section) lands on that sheet
      const k = sectionIndex(window.location.hash);
      if (k >= 0) requestAnimationFrame(() => scrollToSection(k, true));
    });
    // Phones (canvas "móvil: un deslizamiento, una hoja"): 1 is the start, the hero and
    // the story, scrolled freely. From 2 (about) on, one swipe moves one sheet (the
    // sheet stops snap with stop: always) and a bar says where you are. Going up from
    // 2 would rewind the whole story by scroll, so a ring fills instead; full, the
    // carcoma takes you to the start and the story begins again. Let go early and
    // you settle back on 2.
    const sheetsOnPhone = (target: number, sc: number) => {
      const st = sheetRef.current, s0 = sectionStart(C), past = (target - s0) * sc, html = document.documentElement;
      if (past >= -2) st.armed = true;
      if (target < 4) st.armed = false;
      const pulling = st.armed && past < -2 && !st.going;
      const pull = pulling ? Math.min(1, -past / PULL) : 0;
      html.classList.toggle('snap-sheets', past > -window.innerHeight * 0.3 && !pulling && !st.going);
      if (pull >= 1 && !st.going) {
        st.going = true; st.armed = false;
        go(() => { st.jump = true; scrollToSection(-1, true); window.setTimeout(() => { st.going = false; }, 600); });
      }
      if (pulling && pull < 1 && target !== st.last) { window.clearTimeout(st.settle); st.settle = window.setTimeout(() => scrollToSection(0), 420); }
      if (!pulling) window.clearTimeout(st.settle);
      st.last = target;
      const idx = past < -2 ? -1 : Math.max(0, Math.min(4, Math.round((target - s0) / C.SECT)));
      // a strong fling never skips a sheet: past the next sheet's stop, the
      // scroll is held there (iOS does not always honour scroll-snap-stop)
      st.idx = idx;
      if (idx < 0 || st.going) st.rest = -1;
      else {
        if (st.rest < 0) st.rest = idx;
        const stops = sheetStops(C), over = 60;
        if (st.rest < 4 && target > stops[st.rest + 1] + over) { st.rest += 1; scrollToSection(st.rest, true); }
        else if (st.rest > 0 && target < stops[st.rest - 1] - over) { st.rest -= 1; scrollToSection(st.rest, true); }
        window.clearTimeout(st.restT); st.restT = window.setTimeout(() => { if (st.idx >= 0) st.rest = st.idx; }, 260);
      }
      const key = `${idx}|${Math.round(pull * 40)}|${st.going}`;
      if (key !== st.ui) { st.ui = key; setSheetUi({ idx, pull: Math.round(pull * 40) / 40, going: st.going }); }
    };
    const loop = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const eng = engineRef.current; if (!eng) return;
      const s = scaleRef.current, rect = wrap.getBoundingClientRect();
      const target = Math.min(end(C), Math.max(0, (top - rect.top) / s));
      if (sheetRef.current.jump) { sheetRef.current.jump = false; sys = target; }
      if (mobile && !piece) sheetsOnPhone(target, s);
      if (piece) {
        const ph = target < 40 ? 'start' : target >= end(C) - 2 ? 'end' : 'mid';
        if (ph !== phaseRef.current) { phaseRef.current = ph; setPhase(ph); }
      }
      // a fling on a phone does not skip scenes: the story catches up at a capped pace
      const stepTo = (target - sys) * (reduce ? 1 : 0.16), cap = mobile && !reduce ? 46 : Infinity;
      sys += Math.max(-cap, Math.min(cap, stepTo));
      if (!piece) { const idle = sys < 8; if (idle !== hintRef.current) { hintRef.current = idle; setHint(idle); } }
      if (!piece) {
        // still for a moment, somewhere between the first scroll and the first sheet: ask to keep going
        const k = keepRef.current;
        if (Math.abs(target - k.lastTarget) > 0.5) { k.lastTarget = target; k.lastMove = now; }
        const on = sys > 30 && sys < sectionStart(C) - 10 && now - k.lastMove > 1200;
        if (on !== k.on) { k.on = on; setKeep(on); }
      }
      if (Math.abs(target - sys) < 0.5) sys = target;
      eng.frame({ sys, now, ptr: ptr.current, manual: manual.current, selected: selRef.current });
      fallRef.current?.update(sys / C.VOID, now);
      // the availability line, gone with the fall, drops back in from the top once the story is over (owner, 2026-11-27)
      if (!piece) {
        const st = statusRef.current, over = sys >= C.VOID + C.STORY + C.TEXT * 0.3;
        if (st && over && !statusBack) { statusBack = true; fallRef.current?.release(st); st.classList.add('is-back'); }
        else if (st && statusBack && sys < C.VOID * 0.012) { statusBack = false; st.classList.remove('is-back'); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); window.clearTimeout(sheetRef.current.settle); document.documentElement.classList.remove('snap-sheets'); engineRef.current = null; fallRef.current?.reset(); fallRef.current = null; };
    // the engine is rebuilt when the stage changes size or switches frame
  }, [fitKey, top]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { engineRef.current?.remeasure(); }, [scale, mobile]);

  // phones: the scroll settles near each chapter instead of stopping mid-transition
  useEffect(() => {
    if (piece || !mobile) return;
    document.documentElement.classList.add('snap-landing');
    return () => document.documentElement.classList.remove('snap-landing');
  }, [mobile, piece]);

  const scrollToSection = (k: number, instant = false) => {
    const wrap = wrapRef.current, eng = engineRef.current; if (!wrap) return;
    const at = wrap.getBoundingClientRect().top + window.scrollY - top;
    const y = k < 0 ? 0 : (eng ? eng.jumpOffset(k) : 0) * scaleRef.current;
    window.scrollTo({ top: at + y, behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const jump = (k: number) => (e: React.MouseEvent) => { e.preventDefault(); scrollToSection(k); };
  // only "/" and a hash ("/#jugar") scroll inside the landing; a section's path
  // ("/lab") opens its page, on a computer and on a phone (owner, 2026-11-27)
  const inLanding = (href: string) => {
    const [base, hash] = href.split('#'), { path } = splitPath(base || '/');
    if (path !== '/') return null;
    return hash ? sectionIndex(hash) : -1;
  };
  const navigate = (href: string, e: React.MouseEvent) => {
    const k = inLanding(href);
    if (k !== null) { e.preventDefault(); scrollToSection(k); return; }
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
  const sectionHeads = [jugar.title, lab.title, studio.title, notes.title, navLabel(contact.href, contact.title)];
  const setSh = (i: number) => (el: HTMLElement | null) => { dom.current.sh[i] = el; };
  const setIn = (i: number) => (el: HTMLElement | null) => { dom.current.inner[i] = el; };
  const head = (i: number) => (
    <button type="button" className="sheet__strip" onClick={jump(i)}>
      <span className="label">{pad(i + 1)}</span>{sectionHeads[i]}
    </button>
  );

  return (
    <section id={piece ? undefined : 'inicio'} ref={wrapRef} className={piece ? 'landing landing--piece' : 'landing'} aria-label={piece?.label} style={{ height: `calc(100svh - ${top}px + ${end(C) * scale}px)` }}>
      {mobile && !piece && chapters(C).map((y) => <span key={y} aria-hidden="true" className="landing__chapter" style={{ top: y * scale }} />)}
      {mobile && !piece && sheetStops(C).map((y) => <span key={y} aria-hidden="true" className="landing__chapter landing__chapter--sheet" style={{ top: y * scale }} />)}
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
          {mobile && !piece && (
            <>
              <div className="stage__progress" data-on={sheetUi.idx >= 0} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => <span key={i} className="stage__seg" data-fill={i <= sheetUi.idx} data-studio={i === 2} />)}
              </div>
              <p className="stage__where" data-on={sheetUi.idx >= 0} role="status" aria-label={intro.progressLabel}>
                {sheetUi.idx >= 0 && <><span aria-hidden="true">{pad(sheetUi.idx + 1)}/05</span><span className="vh">{sectionHeads[sheetUi.idx]}</span></>}
              </p>
              <div className="stage__pull" data-on={sheetUi.pull > 0.04 || sheetUi.going} aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 56 56"><circle className="stage__pull-track" cx="28" cy="28" r="24" /><circle className="stage__pull-fill" cx="28" cy="28" r="24" strokeDasharray="150.8" strokeDashoffset={(150.8 * (1 - (sheetUi.going ? 1 : sheetUi.pull))).toFixed(1)} transform="rotate(-90 28 28)" /><text x="28" y="33" textAnchor="middle">↑</text></svg>
                <span>{sheetUi.going || sheetUi.pull >= 1 ? intro.restartGo : intro.restartHint}</span>
              </div>
            </>
          )}
          {!piece && <p className="stage__keep" data-on={keep} aria-hidden={!keep}>{page.intro.keepScrolling} <span aria-hidden="true">↓</span></p>}
          {!piece && <p ref={hintRef2} className="stage__hint" data-fall="block" data-on={hint} aria-hidden={!hint}>{mobile ? page.intro.scrollHintTouch : page.intro.scrollHint} <span aria-hidden="true">↓</span></p>}

          {!piece && <div ref={(el) => { dom.current.hero = el; }} className="stage__hero">
            <h1 className="stage__name">
              <span className="vh">{intro.name} ({intro.nameZh})</span>
              <span aria-hidden="true">
                {mobile ? <>{letters(intro.name.split(' ')[0])}<br />{letters(intro.name.split(' ').slice(1).join(' '))}</> : letters(intro.name)}
                <span lang="zh-Hant" className="stage__zh">{letters(`(${intro.nameZh})`)}</span>
              </span>
            </h1>
            <p className="stage__role"><span className="vh">{intro.role[0]} &amp; {intro.role[1]}</span><span aria-hidden="true">{tagline(intro.role)}</span></p>
            <div className="stage__ctas">
              {intro.ctas.map((c, i) => (
                <a key={c.href} href={c.href} data-fall="block" onClick={(e) => navigate(c.href, e)} className={i === 0 ? 'btn btn--ink' : 'btn btn--signal'}>
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
                  <p className="jugar__line">{jugar.line}</p>
                  <CarcomaLink href={jugar.cta.href} className="btn btn--ink sheet__enter">{jugar.cta.label} <span aria-hidden="true">-&gt;</span></CarcomaLink>
                </div>
              </div>
            </section>

            <section ref={setSh(1)} id="lab" aria-label={lab.title} className="sheet">
              {head(1)}
              <div ref={setIn(1)} className="sheet__inner sheet__fill">
                <h2 className="sheet__title" aria-label={lab.title}><span ref={(el) => { dom.current.heads![1] = el; }} data-text={lab.title} aria-hidden="true">{lab.title}</span></h2>
                <p className="sheet__line">{lab.line}</p>
                <CarcomaLink href={lab.href} className="btn btn--ink sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(2)} id="studio" aria-label={studio.title} className="sheet sheet--studio">
              {head(2)}
              <div ref={setIn(2)} className="sheet__inner sheet__fill">
                <StudioSheetFx word={brandRef} />
                <p className="studio__lead">{studio.line.split(studio.brand)[0]}<span ref={brandRef} className="studio__brand">{studio.brand}</span>{studio.line.split(studio.brand).slice(1).join(studio.brand)}</p>
                <p className="studio__sub">{studio.sub}</p>
                <CarcomaLink href={studio.href} className="btn btn--paper-signal sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(3)} id="notes" aria-label={notes.title} className="sheet">
              {head(3)}
              <div ref={setIn(3)} className="sheet__inner sheet__fill">
                <h2 className="sheet__title" aria-label={notes.title}><span ref={(el) => { dom.current.heads![3] = el; }} data-text={notes.title} aria-hidden="true">{notes.title}</span></h2>
                <p className="sheet__line">{notes.line}</p>
                <CarcomaLink href={notes.href} className="btn btn--ink sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>

            <section ref={setSh(4)} id="contact" aria-label={contact.title} className="sheet sheet--contact">
              {head(4)}
              <div ref={setIn(4)} className="sheet__inner sheet__fill">
                <h2 className="contact__title" aria-label={contact.title}><span ref={(el) => { dom.current.heads![4] = el; }} data-text={contact.title} aria-hidden="true">{contact.title}</span></h2>
                <p className="contact__lead">{contact.line} <a href={contact.email.href}>{contact.email.label}</a></p>
                <CarcomaLink href={contact.href} className="btn btn--paper sheet__enter">{ui.enterLabel} <span aria-hidden="true">-&gt;</span></CarcomaLink>
              </div>
            </section>
          </div>}

          {!piece && <header className="stage__header">
            <span ref={statusRef} className="stage__status" data-fall="block">
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
            {!mobile && <LangSwitch languages={languages} className="stage__lang" />}
          </header>}
        </div>
      </div>
      {menuOpen && (
        <MobileMenu
          name={intro.name} nameZh={intro.nameZh} availability={intro.availability} nav={nav} links={links} closeLabel={ui.closeLabel} navLabel={ui.navLabel} languages={languages} home={localePath(splitPath(lab.href).locale, '/')}
          onClose={() => setMenuOpen(false)}
          onSelect={(href, e) => {
            e.preventDefault();
            setMenuOpen(false);
            const k = inLanding(href);
            // wait for the menu to close and the page to scroll again
            requestAnimationFrame(() => requestAnimationFrame(() => { if (k !== null) scrollToSection(k); else go(href); }));
          }}
        />
      )}
    </section>
  );
}

