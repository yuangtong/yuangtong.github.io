/**
 * Studio canvas (design G8, estudio v3). Acid shapes land on the edges in
 * FOMMO's colours and eat the paper; their front is a flicker of glyphs.
 * When the paper is mostly gone the colour heals through a Bayer threshold
 * and falls apart as glyph rain, and it starts again. 12 steps a second.
 */
import { acidShape, type AcidShapeId } from './acid-shapes';
import { BAYER } from './dither';
import { color, fommoLines, fommoSplit } from './tokens';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテト字光影像点線面形色空間時刻夢門電網画素格子ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴ01#%@&*+=';
const IDS: AcidShapeId[] = ['f1', 'f4', 'f11', 'f13', 'f22', 'f34'];
const CELL = 10;

type Grid = { gw: number; gh: number; age: Int16Array; lin: Uint8Array; glyph: Uint8Array };

export function createStudio(cv: HTMLCanvasElement, title: HTMLElement | null, opts: { reduce: boolean; font: string }) {
  let g: Grid | null = null, mode: 'eat' | 'heal' = 'eat', heal = 0, lineage = 0, drawnOnce = false;
  let rain: [number, number, number, number, number][] = [];
  let ptr: [number, number] | null = null;
  const rnd = (n: number) => Math.floor(Math.random() * n);

  const seed = () => {
    if (!g) return;
    const sh = acidShape(IDS[rnd(6)]), k = 3 + rnd(2);
    const sw = Math.ceil(sh.w / k), shh = Math.ceil(sh.h / k), edge = rnd(4);
    let ox: number, oy: number;
    if (edge === 0) { ox = -sw / 2; oy = Math.random() * g.gh - shh / 2; }
    else if (edge === 1) { ox = g.gw - sw / 2; oy = Math.random() * g.gh - shh / 2; }
    else if (edge === 2) { ox = Math.random() * g.gw - sw / 2; oy = -shh / 2; }
    else { ox = Math.random() * g.gw - sw / 2; oy = g.gh - shh / 2; }
    ox = Math.round(ox); oy = Math.round(oy);
    const lin = lineage++ % fommoLines.length;
    for (let y = 0; y < shh; y++) for (let x = 0; x < sw; x++) {
      const v = sh.cells[Math.min(sh.h - 1, y * k) * sh.w + Math.min(sh.w - 1, x * k)];
      const X = ox + x, Y = oy + y;
      if (!v || X < 0 || Y < 0 || X >= g.gw || Y >= g.gh) continue;
      const i = Y * g.gw + X;
      g.age[i] = 0; g.lin[i] = lin; g.glyph[i] = rnd(GLYPHS.length);
    }
  };

  const grid = () => {
    const gw = Math.ceil(cv.clientWidth / CELL), gh = Math.ceil(cv.clientHeight / CELL);
    if (!g || g.gw !== gw || g.gh !== gh) {
      g = { gw, gh, age: new Int16Array(gw * gh).fill(-1), lin: new Uint8Array(gw * gh), glyph: new Uint8Array(gw * gh) };
      cv.width = gw * CELL; cv.height = gh * CELL;
      for (let q = 0; q < (opts.reduce ? 6 : 4); q++) seed();
    }
    return g;
  };

  const draw = (s: number) => {
    const G = g!, ctx = cv.getContext('2d')!, { gw, gh } = G;
    ctx.fillStyle = color.paper; ctx.fillRect(0, 0, gw * CELL, gh * CELL);
    ctx.font = `500 ${CELL}px ${opts.font}`; ctx.textBaseline = 'top';
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const i = y * gw + x, a = G.age[i]; if (a < 0) continue;
      const L = fommoLines[G.lin[i]];
      if (a < 5) { ctx.fillStyle = color.ink; ctx.fillText(GLYPHS[(G.glyph[i] + s) % GLYPHS.length], x * CELL, y * CELL); continue; }
      const t = Math.min(1, (a - 5) / 40), b = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
      ctx.fillStyle = b < t * 0.85 ? L[1] : L[0];
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      if ((G.glyph[i] + s) % 23 === 0) { ctx.fillStyle = color.paper; ctx.fillText(GLYPHS[G.glyph[i]], x * CELL, y * CELL); }
    }
    const keep: typeof rain = [];
    for (const r of rain) {
      if (!opts.reduce) { r[1] += 1; r[4]--; }
      if (r[4] > 0 && r[1] < gh) { ctx.fillStyle = fommoLines[r[2]][0]; ctx.fillText(GLYPHS[(r[3] + s) % GLYPHS.length], r[0] * CELL, r[1] * CELL); keep.push(r); }
    }
    rain = keep;
    if (opts.reduce) return;
    // glitch: a few bands slide sideways for a frame
    if (Math.random() < 0.35) {
      const bands = 1 + rnd(3);
      for (let k = 0; k < bands; k++) {
        const by = rnd(gh) * CELL, bh = (1 + rnd(4)) * CELL, sh = (rnd(9) - 4) * CELL;
        if (sh) ctx.drawImage(cv, 0, by, cv.width, bh, sh, by, cv.width, bh);
      }
    }
    // and the title splits its colour now and then
    if (title) {
      if (Math.random() < 0.18) {
        const o = 1 + rnd(4);
        title.style.textShadow = `${o}px 0 ${fommoSplit[0]}, ${-o}px 0 ${fommoSplit[1]}`;
        title.style.transform = `translateX(${rnd(7) - 3}px)`;
        title.style.clipPath = Math.random() < 0.3 ? `inset(${rnd(60)}% 0 ${rnd(30)}% 0)` : 'none';
      } else { title.style.textShadow = 'none'; title.style.transform = 'none'; title.style.clipPath = 'none'; }
    }
  };

  const step = (s: number) => {
    if (!cv.clientWidth) return;
    const G = grid(), { gw, gh } = G, N = gw * gh;
    if (opts.reduce) { if (!drawnOnce) { draw(0); drawnOnce = true; } return; }
    let taken = 0;
    const next: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = G.age[i]; if (a < 0) continue;
      taken++;
      // the horde spreads from its front, leaning toward the pointer
      if (mode === 'eat' && a < 7 && Math.random() < 0.8) {
        const x = i % gw, y = (i / gw) | 0;
        for (let n = 0; n < 2; n++) {
          let dx = rnd(3) - 1, dy = rnd(3) - 1;
          if (ptr && Math.random() < 0.45) { dx = Math.sign(ptr[0] - x); dy = Math.sign(ptr[1] - y); }
          const X = x + dx, Y = y + dy;
          if (X >= 0 && Y >= 0 && X < gw && Y < gh) { const j = Y * gw + X; if (G.age[j] < 0) next.push(j, G.lin[i]); }
        }
      }
      if (G.age[i] < 999) G.age[i]++;
    }
    for (let i = 0; i < next.length; i += 2) { G.age[next[i]] = 0; G.lin[next[i]] = next[i + 1]; G.glyph[next[i]] = rnd(GLYPHS.length); }
    const cover = taken / N;
    if (mode === 'eat') {
      if (cover > 0.72) mode = 'heal';
      else if (s % 18 === 0 || cover < 0.05) seed();
    } else {
      // healing: colour dissolves through a Bayer threshold and falls as glyph rain
      heal++;
      const th = Math.min(1, heal / 30);
      for (let i = 0; i < N; i++) {
        if (G.age[i] < 0) continue;
        const x = i % gw, y = (i / gw) | 0;
        if ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < th && Math.random() < 0.35) {
          if (Math.random() < 0.08 && rain.length < 900) rain.push([x, y, G.lin[i], rnd(GLYPHS.length), 6 + rnd(18)]);
          G.age[i] = -1;
        }
      }
      if (cover < 0.12) { mode = 'eat'; heal = 0; seed(); seed(); seed(); }
    }
    draw(s);
  };

  return {
    step,
    pointer(x: number | null, y = 0) { ptr = x === null ? null : [x / CELL, y / CELL]; },
  };
}
