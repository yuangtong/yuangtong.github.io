'use client';

import { useEffect, useRef, useState } from 'react';
import type { HomePage, Link, Settings } from '@/content/types';
import { prefersReducedMotion, pixelView, type PixelView } from '@/lib/dither';
import { loadGallop, loadOriginal, loadPhoto } from '@/lib/media';
import { CELLS, drawCard, type Media } from '@/lib/lab-cards';
import { drawNote } from '@/lib/note-cards';
import { canvasSize, createLanding, DESKTOP, fitConfig, MOBILE, span, type LandingConfig, type LandingDom } from '@/lib/landing-engine';
import { LimaClock } from './LimaClock';

type Props = { page: HomePage; nav: Link[]; ui: Settings['ui']; glyphFamily: string };

const pad = (n: number) => (n < 10 ? '0' : '') + n;
const MOBILE_MAX = 760;

/**
 * Home G7.4. The stage keeps the design scale (1440 x 900 on desktop, 390 x 844
 * on phones) on the tighter axis of the window and extends on the other, so the
 * dot grid fills the screen edge to edge. Page scroll drives the timeline.
 */
export function Landing({ page, nav, ui, glyphFamily }: Props) {
  const [fit, setFit] = useState<{ mobile: boolean; C: LandingConfig; s: number }>({ mobile: false, C: DESKTOP, s: 1 });
  const { mobile, C, s: scale } = fit;
  const fitKey = `${mobile ? 'm' : 'd'}${C.W}x${C.H}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [flight, setFlight] = useState(6);
  const [cells, setCells] = useState<Record<string, number>>(() => Object.fromEntries(page.lab.experiments.map((e) => [e.id, e.defaultCell])));
  const [copied, setCopied] = useState<string | null>(null);

  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dom = useRef<LandingDom>({ hero: null, counter: null, strip: null, sheets: null, title: null, jside: null, sh: [], inner: [], narr: [] });
  const cardEls = useRef<Record<string, HTMLCanvasElement | null>>({});
  const noteEls = useRef<Record<string, HTMLCanvasElement | null>>({});
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const manual = useRef(false);
  const selRef = useRef<number | null>(null);
  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const engineRef = useRef<ReturnType<typeof createLanding> | null>(null);
  const scaleRef = useRef(1);

  const pickFrame = (k: number, byHand: boolean) => { manual.current = byHand; selRef.current = k; setSelected(k); };

  // frame and scale follow the window
  useEffect(() => {
    let t = 0;
    const apply = () => {
      const m = window.innerWidth < MOBILE_MAX, f = fitConfig(m ? MOBILE : DESKTOP, window.innerWidth, window.innerHeight);
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
    const media: Media = {};
    let orig: Float32Array[] | undefined;
    const cardViews: Record<string, PixelView | null> = {}, noteViews: Record<string, PixelView | null> = {};
    let raf = 0, dead = false, sys = 0;
    loadOriginal().then((o) => { media.original = o; orig = o; });
    loadPhoto().then((p) => { media.photo = p; });
    loadGallop().then((g) => {
      if (dead) return;
      media.gallop = g;
      setFlight(g.flight);
      engineRef.current = createLanding({
        C, canvas, gallop: g, dom: () => dom.current, reduce, mode: 1, narrated: page.intro.narrated, glyphFamily,
        title: page.jugar.title, glyphText: page.intro.glyphText, labels: { camera: ui.cameraCounter, frame: ui.frameCounter },
        onFrame: (k) => pickFrame(k, false),
        onLab: (step) => { for (const e of page.lab.experiments) { const el = cardEls.current[e.id]; if (!el) continue; const v = cardViews[e.id] ?? (cardViews[e.id] = pixelView(el)); if (v) drawCard(v, e.visual, cellsRef.current[e.id], step, media); } },
        onNotes: (step) => { for (const n of page.notes.items) { const el = noteEls.current[n.id]; if (!el) continue; const v = noteViews[n.id] ?? (noteViews[n.id] = pixelView(el)); if (v) drawNote(v, n, step, media.gallop, orig); } },
      });
    });
    const loop = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const eng = engineRef.current; if (!eng) return;
      const s = scaleRef.current, rect = wrap.getBoundingClientRect();
      const target = Math.min(span(C), Math.max(0, -rect.top / s));
      sys += (target - sys) * (reduce ? 1 : 0.16);
      if (Math.abs(target - sys) < 0.5) sys = target;
      eng.frame({ sys, now, ptr: ptr.current, manual: manual.current, selected: selRef.current });
    };
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); engineRef.current = null; };
    // the engine is rebuilt when the stage changes size or switches frame
  }, [fitKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { engineRef.current?.remeasure(); }, [scale, mobile]);
  useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(null), 1800); return () => clearTimeout(id); }, [copied]);

  const scrollToSection = (k: number) => {
    const wrap = wrapRef.current, eng = engineRef.current; if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const y = k < 0 ? 0 : (eng ? eng.jumpOffset(k) : 0) * scaleRef.current;
    window.scrollTo({ top: top + y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const jump = (k: number) => (e: React.MouseEvent) => { e.preventDefault(); scrollToSection(k); };
  const sectionIndex = (href: string) => {
    const id = href.replace('#', ''), order = ['jugar', 'lab', 'notas', 'studio', 'contacto'];
    return id === 'inicio' ? -1 : order.indexOf(id);
  };
  const goTo = (href: string) => { const k = sectionIndex(href); return k >= -1 && (k >= 0 || href === '#inicio') ? jump(k) : undefined; };

  // pointer in design coordinates
  const onMove = (e: React.PointerEvent) => {
    const st = stageRef.current; if (!st) return;
    const r = st.getBoundingClientRect();
    ptr.current = { x: ((e.clientX - r.left) / r.width) * C.W, y: ((e.clientY - r.top) / r.height) * C.H };
    manual.current = false;
  };
  const copy = (id: string) => {
    const url = `${location.origin}/lab/${id}?celda=${cells[id]}`;
    try { navigator.clipboard?.writeText(url).catch(() => {}); } catch {}
    setCopied(id);
  };

  const { intro, jugar, lab, notes, studio, contact } = page;
  const shown = selected ?? flight;
  const cv = canvasSize(C);
  const navLabel = (id: string, fallback: string) => nav.find((l) => l.href === '#' + id)?.label ?? fallback;
  const sectionHeads = [jugar.title, lab.title, notes.title, studio.title, navLabel('contacto', contact.title)];
  const setSh = (i: number) => (el: HTMLElement | null) => { dom.current.sh[i] = el; };
  const setIn = (i: number) => (el: HTMLElement | null) => { dom.current.inner[i] = el; };
  const head = (i: number) => (
    <button type="button" className="sheet__strip" onClick={jump(i)}>
      <span className="label">{pad(i + 1)}</span>{sectionHeads[i]}
    </button>
  );

  return (
    <section id="inicio" ref={wrapRef} className="landing" style={{ height: `calc(100svh + ${span(C) * scale}px)` }}>
      <div className="landing__sticky">
        <div
          ref={stageRef}
          className="stage"
          data-frame={mobile ? 'm' : 'd'}
          style={{ width: C.W, height: C.H, transform: `translate(-50%, -50%) scale(${scale})` }}
          onPointerMove={onMove}
          onPointerLeave={() => { ptr.current = null; }}
        >
          <canvas ref={canvasRef} key={fitKey} className="stage__canvas" width={cv.w} height={cv.h} role="img" aria-label={intro.canvasLabel} />

          <div ref={(el) => { dom.current.hero = el; }} className="stage__hero">
            <h1 className="stage__name">
              {mobile ? <>{intro.name.split(' ')[0]}<br />{intro.name.split(' ').slice(1).join(' ')}</> : intro.name}
              <span lang="zh-Hant" className="stage__zh">({intro.nameZh})</span>
            </h1>
            <p className="stage__role">{intro.role}</p>
            <div className="stage__ctas">
              {intro.ctas.map((c, i) => (
                <a key={c.href} href={c.href} onClick={i === 0 ? jump(1) : undefined} className={i === 0 ? 'btn btn--ink' : 'btn btn--signal'}>
                  {c.label} <span aria-hidden="true">-&gt;</span>
                </a>
              ))}
            </div>
          </div>

          {intro.narrated && (
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

          <div ref={(el) => { dom.current.sheets = el; }} className="sheets" aria-hidden="true">
            <section ref={setSh(0)} id="jugar" aria-label={jugar.title} className="sheet sheet--jugar">
              {head(0)}
              <div ref={setIn(0)} className="sheet__inner">
                <div ref={(el) => { dom.current.jside = el; }} className="jugar__side">
                  <h2 className="jugar__title"><span className="vh">{jugar.title}</span><span ref={(el) => { dom.current.title = el; }} aria-hidden="true">{jugar.title}</span></h2>
                  <p className="label jugar__hint">{mobile ? jugar.hintTouch : jugar.hint}</p>
                </div>
              </div>
            </section>

            <section ref={setSh(1)} id="lab" aria-label={lab.title} className="sheet">
              {head(1)}
              <div ref={setIn(1)} className="sheet__inner sheet__pad">
                <div className="sheet__headline">
                  <h2 className="h2">{lab.title}</h2>
                  <p className="lead">{lab.lead}</p>
                </div>
                <div className="lab__grid">
                  {lab.experiments.map((e) => (
                    <article key={e.id} className="lab-card">
                      <div className="lab-card__text">
                        <h3 className="lab-card__title">{e.title}</h3>
                        <span className="label">{e.meta}</span>
                        <span aria-hidden="true" className="dot-rule" />
                        <div className="lab-card__controls">
                          <div role="group" aria-label={`${ui.cellGroupLabel} ${e.title}`} className="seg">
                            {CELLS.map((n) => <button key={n} type="button" aria-pressed={cells[e.id] === n} onClick={() => setCells((c) => ({ ...c, [e.id]: n }))}>{n}px</button>)}
                          </div>
                          <a href={e.href} onClick={jump(1)} className="btn btn--ink btn--sm">{ui.openLabel}</a>
                        </div>
                      </div>
                      <div className="lab-card__visual">
                        <canvas ref={(el) => { cardEls.current[e.id] = el; }} width={mobile ? 358 : 344} height={mobile ? 220 : 338} role="img" aria-label={e.alt} />
                        <button type="button" className="chip" onClick={() => copy(e.id)}>{copied === e.id ? ui.copiedLabel : ui.copyLinkLabel}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section ref={setSh(2)} id="notas" aria-label={notes.title} className="sheet">
              {head(2)}
              <div ref={setIn(2)} className="sheet__inner sheet__pad">
                <h2 className="h2">{notes.title}</h2>
                <div className="notes__grid">
                  {notes.items.map((n) => (
                    <a key={n.id} href={n.href} onClick={jump(2)} className="note-card" data-accent={n.accent}>
                      <span className="note-card__media"><canvas ref={(el) => { noteEls.current[n.id] = el; }} width={110} height={60} role="img" aria-label={n.alt} /></span>
                      <span className="note-card__body">
                        <span className="note-card__title">{n.title}</span>
                        <span className="note-card__excerpt">{n.excerpt}</span>
                        <span className="label note-card__meta">{n.meta}</span>
                        <span className="note-card__cta">{ui.readNoteLabel}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section ref={setSh(3)} id="studio" aria-label={studio.title} className="sheet sheet--studio">
              {head(3)}
              <div ref={setIn(3)} className="sheet__inner sheet__fill">
                <p className="studio__lead">{studio.lead}</p>
                <p className="studio__sub">{studio.sub}</p>
                <a href={studio.cta.href} className="btn btn--paper-signal">{studio.cta.label} <span aria-hidden="true">-&gt;</span></a>
              </div>
            </section>

            <section ref={setSh(4)} id="contacto" aria-label={contact.title} className="sheet sheet--contact">
              {head(4)}
              <div ref={setIn(4)} className="sheet__inner sheet__fill">
                <h2 className="contact__title">{contact.title}</h2>
                <p className="contact__lead">{contact.lead} <a href={contact.email.href}>{contact.email.label}</a></p>
                <div className="contact__links">
                  {contact.links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
                </div>
              </div>
            </section>
          </div>

          <header className="stage__header">
            <span className="stage__status">
              <span aria-hidden="true" className="stage__dot" />
              {intro.availability} <LimaClock />
              <span aria-hidden="true" className="cursor" />
            </span>
            {mobile ? (
              <button type="button" className="stage__index" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>{ui.menuLabel}</button>
            ) : (
              <nav aria-label="Principal" className="stage__nav">
                {nav.map((l) => <a key={l.href} href={l.href} onClick={goTo(l.href)}>{l.label}</a>)}
              </nav>
            )}
          </header>
        </div>
      </div>
      {menuOpen && (
        <MobileMenu
          name={intro.name} nameZh={intro.nameZh} availability={intro.availability} nav={nav} links={contact.links}
          closeLabel={ui.closeLabel} onClose={() => setMenuOpen(false)}
          onPick={(href) => (e) => {
            const k = sectionIndex(href);
            if (k < 0 && href !== '#inicio') return;
            e.preventDefault();
            setMenuOpen(false);
            // wait for the menu to close and the page to scroll again
            requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(k)));
          }}
        />
      )}
    </section>
  );
}

type MenuProps = {
  name: string; nameZh: string; availability: string; nav: Link[]; links: Link[]; closeLabel: string;
  onClose: () => void; onPick: (href: string) => (e: React.MouseEvent) => void;
};

/** Full-screen menu for phones (design canvas, "movil, menu abierto"). */
function MobileMenu({ name, nameZh, availability, nav, links, closeLabel, onClose, onPick }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus(); };
  }, [onClose]);
  return (
    <div ref={ref} className="menu" role="dialog" aria-modal="true" aria-label={name}>
      <div className="menu__head">
        <a href="#inicio" onClick={onPick('#inicio')} className="menu__name">{name} <span lang="zh-Hant" className="menu__zh">({nameZh})</span></a>
        <button type="button" className="menu__close" onClick={onClose}>{closeLabel}</button>
      </div>
      <nav aria-label="Principal" className="menu__nav">
        {nav.map((l) => <a key={l.href} href={l.href} onClick={onPick(l.href)}>{l.label}</a>)}
      </nav>
      <div className="menu__foot">
        <div className="menu__links">{links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
        <span className="menu__status"><span aria-hidden="true" className="stage__dot" />{availability} <LimaClock /></span>
      </div>
    </div>
  );
}
