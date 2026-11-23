/**
 * The hero comes apart (canvas "hero: secuencia completa", approved 2026-11-23).
 * At the first scroll every letter of the name and the tagline, the buttons
 * and the scroll hint pull in toward the middle of the name, then come loose:
 * gravity takes them; the letters spin, bounce on the floor and on each other
 * and pile up, and the buttons and the hint drop out of view. As the void opens it swallows whatever it reaches, turning it in
 * toward its centre. Back at the top, GSAP springs every piece home.
 *
 * It works in the stage's design pixels (the stage is scaled as a whole) and
 * moves the real DOM nodes with transforms, so the text stays real text. The
 * shape of the text does not matter: it runs the same in every language.
 */
import { gsap } from 'gsap';

type Body = {
  el: HTMLElement; hx: number; hy: number; r: number; kind: 'ch' | 'block';
  x: number; y: number; vx: number; vy: number; a: number; va: number; s: number; seed: number; gone: boolean;
};

export type HeroFallOptions = {
  /** Design size of the stage. */
  W: number; H: number;
  /** How hard the pieces pull in before they fall (0..1). */
  implosion?: number; gravity?: number; bounce?: number;
};

export function createHeroFall(stage: HTMLElement, root: HTMLElement, extra: HTMLElement[], o: HeroFallOptions) {
  const IMP = o.implosion ?? 0.6, G = 2600 * (o.gravity ?? 1), BOUNCE = o.bounce ?? 0.35;
  const scale = o.W / 1440; // pace the motion to the stage, so phones feel the same
  let bodies: Body[] = [], state: 'home' | 'falling' | 'returning' = 'home', t0 = 0, last = 0;

  const nodes = () => [...root.querySelectorAll<HTMLElement>('[data-fall]'), ...extra.filter(Boolean)];
  const apply = (b: Body) => {
    b.el.style.transform = `translate(${(b.x - b.hx).toFixed(1)}px, ${(b.y - b.hy).toFixed(1)}px) rotate(${b.a.toFixed(3)}rad) scale(${b.s.toFixed(3)})`;
    b.el.style.opacity = b.gone ? '0' : '1';
  };

  // where every piece sits at rest, in the stage's design pixels
  function measure() {
    const R = stage.getBoundingClientRect(), k = R.width / o.W || 1;
    bodies = nodes().map((el, i) => {
      el.style.transform = ''; el.style.opacity = '';
      const r = el.getBoundingClientRect(), w = r.width / k, h = r.height / k;
      const hx = (r.left - R.left) / k + w / 2, hy = (r.top - R.top) / k + h / 2;
      const kind = el.dataset.fall === 'block' ? 'block' : 'ch';
      return { el, hx, hy, kind, r: kind === 'ch' ? Math.max(h * 0.42, w * 0.45) : h / 2, x: hx, y: hy, vx: 0, vy: 0, a: 0, va: 0, s: 1, seed: Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, gone: false };
    });
  }

  function fall(now: number) {
    gsap.killTweensOf(bodies);
    measure();
    state = 'falling'; t0 = now; last = now;
    root.classList.add('is-falling');
    const ch = bodies.filter((b) => b.kind === 'ch');
    const cx = ch.reduce((n, b) => n + b.hx, 0) / (ch.length || 1), cy = ch.reduce((n, b) => n + b.hy, 0) / (ch.length || 1);
    for (const b of bodies) {
      const dx = cx - b.x, dy = cy - b.y, d = Math.hypot(dx, dy) || 1, k = b.kind === 'ch' ? 1 : 0.3;
      b.vx = (dx / d * 900 * IMP + (b.seed - 0.5) * 160) * k * scale;
      b.vy = (dy / d * 900 * IMP - 120 * IMP) * k * scale;
      b.va = (b.seed - 0.5) * (b.kind === 'ch' ? 6 : 2);
    }
  }

  function home() {
    state = 'returning';
    root.classList.remove('is-falling');
    gsap.killTweensOf(bodies);
    bodies.forEach((b, i) => {
      b.gone = false;
      gsap.to(b, { x: b.hx, y: b.hy, a: 0, s: 1, duration: 0.9, delay: i * 0.008, ease: 'expo.out', onUpdate: () => apply(b), onComplete: () => { if (i === bodies.length - 1) state = 'home'; } });
    });
  }

  /** `pv`: progress through the void (0 at the top). `voidR`: the void's reach as a share of the stage's half diagonal. */
  function update(pv: number, now: number) {
    if (pv > 0.012 && state !== 'falling') fall(now);
    else if (pv <= 0.012 && state === 'falling') home();
    if (state !== 'falling') return;
    const dt = Math.min(0.033, (now - last) / 1000); last = now;
    const g = (now - t0 > 180 ? G : G * 0.15) * scale, FLOOR = o.H - 6;
    // the void opens from the centre of the stage, as the engine draws it
    const cx = o.W / 2, cy = o.H / 2, reach = Math.min(1, Math.max(0, (pv - 0.05) / 0.28)) * Math.hypot(o.W, o.H) * 0.55;
    for (let it = 0; it < 2; it++) {
      const h = dt / 2;
      for (const b of bodies) {
        if (b.gone) continue;
        const dx = cx - b.x, dy = cy - b.y, d = Math.hypot(dx, dy);
        if (d < reach) {
          // swallowed: it turns in toward the centre and shrinks away
          b.vx += (dx * 6 - dy * 3) * h; b.vy += (dy * 6 + dx * 3) * h; b.va += 4 * h; b.s *= 1 - 1.6 * h;
          if (b.s < 0.08 || d < 12) b.gone = true;
        } else b.vy += g * h;
        b.vx *= 0.996; b.va *= 0.99;
        b.x += b.vx * h; b.y += b.vy * h; b.a += b.va * h;
        // blocks (the buttons, the hint) drop out of view; letters land and pile
        if (b.kind === 'block') { if (b.y > o.H + 200) b.gone = true; }
        else if (b.y > FLOOR - b.r) { b.y = FLOOR - b.r; b.vy *= -BOUNCE; b.vx *= 0.86; b.va *= 0.7; if (Math.abs(b.vy) < 30 * scale) b.vy = 0; }
        if (b.x < b.r) { b.x = b.r; b.vx *= -BOUNCE; }
        if (b.x > o.W - b.r) { b.x = o.W - b.r; b.vx *= -BOUNCE; }
      }
      // they push each other apart, so they pile instead of overlapping
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
        const A = bodies[i], B = bodies[j]; if (A.gone || B.gone || A.kind === 'block' || B.kind === 'block') continue;
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), m = A.r + B.r;
        if (d > 0 && d < m) {
          const ov = (m - d) / 2, nx = dx / d, ny = dy / d;
          A.x -= nx * ov; A.y -= ny * ov; B.x += nx * ov; B.y += ny * ov;
          const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
          if (rv < 0) { const imp = -(1 + BOUNCE) * rv / 2; A.vx -= imp * nx; A.vy -= imp * ny; B.vx += imp * nx; B.vy += imp * ny; }
        }
      }
    }
    bodies.forEach(apply);
  }

  return {
    update,
    /** The stage changed size: put everything home and measure again on the next fall. */
    reset() { gsap.killTweensOf(bodies); bodies.forEach((b) => { b.el.style.transform = ''; b.el.style.opacity = ''; }); bodies = []; state = 'home'; root.classList.remove('is-falling'); },
    destroy() { gsap.killTweensOf(bodies); },
  };
}
