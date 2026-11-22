/**
 * 404 (design G "404", reworked with the owner, 2026-11-22). The number stands
 * whole in a dot matrix; the horse gallops in, crashes into it and the dots
 * crumble, fly and pile up on the floor. Once the horse is gone the number
 * gathers itself again and the horse comes back. 12 steps a second.
 */
import type { Gallop } from './media';
import { color } from './tokens';

const P = 8, S = 4, FW = 300, FH = 176, NF = 15;
const GLYPH: Record<string, string> = { '4': '00010001100101010010111110001000010', '0': '01110100011001110101110011000101110' };
function h2(i: number, j: number) { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

type Dot = { hc: number; hr: number; x: number; y: number; vx: number; vy: number; st: 0 | 1 | 2 | 3 };

export function createCrash(cv: HTMLCanvasElement, gallop: Gallop, reduce: boolean, text = '404') {
  const w = cv.clientWidth, h = cv.clientHeight, D = 2;
  cv.width = w * D; cv.height = h * D;
  const ctx = cv.getContext('2d')!;
  const C = Math.ceil(w / P), R = Math.ceil(h / P);
  const tw = text.length * 6 * S - S, th = 7 * S;
  const ox = Math.floor((C - tw) / 2), oy = Math.max(2, Math.floor((R - th) / 2) - 2);
  const home = new Uint8Array(C * R);
  const dots: Dot[] = [];
  for (let i = 0; i < text.length; i++) {
    const g = GLYPH[text[i]] ?? GLYPH['0'];
    for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) if (g[y * 5 + x] === '1')
      for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) {
        const c = ox + i * 6 * S + x * S + b, r = oy + y * S + a;
        if (c < 0 || c >= C || r >= R) continue;
        home[r * C + c] = 1;
        dots.push({ hc: c, hr: r, x: c, y: r, vx: 0, vy: 0, st: 0 });
      }
  }
  const at = new Map<number, Dot>();
  dots.forEach((d) => at.set(d.hr * C + d.hc, d));
  const floor = new Int16Array(C).fill(R - 1);
  const sc = 5, hy = oy + th - Math.round((FH / sc) * 0.78);
  const horse = (f: number, x: number, y: number) => {
    f = ((f % NF) + NF) % NF;
    return x < 0 || y < 0 || x >= FW || y >= FH ? 0 : gallop.frames[f][(y | 0) * FW + (x | 0)];
  };
  let hx = -FW / sc - 4, phase: 'run' | 'settle' | 'gather' = 'run', wait = 0;

  const knock = (d: Dot, push: number) => {
    d.st = 1; d.vx = push * (0.8 + h2(d.hc, d.hr) * 1.6); d.vy = -0.4 - h2(d.hr, d.hc) * 1.4;
  };

  function step(s: number) {
    const f = s % NF;
    if (phase === 'run') {
      hx += 2;
      // the horse hits: every dot under its body is thrown forward
      for (const d of dots) if (d.st === 0 && horse(f, (d.hc - hx) * sc, (d.hr - hy) * sc) > 30) knock(d, 1.6);
      if (hx > C + 6) phase = 'settle';
    }
    // once the horse has passed, what is left of the number gives way too
    if (phase === 'settle' || (phase === 'run' && hx > ox + tw)) for (const d of dots) if (d.st === 0 && h2(d.hc * 7 + s, d.hr) < 0.06) knock(d, 0.25);
    // what loses the dot under it crumbles
    for (const d of dots) {
      if (d.st !== 0) continue;
      const below = at.get((d.hr + 1) * C + d.hc);
      if (below && below.st !== 0 && h2(d.hc + s, d.hr) < 0.35) knock(d, 0.35);
    }
    let moving = 0;
    for (const d of dots) {
      if (d.st === 1) {
        moving++;
        d.vy += 0.32; d.vx *= 0.97; d.x += d.vx; d.y += d.vy;
        const c = Math.max(0, Math.min(C - 1, Math.round(d.x)));
        if (d.x < 0 || d.x > C - 1) d.vx = -d.vx * 0.4;
        if (d.y >= floor[c]) {
          // a pile of sand, not towers: slide to a lower neighbour before resting
          let cc = c;
          for (let k = 0; k < 6; k++) {
            const l = cc > 0 ? floor[cc - 1] : -1, rr = cc < C - 1 ? floor[cc + 1] : -1;
            if (l > floor[cc] + 1 && l >= rr) cc--; else if (rr > floor[cc] + 1) cc++; else break;
          }
          d.x = cc; d.y = floor[cc]; d.st = 2; floor[cc] = Math.max(0, floor[cc] - 1);
        }
      } else if (d.st === 3) {
        moving++;
        d.x += (d.hc - d.x) * 0.16; d.y += (d.hr - d.y) * 0.16;
        if (Math.abs(d.x - d.hc) + Math.abs(d.y - d.hr) < 0.2) { d.x = d.hc; d.y = d.hr; d.st = 0; }
      }
    }
    if (phase === 'settle' && moving === 0 && ++wait > 24) {
      // the number gathers itself again, from the bottom of the pile
      phase = 'gather'; wait = 0; floor.fill(R - 1);
      for (const d of dots) if (d.st === 2) d.st = 3;
    } else if (phase === 'gather' && moving === 0 && ++wait > 18) {
      phase = 'run'; wait = 0; hx = -FW / sc - 4;
    }
  }

  function draw(s: number) {
    const f = s % NF;
    ctx.setTransform(D, 0, 0, D, 0, 0);
    ctx.fillStyle = color.paper; ctx.fillRect(0, 0, w, h);
    const dot = (c: number, r: number, rad: number, col: string) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(c * P + 4, r * P + 4, rad, 0, 6.2832); ctx.fill(); };
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      if (home[r * C + c] && at.get(r * C + c)!.st === 0) continue;
      const v = phase === 'run' ? horse(f, (c - hx) * sc, (r - hy) * sc) : 0;
      if (v > 30) { dot(c, r, 1.6 + (2 * (v - 120)) / 135, color.signal); continue; }
      let echo = false;
      if (phase === 'run') for (let k = 1; k <= 4; k++) if (horse(f - k, (c - hx + k * 6) * sc, (r - hy) * sc) > 30) { dot(c, r, 2.6 - k * 0.35, color.echo); echo = true; break; }
      if (!echo) dot(c, r, 1, color.dotOff);
    }
    for (const d of dots) dot(d.x, d.y, d.st === 0 ? 3.4 : 3, color.ink);
  }

  if (reduce) {
    // one composed frame: the horse mid-crash, the first four already falling
    hx = ox - 30;
    for (let s = 0; s < 14; s++) step(s);
    draw(6);
    return { frame: () => {} };
  }
  let last = -1;
  return {
    frame(now: number, t0: number) {
      const s = Math.floor(((now - t0) / 1000) * 12);
      if (s === last) return;
      last = s; step(s); draw(s);
    },
  };
}
