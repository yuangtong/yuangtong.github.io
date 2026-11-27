'use client';

import { useEffect, useRef } from 'react';
import type { AboutPage } from '@/content/types';
import { acidShape, type AcidShapeId } from '@/lib/acid-shapes';
import { prefersReducedMotion } from '@/lib/dither';
import { about as T } from '@/lib/tokens';

const NOISE = '▚▞#%01yuangtong/\\<>*+=';
// césar vallejo, los heraldos negros, 1918: public domain
const POEMA = 'hay golpes en la vida, tan fuertes... yo no sé! golpes como del odio de dios; como si ante ellos, la resaca de todo lo sufrido se empozara en el alma... yo no sé! ';
const CPS = 70, AHEAD = 7;                           // typing speed; scrambled letters running ahead of the caret
const SHAPES: AcidShapeId[] = ['f1', 'f4', 'f11', 'f13', 'f22', 'f34'];
const PORTRAIT = '/about/retrato.webp';
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
function h3(a: number, b: number, c: number) { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function scramble(s: string, t: number, tt: number) {
  const n = Math.floor(s.length * clamp(t)); let o = '';
  for (let i = 0; i < s.length; i++) o += i < n || s[i] === ' ' ? s[i] : NOISE[Math.floor(h3(i, 5, tt) * NOISE.length)];
  return o;
}
type Parts = { a: HTMLSpanElement | null; c: HTMLElement | null; n: HTMLSpanElement | null; k: HTMLSpanElement | null };
type Grid = { key: string; S: number; gw: number; gh: number; L: Float32Array; age: Int16Array; phase: 'eat' | 'hold'; hold: number; crop: [number, number, number, number] };

/**
 * About (canvas "about v3", approved 2026-11-27). The portrait stays on the
 * left while the text is written on the right: the title decodes on arrival,
 * the greeting types itself, and every next paragraph is typed by the scroll,
 * with a few scrambled letters running ahead of a blue caret. The portrait is
 * eaten by César Vallejo's poem on its own clock (style "retrato F"): acid
 * shapes seed it, the carcoma spreads cell by cell into letters, ink and blue,
 * holds, and starts again. The text is real DOM text: what is typed is
 * aria-hidden over an invisible copy of the final text, so nothing jumps.
 */
export function About({ page }: { page: AboutPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const parts = useRef<Parts[]>([]);
  const texts = [...page.paras, page.closing + page.email.label];

  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const reduce = prefersReducedMotion(), t0 = performance.now();
    const header = document.querySelector<HTMLElement>('.site-header');
    const setTop = () => root.style.setProperty('--about-top', `${header?.getBoundingClientRect().height ?? 0}px`);
    setTop(); window.addEventListener('resize', setTop);
    const P = texts.map((s, i) => ({ T: s, pre: i === texts.length - 1 ? page.closing.length : s.length }));
    const count = P.map(() => 0);
    let raf = 0, lastSec = 0, lastStep = -1, g: Grid | null = null, still = false;
    const img = new Image(); let imgOk = false; img.onload = () => { imgOk = true; }; img.src = PORTRAIT;

    // the text: typed by the scroll, chasing it at 70 letters a second
    const text = (now: number) => {
      const sec = (now - t0) / 1000, dt = Math.min(0.1, sec - lastSec), vh = window.innerHeight, line = vh * 0.86; lastSec = sec;
      const tt = Math.floor(now / 55), ts = reduce ? page.title : scramble(page.title, clamp((sec - 0.1) / 0.8), tt);
      if (titleRef.current && titleRef.current.textContent !== ts) titleRef.current.textContent = ts;
      const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
      let active = -1;
      P.forEach((p, i) => {
        const el = paraRefs.current[i], r = parts.current[i]; if (!el || !r) return;
        const N = p.T.length;
        let target = reduce ? N : i === 0 ? clamp(((sec - 0.9) * CPS) / N) * N : clamp((line - el.getBoundingClientRect().top) / (vh * 0.42)) * N;
        if (atEnd) target = N;                                                   // reaching the bottom finishes it
        if (i > 0 && count[i - 1] < P[i - 1].T.length) target = 0;             // one paragraph after another
        let c = count[i]; const step = CPS * dt * (Math.abs(target - c) > 40 ? 2.2 : 1);
        c = reduce ? N : c < target ? Math.min(target, c + step) : Math.max(target, c - step * 1.6); count[i] = c;   // reduced motion: all of it, at once
        const n = Math.floor(c), A = Math.min(n, p.pre), shown = p.T.slice(0, n);
        if (n > 0 && n < N) active = i;
        if (n >= N && i === P.length - 1) active = i;
        const ahead = n > 0 && n < N && !reduce ? scramble(p.T.slice(n, n + AHEAD), 0, tt + i * 13) : '';
        const sa = shown.slice(0, A), sc = shown.slice(A);
        if (r.a && r.a.textContent !== sa) r.a.textContent = sa;
        if (r.c && r.c.textContent !== sc) r.c.textContent = sc;
        if (r.n && r.n.textContent !== ahead) r.n.textContent = ahead;
        (r as Parts & { moving?: boolean }).moving = Math.abs(target - c) > 0.5;
      });
      if (active < 0) for (let j = P.length - 1; j >= 0; j--) if (count[j] >= 1) { active = j; break; }
      parts.current.forEach((r, i) => {
        if (!r?.k) return;
        const show = i === active && ((r as Parts & { moving?: boolean }).moving || Math.floor(sec * 1.9) % 2 === 0);   // solid while typing, blinking when it waits
        const v = String(show); if (r.k.dataset.show !== v) r.k.dataset.show = v;
      });
    };

    // the portrait: the poem eats it on its own clock (retrato F)
    const grid = (W: number, H: number): Grid => {
      const S = W < 360 ? 6 : 8, gw = Math.ceil(W / S), gh = Math.ceil(H / S), key = `${gw}x${gh}`;
      if (g && g.key === key) return g;
      const c = document.createElement('canvas'); c.width = gw; c.height = gh;
      const x = c.getContext('2d', { willReadFrequently: true })!, ia = img.naturalWidth / img.naturalHeight, a = W / H;
      let sw: number, sh: number; if (ia > a) { sh = img.naturalHeight; sw = sh * a; } else { sw = img.naturalWidth; sh = sw / a; }
      const crop: Grid['crop'] = [(img.naturalWidth - sw) / 2, (img.naturalHeight - sh) * 0.3, sw, sh];
      x.drawImage(img, crop[0], crop[1], crop[2], crop[3], 0, 0, gw, gh);
      const d = x.getImageData(0, 0, gw, gh).data, L = new Float32Array(gw * gh);
      for (let i = 0; i < gw * gh; i++) L[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      g = { key, S, gw, gh, L, age: new Int16Array(gw * gh).fill(-1), phase: 'eat', hold: 0, crop }; still = false;
      return g;
    };
    const seed = (G: Grid) => {
      const sh = acidShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]), k = 4 + Math.floor(Math.random() * 3);
      const sw = Math.ceil(sh.w / k), shh = Math.ceil(sh.h / k), ox = Math.round(Math.random() * G.gw - sw / 2), oy = Math.round(Math.random() * G.gh - shh / 2);
      for (let y = 0; y < shh; y++) for (let x = 0; x < sw; x++) {
        const X = ox + x, Y = oy + y;
        if (!sh.cells[Math.min(sh.h - 1, y * k) * sh.w + Math.min(sh.w - 1, x * k)] || X < 0 || Y < 0 || X >= G.gw || Y >= G.gh) continue;
        G.age[Y * G.gw + X] = 0;
      }
    };
    let started = false;
    const eat = (G: Grid, s: number) => {
      if (s < 18) return;                                                       // clean for 1.5 s
      if (G.phase === 'hold') { if (++G.hold > 30) { G.age.fill(-1); G.phase = 'eat'; G.hold = 0; seed(G); seed(G); seed(G); } return; }
      if (!started) { started = true; seed(G); seed(G); seed(G); }
      const N = G.gw * G.gh, next: number[] = []; let taken = 0;
      for (let i = 0; i < N; i++) {
        if (G.age[i] < 0) continue;
        taken++;
        if (Math.random() < (G.age[i] < 6 ? 0.7 : 0.12)) {
          const x = i % G.gw, y = (i / G.gw) | 0, X = x + Math.floor(Math.random() * 3) - 1, Y = y + Math.floor(Math.random() * 3) - 1;
          if (X >= 0 && Y >= 0 && X < G.gw && Y < G.gh && G.age[Y * G.gw + X] < 0) next.push(Y * G.gw + X);
        }
        if (G.age[i] < 999) G.age[i]++;
      }
      for (const i of next) G.age[i] = 0;
      if (taken >= N) G.phase = 'hold'; else if (s % 22 === 0) seed(G);
    };
    const photo = (step: number) => {
      const cv = cvRef.current; if (!cv || !cv.clientWidth || !imgOk) return;
      const D = 2, W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== W * D || cv.height !== H * D) { cv.width = W * D; cv.height = H * D; }
      const ctx = cv.getContext('2d')!; ctx.setTransform(D, 0, 0, D, 0, 0);
      const G = grid(W, H), S = G.S;
      if (reduce) { if (!still) { still = true; G.age.fill(10); } } else eat(G, step);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(img, G.crop[0], G.crop[1], G.crop[2], G.crop[3], 0, 0, W, H);
      ctx.font = `500 ${S + 1}px ${getComputedStyle(cv).fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let y = 0; y < G.gh; y++) for (let x = 0; x < G.gw; x++) {
        const k = y * G.gw + x, a = G.age[k]; if (a < 0) continue;
        const l = G.L[k], X = x * S, Y = y * S, ch = POEMA[k % POEMA.length];
        ctx.fillStyle = T.paper; ctx.fillRect(X, Y, S, S);
        if (a < 5) { ctx.fillStyle = T.ink; ctx.fillText(ch, X + S / 2, Y + S / 2); continue; }      // the front that moves on
        if (l < 0.22) { ctx.fillStyle = T.ink; ctx.fillRect(X, Y, S, S); }
        else if (l < 0.4) { ctx.fillStyle = (x * 3 + y) % 7 ? T.blue : T.electric; ctx.fillRect(X, Y, S, S); }
        else if (l < 0.9) { ctx.fillStyle = l < 0.6 ? T.ink : T.quiet; ctx.fillText(ch, X + S / 2, Y + S / 2); }
      }
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      text(now);
      const step = Math.floor(((now - t0) / 1000) * 12);
      if (step !== lastStep && !document.hidden) { lastStep = step; photo(step); }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', setTop); };
  }, [page]);

  const part = (i: number, k: keyof Parts) => (el: HTMLElement | null) => { (parts.current[i] ??= { a: null, c: null, n: null, k: null })[k] = el as never; };
  const last = texts.length - 1;
  return (
    <section ref={rootRef} className="about" aria-label={page.title}>
      <div className="about__photo">
        <canvas ref={cvRef} className="about__cv" role="img" aria-label={page.portraitAlt} />
      </div>
      <div className="about__text">
        <h1 className="about__title"><span className="vh">{page.title}</span><span ref={titleRef} aria-hidden="true">{page.title}</span></h1>
        {texts.map((t, i) => (
          <p key={i} ref={(el) => { paraRefs.current[i] = el; }} className="about__para">
            <span className="vh">{i === last ? page.closing : t}{i === last && <a href={page.email.href}>{page.email.label}</a>}</span>
            <span className="about__ghost" aria-hidden="true">{t}</span>
            <span className="about__live" aria-hidden="true">
              <span ref={part(i, 'a')} />
              {i === last ? <a ref={part(i, 'c')} href={page.email.href} tabIndex={-1} /> : <span ref={part(i, 'c')} />}
              <span ref={part(i, 'n')} className="about__noise" />
              <span ref={part(i, 'k')} className="about__caret" data-show="false" />
            </span>
          </p>
        ))}
      </div>
    </section>
  );
}
