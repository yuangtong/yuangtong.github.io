'use client';

import { useEffect, useRef, useState } from 'react';
import type { Intro, Link, Settings } from '@/content/types';
import { loadGallop } from '@/lib/media';
import { prefersReducedMotion } from '@/lib/dither';
import { bell, createIntro, ease, SPAN, STAGE } from '@/lib/intro-engine';
import { LimaClock } from './LimaClock';

type Props = { intro: Intro; nav: Link[]; ui: Settings['ui'] };

const pad = (n: number) => (n < 10 ? '0' : '') + n;

export function IntroStory({ intro, nav, ui }: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const narrRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const manual = useRef(false);
  const selectedRef = useRef<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [flight, setFlight] = useState(6);

  const pick = (k: number) => { manual.current = true; selectedRef.current = k; setSelected(k); };

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduce = prefersReducedMotion();
    let raf = 0, dead = false, visible = true, engine: ReturnType<typeof createIntro> | null = null;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' });
    io.observe(wrap);

    loadGallop().then((g) => {
      if (dead) return;
      engine = createIntro(canvas, g);
      setFlight(g.flight);
    });

    const t0 = performance.now();
    let sys = 0, drawnY = -1, drawnStep = -1, lastDraw = 0;
    const setText = (el: HTMLElement | null, s: string) => { if (el && el.textContent !== s) el.textContent = s; };

    function overlays(pv: number, q: number) {
      const textOut = ease(Math.min(1, Math.max(0, (pv - 0.03) / 0.14))), hero = heroRef.current;
      if (hero) { hero.style.opacity = (1 - textOut).toFixed(3); hero.style.transform = `translateY(${(-textOut * 64).toFixed(1)}px)`; hero.style.visibility = textOut > 0.99 ? 'hidden' : 'visible'; }
      const st = engine!.state, counter = counterRef.current;
      if (counter) {
        counter.style.opacity = q > 0.01 ? '1' : '0';
        setText(counter, q < 0.25 ? `${ui.cameraCounter} ${pad(st.cams)}/12` : `${ui.frameCounter} ${pad(st.frame + 1)}/15`);
        counter.dataset.alert = q >= 0.55 && q < 0.7 ? 'true' : 'false';
      }
      const strip = stripRef.current;
      if (strip) { const on = st.s4 > 0.15; strip.style.opacity = on ? '1' : '0'; strip.style.pointerEvents = on ? 'auto' : 'none'; }
      const bands: [number, number][] = [[0.03, 0.22], [0.3, 0.52], [0.56, 0.68], [0.8, 1.2]];
      narrRefs.current.forEach((el, i) => { if (!el) return; const o = bell(q, bands[i][0], bands[i][1]); el.style.opacity = o.toFixed(3); el.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`; });
    }

    function loop(now: number) {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      if (!visible || !engine) return;
      const step = reduce ? 40 : Math.floor(((now - t0) / 1000) * 12);
      const rect = wrap!.getBoundingClientRect(), run = rect.height - window.innerHeight;
      const target = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) * SPAN : 0;
      sys += (target - sys) * (reduce ? 1 : 0.16);
      if (Math.abs(target - sys) < 0.5) sys = target;
      const moving = Math.abs(sys - drawnY) > 0.3 || engine.hasParallax() || !!ptr.current || engine.isFalling(now);
      if ((step !== drawnStep || moving) && now - lastDraw > 28) {
        const st = engine.draw({ progress: sys, step, now, t: (now - t0) / 1000, ptr: ptr.current, manual: manual.current, selected: selectedRef.current, reduce });
        if (st.wantFrame !== null && st.wantFrame !== selectedRef.current) { selectedRef.current = st.wantFrame; setSelected(st.wantFrame); }
        overlays(st.pv, st.q);
        drawnStep = step; drawnY = sys; lastDraw = now;
      }
    }
    raf = requestAnimationFrame(loop);
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); };
  }, [ui.cameraCounter, ui.frameCounter]);

  // pointer in canvas coordinates; the canvas covers the stage like object-fit: cover
  const onMove = (e: React.PointerEvent) => {
    const st = stageRef.current; if (!st) return;
    const r = st.getBoundingClientRect(), s = Math.max(r.width / STAGE.w, r.height / STAGE.h);
    const ox = (r.width - STAGE.w * s) / 2, oy = (r.height - STAGE.h * s) / 2;
    ptr.current = { x: (e.clientX - r.left - ox) / s, y: (e.clientY - r.top - oy) / s };
    manual.current = false;
  };

  const shown = selected ?? flight;
  const { narration } = intro;

  return (
    <section id="sobre" ref={wrapRef} className="intro" aria-label={intro.name}>
      <div ref={stageRef} className="intro__stage" onPointerMove={onMove} onPointerLeave={() => { ptr.current = null; }}>
        <canvas ref={canvasRef} className="intro__canvas" width={STAGE.w} height={STAGE.h} role="img" aria-label={intro.canvasLabel} />

        <div ref={heroRef} className="intro__hero">
          <h1 className="intro__name">
            {intro.name}
            <span lang="zh-Hant" className="intro__zh">({intro.nameZh})</span>
          </h1>
          <p className="intro__role">{intro.role}</p>
          <div className="intro__ctas">
            {intro.ctas.map((c, i) => (
              <a key={c.href} href={c.href} className={i === 0 ? 'btn btn--ink' : 'btn btn--signal'}>
                {c.label} <span aria-hidden="true">-&gt;</span>
              </a>
            ))}
          </div>
        </div>

        {[...narration.lines].map((line, i) => (
          <div key={i} ref={(el) => { narrRefs.current[i] = el; }} className="intro__narr">
            <p className="mark">{line}</p>
          </div>
        ))}
        <div ref={(el) => { narrRefs.current[3] = el; }} className="intro__narr intro__narr--quote">
          <blockquote><p className="mark mark--quote">{narration.quote}</p></blockquote>
          <p className="mark mark--source">{narration.quoteSource}</p>
          <p className="mark mark--coda">{narration.coda}</p>
        </div>

        <span ref={counterRef} className="intro__counter" aria-live="off">{ui.cameraCounter} 00/12</span>

        <div ref={stripRef} className="intro__strip" role="group" aria-label={ui.frameStripLabel}>
          {Array.from({ length: 15 }, (_, k) => (
            <button key={k} type="button" aria-pressed={shown === k} data-flight={k === flight} onClick={() => pick(k)} aria-label={`${ui.frameCounter} ${k + 1} / 15`}>
              {pad(k + 1)}
            </button>
          ))}
        </div>

        <header className="intro__header">
          <span className="intro__status">
            <span aria-hidden="true" className="intro__dot" />
            {intro.availability} <LimaClock />
            <span aria-hidden="true" className="cursor" />
          </span>
          <nav aria-label="Principal" className="intro__nav">
            {nav.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </header>
      </div>
    </section>
  );
}
