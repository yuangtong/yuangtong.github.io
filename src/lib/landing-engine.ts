/**
 * Landing engine (home G7.4), ported from the Claude Design prototype.
 * One dot grid draws the whole opening: the hero gallop, the spiral void
 * (blue at the entrance, acid deep inside), Sisyphus (twelve threads, the hill,
 * the rock that rolls back, the frame in the air), the drop in resolution that
 * turns the horse into letters, and the sheets that open on arrival and fold
 * into strips that work as the index.
 */
import { BAYER, u32 } from './dither';
import { color, introPalette as ip } from './tokens';
import { GALLOP, type Gallop } from './media';

export type LandingConfig = {
  W: number; H: number; CS: number; K: number;
  VOID: number; STORY: number; TEXT: number; SECT: number; LAST: number;
  strip: number;
  hero: { cx: number; cy: number; s: number };
  coreFrac: number;
  run: { ax: number; ay: number; s: number };
  zoom: { ax: number; s: number; lift: number; drop: number };
  threads: { start: number; gap: number; top: number; travel: number };
  travel2: number;
  wall: { top: number };
  year: { left: number; top: number; k: number; drift?: number };
  hills: { far: number; mid: number };
  rockR: number; slope: number; scrubBottom: number;
  glyphB: number; repel: number;
  jugar: { side: number; head: number };
};

export const DESKTOP: LandingConfig = { W: 1440, H: 900, CS: 6, K: 1, VOID: 4600, STORY: 4400, TEXT: 1000, SECT: 1400, LAST: 900, strip: 48, hero: { cx: 146.2, cy: 91.8, s: 1.7 }, coreFrac: 0.6, run: { ax: 96, ay: 120, s: 3.2 }, zoom: { ax: 120, s: 1.9, lift: 9, drop: 44 }, threads: { start: 50, gap: 22, top: 30, travel: 330 }, travel2: 260, wall: { top: 34 }, year: { left: 118, top: 26, k: 5 }, hills: { far: 50, mid: 24 }, rockR: 14, slope: 0.3, scrubBottom: 120, glyphB: 2, repel: 90, jugar: { side: 560, head: 0 } };

export const MOBILE: LandingConfig = { W: 390, H: 844, CS: 4, K: 2, VOID: 2700, STORY: 2900, TEXT: 900, SECT: 1200, LAST: 700, strip: 44, hero: { cx: 49, cy: 128, s: 3.26 }, coreFrac: 0.9, run: { ax: 44, ay: 150, s: 3.6 }, zoom: { ax: 49, s: 3.1, lift: 6, drop: 70 }, threads: { start: 26, gap: 14, top: 50, travel: 170 }, travel2: 140, wall: { top: 48 }, year: { left: 14, top: 22, k: 3, drift: 0.02 }, hills: { far: 50, mid: 24 }, rockR: 10, slope: 0.3, scrubBottom: 120, glyphB: 3, repel: 64, jugar: { side: 0, head: 170 } };

/**
 * Fit a design configuration to the window: keep the design scale on the
 * tighter axis and extend the stage on the other one, so the dot grid reaches
 * every edge. Horizontal anchors move with the width, vertical ones with the
 * height, so each scene keeps its composition.
 */
/** The shortest phone stage, in design pixels, before the landing scales down to fit. */
const PHONE_MIN_H = 720;

export function fitConfig(base: LandingConfig, vw: number, vh: number, byWidth = false) {
  // phones fit the width, as every other page does, and the design's height
  // follows the screen; elsewhere the tighter axis decides and the other extends
  // (down to PHONE_MIN_H design pixels; a shorter screen scales the stage down)
  const s = byWidth ? Math.min(vw / base.W, vh / PHONE_MIN_H) : Math.min(vw / base.W, vh / base.H);
  const W = Math.max(base.W, Math.round(vw / s)), H = byWidth ? Math.round(vh / s) : Math.max(base.H, Math.round(vh / s));
  const kx = W / base.W, ky = H / base.H;
  const C: LandingConfig = {
    ...base, W, H,
    hero: { cx: base.hero.cx * kx, cy: base.hero.cy * ky, s: base.hero.s },
    run: { ax: base.run.ax * kx, ay: base.run.ay * ky, s: base.run.s },
    zoom: { ...base.zoom, ax: base.zoom.ax * kx },
    year: { ...base.year, left: base.year.left * kx },
  };
  return { C, s };
}

export const sectionStart = (C: LandingConfig) => C.VOID + C.STORY + C.TEXT;
export const span = (C: LandingConfig) => sectionStart(C) + 4 * C.SECT + C.LAST;
export const canvasSize = (C: LandingConfig) => ({ w: Math.ceil(C.W / C.CS) * C.CS * C.K, h: Math.ceil(C.H / C.CS) * C.CS * C.K });

export type LandingDom = {
  hero: HTMLElement | null; counter: HTMLElement | null; strip: HTMLElement | null;
  sheets: HTMLElement | null; title: HTMLElement | null; jside: HTMLElement | null;
  sh: (HTMLElement | null)[]; inner: (HTMLElement | null)[]; narr: (HTMLElement | null)[];
  /** Sheet titles that decode as their sheet opens (lab, notes, contact); their real text is in data-text. */
  heads?: (HTMLElement | null)[];
};

export type LandingInput = {
  sys: number; now: number; ptr: { x: number; y: number } | null; manual: boolean; selected: number | null;
};

export type LandingOptions = {
  C: LandingConfig; canvas: HTMLCanvasElement; gallop: Gallop; dom: () => LandingDom;
  reduce: boolean; mode: 0 | 1 | 2; narrated: boolean; glyphFamily: string;
  /** The rider in the hero; he lets go of the horse as the void opens. */
  rider?: Uint8Array[] | null;
  title: string; glyphText: string; labels: { camera: string; frame: string };
  /** The pointer chose a frame in the air. */
  onFrame: (k: number) => void;
  /** Called while the lab or notes sheet is in view, once per gallop step. */
  onLab?: (step: number) => void;
  onNotes?: (step: number) => void;
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const easeIn = (v: number) => v * v * v;
const smooth = (a: number, b: number, v: number) => { v = clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
const bell = (q: number, a: number, b: number) => ease(clamp((q - a) / 0.05)) * (1 - ease(clamp((q - b) / 0.05)));
function h2(i: number, j: number) { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const h3 = (i: number, j: number, k: number) => h2(i + Math.imul(k, 7919), j - Math.imul(k, 104729));
const pad = (n: number) => (n < 10 ? '0' : '') + n;
const BAYN = BAYER.map((v) => (v + 0.5) / 16);
const NOISE = '▚▞#%01yuangtong/\\<>*+=';

const F3: Record<string, string[]> = { '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '011', '001', '111'], '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'], '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'] };
const F5: Record<string, string[]> = { '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'], '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'], '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'] };

export function createLanding(o: LandingOptions) {
  const { C, canvas, reduce } = o;
  const W = C.W, H = C.H, CS = C.CS, K = C.K, P = CS * K;
  const GC = Math.ceil(W / CS), GR = Math.ceil(H / CS), FW = GALLOP.w, FH = GALLOP.h, NF = GALLOP.count;
  const VOID = C.VOID, STORY = C.STORY, TEXT = C.TEXT, SECT = C.SECT, SEC0 = sectionStart(C);
  const frames = o.gallop.frames, flight = o.gallop.flight, hoofLow = o.gallop.hoof || 172;
  const horse = (f: number, x: number, y: number) => { f = ((f % NF) + NF) % NF; return x < 0 || y < 0 || x >= FW || y >= FH ? 0 : frames[f][(y | 0) * FW + (x | 0)]; };
  const riders = o.rider ?? null;
  const rider = (f: number, x: number, y: number) => { if (!riders) return 0; f = ((f % NF) + NF) % NF; return x < 0 || y < 0 || x >= FW || y >= FH ? 0 : riders[f][(y | 0) * FW + (x | 0)]; };

  // disc masks for one P x P cell; the radius is in units of the 6 px grid
  const RS = (CS / 6) * K, MASK: Uint8Array[] = [];
  for (let q = 0; q <= 33; q++) { const rq = (q / 10) * RS, mk = new Uint8Array(P * P); for (let j = 0; j < P; j++) for (let i = 0; i < P; i++) { const dx = i + 0.5 - P / 2, dy = j + 0.5 - P / 2; mk[j * P + i] = q === 33 || dx * dx + dy * dy <= rq * rq ? 1 : 0; } MASK.push(mk); }
  const mi = (r: number) => { const k = Math.round(r * 10); return MASK[k < 0 ? 0 : k > 32 ? 32 : k]; };
  const FULL = MASK[33], M08 = mi(0.8), NONE = MASK[0];

  const PAPER = u32(color.paper), INK = u32(ip.ink), EMPTY = u32(color.dotOff), ECHO = u32(color.echo), HORSE = u32(color.signal), DIM = u32(ip.dim);
  const WALL = u32(ip.wall), HILL_MID = u32(color.echo), ELEC = u32(ip.electric), LIGHT = u32(ip.light);
  const lv = (bg: number, fg: number, r: number) => ({ bg, fg, m: mi(r) });
  const LV_BLUE = [lv(INK, DIM, 0.8), lv(INK, u32(color.signal), 1.7), lv(INK, ELEC, 2.4), lv(INK, LIGHT, 2.8), lv(PAPER, EMPTY, 0.8)];
  const LV_ACID = [lv(INK, DIM, 0.8), lv(INK, u32(ip.violet), 1.7), lv(INK, u32(ip.red), 2.4), lv(INK, u32(ip.yellow), 2.8), lv(PAPER, EMPTY, 0.8)];

  const THR = new Float32Array(GC * GR), ACT = new Float32Array(GC * GR), DN = new Float32Array(GC * GR), maxd = Math.hypot(GC / 2, GR / 2);
  for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) { const id = r * GC + c; THR[id] = h2(c, r); ACT[id] = BAYN[(r & 3) * 4 + (c & 3)] * 0.5 + h2(c + 911, r + 37) * 0.5; DN[id] = Math.hypot(c - GC / 2, r - GR / 2) / maxd; }

  const YK = C.year.k, YEAR = '1878';
  const yearPix = (x: number, y: number) => { if (y < 0 || y >= 7 * YK || x < 0) return false; const d = Math.floor(x / (6 * YK)), lx = x - d * 6 * YK; if (d > 3 || lx >= 5 * YK) return false; return F5[YEAR[d]][Math.floor(y / YK)][Math.floor(lx / YK)] === '1'; };
  const numPix = (n: number, x: number, y: number) => { const s = String(n); if (y < 0 || y >= 5 || x < 0) return false; const d = Math.floor(x / 4), lx = x - d * 4; if (d >= s.length || lx >= 3) return false; return F3[s[d]][y][lx] === '1'; };

  // tunnel
  const L = 16, QQ = 0.84, S0 = (1500 * Math.max(W, H)) / 1440, DIAG = Math.hypot(W, H);
  const ZEND = (DIAG * 1.45) / (S0 * Math.pow(QQ, L)) + 2;
  const toneOf = (k: number) => { const dd = k / L; return k % 2 === 0 ? 0.04 + 0.16 * dd : 0.5 + 0.1 * dd; };
  const gray = (v: number) => { const g = Math.round(clamp(v) * 255); return `rgb(${g},${g},${g})`; };
  const buf = document.createElement('canvas'); buf.width = GC; buf.height = GR;
  const bx = buf.getContext('2d', { willReadFrequently: true })!;

  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(canvas.width, canvas.height), px = new Uint32Array(img.data.buffer);
  const ROWW = GC * P;
  const put = (r: number, c: number, bg: number, fg: number, msk: Uint8Array) => {
    const o2 = r * P * ROWW + c * P;
    for (let jj = 0; jj < P; jj++) { const row = o2 + jj * ROWW, mrow = jj * P; for (let ii = 0; ii < P; ii++) px[row + ii] = msk[mrow + ii] ? fg : bg; }
  };

  const t0 = performance.now();
  let parx = 0, pary = 0, fallT0: number | null = null;
  const HERO = C.hero, sEnd = FW / ((W * C.coreFrac) / CS);
  let inp: LandingInput = { sys: 0, now: 0, ptr: null, manual: false, selected: null };
  const currentFrame = () => inp.selected ?? flight;

  // G7.5: each stride, the hooves and the back throw blue sparks onto the grid;
  // they drift behind the horse, twinkle and cool back into the grey dots
  type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; seed: number };
  let sparks: Spark[] = [], sparkF = -1;
  const SPARK = [ELEC, HORSE, u32(ip.cardMid), ECHO, u32(ip.cardLight)];
  const sparkMap = new Map<number, number>();
  function stepSparks(f: number, s1: number, ox: number, oy: number, on: boolean) {
    if (f === sparkF) return;
    sparkF = f;
    for (const sp of sparks) { sp.x += sp.vx; sp.y += sp.vy; sp.vx *= 0.9; sp.vy += 0.04; sp.age++; }
    sparks = sparks.filter((sp) => sp.age < sp.life && sp.x > -2);
    if (on) {
      let tries = 0, made = 0;
      while (made < 13 && tries < 600) {
        tries++;
        const low = Math.random() < 0.75, sx = Math.random() * FW, sy = low ? FH * (0.62 + Math.random() * 0.38) : Math.random() * FH * 0.5;
        if (horse(f, sx, sy) <= 30) continue;
        made++;
        sparks.push({ x: ox + sx / s1, y: oy + sy / s1, vx: -(1.2 + Math.random() * 3.2) * (6 / CS), vy: (low ? -0.25 : -0.5) * Math.random() * (6 / CS), age: 0, life: 14 + Math.floor(Math.random() * 22), seed: Math.random() * 6.28 });
      }
    }
    if (sparks.length > 600) sparks.splice(0, sparks.length - 600);
  }

  // 1. from the hero into the void
  function drawVoid(step: number, now: number, p: number) {
    const t = reduce ? 0 : (now - t0) / 1000;
    const m = clamp((p - 0.05) / 0.28), pB = clamp((p - 0.14) / 0.84), hb = ease(clamp((p - 0.05) / 0.32));
    const ptr = inp.ptr, tx = ptr && !reduce ? (ptr.x - W / 2) * 0.03 * m : 0, ty = ptr && !reduce ? (ptr.y - H / 2) * 0.03 * m : 0;
    parx += (tx - parx) * 0.15; pary += (ty - pary) * 0.15;
    const cx = W / 2 + parx, cy = H / 2 + pary;
    const Z = Math.exp(Math.log(ZEND) * pB), tw = 0.03 + 0.055 * pB + (reduce ? 0 : 0.012 * Math.sin(t * 0.5)), g0 = reduce ? 0.2 : t * 0.035;
    const coreS = S0 * Math.pow(QQ, L) * Z;
    let tone: Uint8ClampedArray | null = null;
    if (m > 0) {
      const sc = 1 / CS;
      bx.setTransform(1, 0, 0, 1, 0, 0); bx.globalCompositeOperation = 'source-over';
      let start = 0;
      for (let k = 0; k < L; k++) if (S0 * Math.pow(QQ, k) * Z > DIAG * 1.45) start = k + 1;
      bx.fillStyle = gray(toneOf(start > 0 ? start - 1 : 0)); bx.fillRect(0, 0, GC, GR);
      for (let k = start; k <= L; k++) {
        const s = S0 * Math.pow(QQ, k) * Z;
        if (s < CS * 1.5) break;
        bx.setTransform(sc, 0, 0, sc, cx * sc, cy * sc); bx.rotate(g0 + k * tw);
        if (k === L) bx.fillStyle = gray(1);
        else { const tn = toneOf(k), gr = bx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2); gr.addColorStop(0, gray(tn + 0.13)); gr.addColorStop(1, gray(tn - 0.11)); bx.fillStyle = gr; }
        bx.fillRect(-s / 2, -s / 2, s, s);
      }
      bx.setTransform(sc, 0, 0, sc, cx * sc, cy * sc); bx.globalCompositeOperation = 'lighter';
      const hr = Math.max(coreS * 1.9, 60), rg = bx.createRadialGradient(0, 0, coreS * 0.45, 0, 0, hr);
      rg.addColorStop(0, 'rgba(255,255,255,0.42)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
      bx.fillStyle = rg; bx.fillRect(-hr, -hr, hr * 2, hr * 2);
      bx.globalCompositeOperation = 'source-over';
      tone = bx.getImageData(0, 0, GC, GR).data;
    }
    const hwc = Math.min(coreS * 0.8, W * C.coreFrac) / CS, sCore = FW / Math.max(hwc, 1);
    const s1 = Math.exp(Math.log(HERO.s) + (Math.log(sCore) - Math.log(HERO.s)) * hb);
    const hcx = HERO.cx + (cx / CS - HERO.cx) * hb, hcy = HERO.cy + (cy / CS - HERO.cy) * hb;
    const ox = hcx - 150 / s1, oy = hcy - 88 / s1, f = step % NF;
    const acidAmt = o.mode === 0 ? 0 : o.mode === 2 ? 1 : smooth(0.25, 0.5, pB) * (1 - smooth(0.72, 0.9, pB));
    const openA = m * 1.35, echoes = hb < 0.7;
    // the rider dissolves cell by cell, through the same ordered threshold, before the void opens
    const riderAmt = riders ? 1 - smooth(0.02, 0.11, p) : 0;
    stepSparks(f, s1, ox, oy, !reduce && p < 0.04);
    sparkMap.clear();
    for (const sp of sparks) {
      const kc = Math.round(sp.x), kr = Math.round(sp.y);
      if (kc < 0 || kr < 0 || kc >= GC || kr >= GR) continue;
      const heat = (1 - sp.age / sp.life) * (0.6 + 0.4 * Math.sin(t * 9 + sp.seed)), k = kr * GC + kc, prev = sparkMap.get(k);
      if (prev === undefined || prev < heat) sparkMap.set(k, heat);
    }
    for (let r = 0; r < GR; r++) {
      const brow = (r & 3) * 4;
      for (let c = 0; c < GC; c++) {
        const idx = r * GC + c;
        let bg = PAPER, fg = EMPTY, msk = M08;
        const isVoid = m > 0 && openA - DN[idx] * 0.35 > THR[idx];
        if (isVoid && tone) {
          const tv = (tone[idx * 4] / 255) * 4;
          let b = tv | 0;
          if (tv - b > BAYN[brow + (c & 3)]) b++;
          if (b > 4) b = 4;
          const lvl = acidAmt > 0 && ACT[idx] < acidAmt ? LV_ACID[b] : LV_BLUE[b];
          bg = lvl.bg; fg = lvl.fg; msk = lvl.m;
        }
        const val = horse(f, (c - ox) * s1, (r - oy) * s1);
        const heat = isVoid ? undefined : sparkMap.get(idx);
        if (val) { fg = HORSE; msk = mi(0.4 + 2.6 * (0.5 + (0.5 * (val - 120)) / 135)); }
        else if (heat !== undefined && !(riderAmt > 0 && ACT[idx] < riderAmt && rider(f, (c - ox) * s1, (r - oy) * s1) > 30)) { fg = SPARK[Math.min(4, Math.floor((1 - heat) * 5))]; msk = mi(0.9 + heat * 1.8); }
        else if (riderAmt > 0 && ACT[idx] < riderAmt) {
          // the rider keeps the photo's tones, in the horse's blue
          const rv = rider(f, (c - ox) * s1, (r - oy) * s1);
          if (rv > 30) { fg = HORSE; msk = mi(0.4 + 2.6 * (0.5 + (0.5 * (rv - 120)) / 135)); }
          else if (!isVoid && echoes) {
            let hit = 0;
            for (let e = 1; e <= 6; e++) if (horse(f - e, (c - ox) * s1 + e * 15.3, (r - oy) * s1)) { hit = e; break; }
            if (hit) { fg = ECHO; msk = mi(Math.max(0.8, 2.4 - hit * 0.25)); }
          }
        }
        else if (!isVoid && echoes) {
          let hit = 0;
          for (let e = 1; e <= 6; e++) if (horse(f - e, (c - ox) * s1 + e * 15.3, (r - oy) * s1)) { hit = e; break; }
          if (hit) { fg = ECHO; msk = mi(Math.max(0.8, 2.4 - hit * 0.25)); }
        }
        put(r, c, bg, fg, msk);
      }
    }
  }

  // 2. the story
  const story = { cams: 0, frame: 0, s4: 0 };
  function storyGeo(q: number) {
    const s1 = clamp(q / 0.25), s2 = clamp((q - 0.25) / 0.3), s4 = clamp((q - 0.7) / 0.3);
    const intro = ease(clamp(s1 / 0.3)), climb = ease(s2), settle = ease(clamp(s4 / 0.3)), zoom = ease(clamp((s4 - 0.2) / 0.6));
    const ay0 = GR / 2 + (hoofLow - 88) / sEnd, ay = lerp(ay0, C.run.ay, intro), lift = zoom * C.zoom.lift, drop = zoom * C.zoom.drop;
    return { s1, s2, s4, climb, settle, zoom, th: -C.slope * climb * (1 - settle), sh: lerp(lerp(sEnd, C.run.s, intro), C.zoom.s, zoom), ax: lerp(lerp(GC / 2, C.run.ax, intro), C.zoom.ax, zoom), ay, lift, gy: ay + drop, wx: s1 * C.threads.travel + s2 * C.travel2 };
  }
  function drawStory(step: number, now: number, q: number) {
    const g = storyGeo(q), s1 = g.s1, s2 = g.s2, s4 = g.s4;
    if (q >= 0.55) { if (fallT0 === null) fallT0 = now; } else fallT0 = null;
    const fall = fallT0 === null ? 0 : reduce ? 1 : clamp((now - fallT0) / 1700);
    const cth = Math.cos(g.th), sth = Math.sin(g.th), { sh, ax, ay, lift, gy, wx, settle, zoom } = g;
    const chest = (0.75 * 150) / sh, R = C.rockR, dHold = chest + R + 1;
    const dEnter = lerp(C.threads.travel * 0.45, dHold, ease(clamp(s2 / 0.25)));
    const dB = q < 0.55 ? dEnter : dHold - easeIn(fall) * (dHold + GC);
    let P2 = s2 > 0 ? lerp(GC, dHold + 3, g.climb) : 1e9;
    P2 = lerp(P2, GC * 3, settle);
    const groundVis = ease(clamp(s1 / 0.18)), wallVis = (1 - ease(clamp(s2 / 0.45))) * groundVis, hillVis = ease(clamp(s2 / 0.4)) * (1 - settle);
    const rockVis = s2 > 0.02 && fall < 1 && s4 < 0.05;
    const bounce = q >= 0.55 ? Math.abs(Math.sin(fall * Math.PI * 4)) * (1 - fall) * 5 : 0;
    const rcx = ax + cth * dB + sth * (R + bounce), rcy = gy + sth * dB - cth * (R + bounce);
    const roll = (wx + dB) / R, cr = Math.cos(roll), sr = Math.sin(roll);
    let f = step % NF;
    if (s4 > 0.15) {
      const ptr = inp.ptr;
      if (ptr && !inp.manual && !reduce && ptr.y < H - C.scrubBottom) { const want = Math.max(0, Math.min(NF - 1, Math.floor((ptr.x / W) * NF))); if (want !== inp.selected) o.onFrame(want); }
      f = currentFrame();
    }
    const T = C.threads, tTravel = s1 * T.travel;
    let cams = 0;
    for (let ti = 0; ti < 12; ti++) if (ax + T.start + ti * T.gap - tTravel <= ax + chest) cams++;
    story.cams = cams; story.frame = f; story.s4 = s4;
    const yr = C.year, drift = yr.drift ?? 0.2;
    for (let r = 0; r < GR; r++) {
      for (let c = 0; c < GC; c++) {
        const idx = r * GC + c, thr = THR[idx];
        let bg = PAPER, fg = EMPTY, msk = M08;
        if (wallVis > thr) {
          if (yearPix(Math.round(c - (yr.left - wx * drift)), r - yr.top)) { fg = WALL; msk = mi(2.4); }
          const wcol = c + wx * 0.5, seg = Math.floor(wcol / 16), inSeg = wcol - seg * 16;
          if (r > C.wall.top && r < gy && inSeg < 1 && r & 1) { fg = EMPTY; msk = mi(1.3); }
          if (numPix((((seg % 40) + 40) % 40) + 1, Math.floor(inSeg) - 2, r - (C.wall.top + 2))) { fg = WALL; msk = mi(1.6); }
        }
        if (hillVis > thr) {
          const hf = ay - C.hills.far + 7 * Math.sin((c + wx * 0.15) * 0.035) + 4 * Math.sin((c + wx * 0.15) * 0.09 + 2);
          const hm = ay - C.hills.mid + 8 * Math.sin((c + wx * 0.4) * 0.05 + 1) + 3 * Math.sin((c + wx * 0.4) * 0.13);
          if (r > hm) { fg = HILL_MID; msk = r - hm < 1.2 ? mi(2.2) : (c + r) & 1 ? mi(1.1) : M08; if (r - hm >= 1.2 && !((c + r) & 1)) fg = EMPTY; }
          else if (r > hf) { fg = r - hf < 1.2 ? WALL : EMPTY; msk = r - hf < 1.2 ? mi(1.9) : mi(1.0); }
        }
        const dxc = c - ax, dyc = r - gy, u = dxc * cth + dyc * sth, hgt = dxc * sth - dyc * cth;
        const gH = u <= P2 ? 0 : -(u - P2) * 0.9;
        if (groundVis > thr && hgt < gH) { const depth = gH - hgt; bg = PAPER; fg = INK; msk = depth < 1 ? mi(2.2) : mi(Math.max(0.5, 1.5 - depth * 0.05)); }
        if (s2 < 0.3 && groundVis > 0) {
          for (let ti = 0; ti < 12; ti++) {
            const tc = Math.round(ax + T.start + ti * T.gap - tTravel - s2 * C.travel2);
            if (c !== tc) continue;
            if (r < T.top || r >= gy) break;
            if (tc > ax + chest) { fg = INK; msk = mi(1.9); }
            else { const since = ax + chest - tc; if (since < 14 && thr > since / 14) { fg = ELEC; msk = mi(2.6); } else if (r < T.top + 4 || r > gy - 3) { fg = INK; msk = mi(1.9); } }
            break;
          }
        }
        if (rockVis) {
          const rdx = c + 0.5 - rcx, rdy = r + 0.5 - rcy;
          if (rdx * rdx + rdy * rdy < R * R) {
            const nx = rdx / R, ny = rdy / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            let lum = clamp(-0.5 * nx - 0.55 * ny + 0.66 * nz);
            const tx = rdx * cr - rdy * sr, ty = rdx * sr + rdy * cr;
            if (h2(Math.floor(tx / 4) + 64, Math.floor(ty / 4) + 64) < 0.2) lum *= 0.45;
            const lv3 = lum * 3;
            let lb = lv3 | 0;
            if (lv3 - lb > BAYN[(r & 3) * 4 + (c & 3)]) lb++;
            bg = PAPER;
            if (lb <= 0) { fg = INK; msk = mi(2.6); } else if (lb === 1) { fg = HORSE; msk = mi(2.5); } else if (lb === 2) { fg = ELEC; msk = mi(2.3); } else { fg = LIGHT; msk = mi(2.0); }
          }
        }
        const hu = (c - ax) * cth + (r - ay) * sth, hh = (c - ax) * sth - (r - ay) * cth;
        const X = 150 + hu * sh, Y = hoofLow - (hh - lift) * sh, val = horse(f, X, Y);
        if (val) { fg = HORSE; msk = mi(0.4 + 2.6 * (0.5 + (0.5 * (val - 120)) / 135)); }
        else if (zoom > 0.05 && zoom > thr) { for (let e = 1; e <= 3; e++) if (horse(f - e, X + e * 22, Y)) { fg = ECHO; msk = mi(2.0 - e * 0.35); break; } }
        put(r, c, bg, fg, msk);
      }
    }
  }

  // 3. jugar con los pixeles: the cell grows until it becomes a letter
  function heldHorse() {
    const g = storyGeo(1), wpx = (FW * CS) / g.sh;
    return { cx: g.ax * CS, cy: (g.ay - g.lift) * CS - ((hoofLow - 88) * CS) / g.sh, w: wpx };
  }
  function drawBlocks(t5: number) {
    const hh = heldHorse(), sh = (FW * CS) / hh.w, ox = hh.cx / CS - 150 / sh, oy = hh.cy / CS - 88 / sh;
    const B = 1 + Math.min(C.glyphB - 1, Math.floor(ease(clamp(t5 / 0.3)) * C.glyphB));
    const fade = clamp(t5 / 0.3), f = currentFrame(), dotR = 0.8 * (1 - fade);
    for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) {
      const bc = Math.floor(c / B) * B + B / 2, br = Math.floor(r / B) * B + B / 2;
      const val = horse(f, (bc - ox) * sh, (br - oy) * sh);
      let fg = EMPTY, msk = dotR > 0.25 ? mi(dotR) : NONE;
      if (val) { fg = HORSE; msk = B > 1 ? FULL : mi(0.4 + 2.6 * (0.5 + (0.5 * (val - 120)) / 135)); }
      put(r, c, PAPER, fg, msk);
    }
  }
  type Geo = { tops: number[]; hs: number[]; k: number; u: number };
  function rectFor(geo: Geo | null) {
    const top = geo ? geo.tops[0] + C.strip : C.strip, h = geo ? geo.hs[0] - C.strip : H - C.strip * 5;
    if (C.jugar.side) return { x: C.jugar.side, y: top, w: W - C.jugar.side, h: Math.max(0, h) };
    return { x: 0, y: top + C.jugar.head, w: W, h: Math.max(0, h - C.jugar.head) };
  }
  const glyphFont = `600 12px ${o.glyphFamily}, ui-monospace, Menlo, monospace`;
  // the dithered cursor: letters it passes over scramble into glyph noise for an instant and settle back
  let scrA = new Float32Array(0);
  function drawGlyphs(step: number, now: number, m: number, reveal: number, glitch: number, rect: { x: number; y: number; w: number; h: number }, clip: { x: number; y: number; w: number; h: number } | null) {
    const G = CS * C.glyphB, cols = Math.ceil(W / G), rows = Math.ceil(H / G), tt = reduce ? 0 : Math.floor((now - t0) / 70);
    const hh = heldHorse(), tw = Math.min(rect.w * 1.1, (rect.h * 1.1 * FW) / FH), tcx = rect.x + rect.w / 2, tcy = rect.y + rect.h / 2;
    const hw = lerp(hh.w, tw, m), hcx = lerp(hh.cx, tcx, m), hcy = lerp(hh.cy, tcy, m), sc = FW / hw;
    const f = m > 0.35 && !reduce ? step % NF : currentFrame(), ptr = inp.ptr, RR = C.repel, TXT = o.glyphText;
    ctx.save();
    ctx.setTransform(K, 0, 0, K, 0, 0);
    if (clip) { ctx.beginPath(); ctx.rect(clip.x, clip.y, clip.w, clip.h); ctx.clip(); }
    ctx.fillStyle = color.paper; ctx.fillRect(0, 0, W, H);
    ctx.font = glyphFont; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (scrA.length !== cols * rows) scrA = new Float32Array(cols * rows);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * G + G / 2, y = r * G + G / 2;
      if (clip && (x < clip.x - G || x > clip.x + clip.w + G || y < clip.y - G || y > clip.y + clip.h + G)) continue;
      const val = horse(f, 150 + (x - hcx) * sc, 88 + (y - hcy) * sc);
      if (!val) { if (((c + r) & 1) === 0 && h2(c, r) < 0.05) { ctx.fillStyle = color.dotOff; ctx.fillRect(x - 1, y - 1, 2, 2); } continue; }
      // rain: each column reveals top to bottom at its own pace
      const lim = reveal * 1.5 - h2(c, 99) * 0.5;
      if (r / rows > lim) continue;
      const head = r / rows > lim - 0.04 && reveal < 1;
      const wi = r * cols + c;
      if (ptr && !reduce) { const ex = x - ptr.x, ey = y - ptr.y; if (ex * ex + ey * ey < RR * RR * 0.11) scrA[wi] = 1; }
      scrA[wi] = Math.max(0, scrA[wi] - 0.1);
      const g2 = Math.max(glitch, scrA[wi]);
      const gx = x, gy2 = y, k = h2(c, r);
      if (k < 0.05 || head) { ctx.fillStyle = color.signal; ctx.fillRect(gx - G / 2 + 1, gy2 - G / 2 + 1, G - 2, G - 2); if (head) { ctx.fillStyle = color.white; ctx.fillText(NOISE[(c + r + tt) % NOISE.length], gx, gy2 + 1); } continue; }
      const scr = h3(c, r, tt) < g2;
      if (val > 205 || scr) {
        const ch = scr ? NOISE[Math.floor(h3(c, r, tt + 1) * NOISE.length)] : TXT[(c + r * 7) % TXT.length];
        if (ch === '▚' || ch === '▞') { ctx.fillStyle = color.ink; const q4 = G / 4; ctx.fillRect(gx - q4 * 2, gy2 - q4 * 2, q4 * 2, q4 * 2); ctx.fillRect(gx, gy2, q4 * 2, q4 * 2); }
        else { ctx.fillStyle = scr ? color.signal : color.ink; ctx.fillText(ch, gx, gy2 + 1); }
      } else if (val > 150) {
        ctx.fillStyle = color.ink; const s4q = G / 4;
        for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) if ((a + b + c + r) & 1) ctx.fillRect(gx - G / 2 + 1 + (a * G) / 2 + s4q / 2, gy2 - G / 2 + 1 + (b * G) / 2 + s4q / 2, s4q, s4q);
      } else { ctx.fillStyle = color.ink; ctx.fillRect(gx - 1.5, gy2 - 1.5, 3, 3); }
    }
    ctx.restore();
  }

  // 4. the sheets: they open on arrival and fold into strips as you pass
  function sheetGeo(x: number): Geo {
    const S = C.strip, open = H - 4 * S, hs = [S, S, S, S, S];
    const k = Math.max(0, Math.min(4, Math.floor(x))), u = x - k;
    hs[k] = open;
    if (k < 4 && u > 0.85) { const e = ease((u - 0.85) / 0.15); hs[k] = lerp(open, S, e); hs[k + 1] = lerp(S, open, e); }
    const tops: number[] = [];
    let acc = 0;
    for (let i = 0; i < 5; i++) { tops.push(acc); acc += hs[i]; }
    return { tops, hs, k, u };
  }
  let contentH: number[] = [], measured = false;
  function layoutSheets(d: LandingDom, x: number, enter: number) {
    const geo = sheetGeo(x);
    if (!measured) { contentH = d.inner.map((el) => (el ? el.scrollHeight : 0)); measured = true; }
    for (let i = 0; i < 5; i++) {
      const el = d.sh[i]; if (!el) continue;
      const slide = enter < 1 ? (i === 0 ? -(1 - enter) * C.strip : (1 - enter) * (H - geo.tops[i])) : 0;
      el.style.transform = `translateY(${(geo.tops[i] + slide).toFixed(1)}px)`;
      el.style.height = geo.hs[i].toFixed(1) + 'px';
      const inner = d.inner[i];
      if (inner) {
        const avail = geo.hs[i] - C.strip, over = Math.max(0, contentH[i] - (H - 5 * C.strip));
        const u = i === geo.k ? geo.u : i < geo.k ? 1 : 0;
        inner.style.transform = `translateY(${(-over * clamp((u - 0.12) / 0.66)).toFixed(1)}px)`;
        inner.style.visibility = avail < 4 ? 'hidden' : 'visible';
      }
    }
    if (d.jside) d.jside.style.transform = enter < 1 ? `translateX(${(-(1 - ease(enter)) * 110).toFixed(1)}%)` : '';
    return geo;
  }
  function decode(t: number, T = o.title) {
    const n = Math.floor(T.length * clamp(t)), tt = Math.floor(performance.now() / 60);
    let s = '';
    for (let i = 0; i < T.length; i++) s += i < n || T[i] === ' ' ? T[i] : NOISE[Math.floor(h3(i, 3, tt) * NOISE.length)];
    return s;
  }
  const setText = (el: HTMLElement | null, s: string) => { if (el && el.textContent !== s) el.textContent = s; };

  function overlays(d: LandingDom, pv: number, q: number, t5: number) {
    const textOut = ease(clamp((pv - 0.03) / 0.14));
    if (d.hero) { d.hero.style.opacity = (1 - textOut).toFixed(3); d.hero.style.transform = `translateY(${(-textOut * 64).toFixed(1)}px)`; d.hero.style.visibility = textOut > 0.99 ? 'hidden' : 'visible'; }
    const inStory = q > 0.01 && t5 < 0.12;
    if (d.counter) {
      d.counter.style.opacity = inStory ? '1' : '0';
      setText(d.counter, q < 0.25 ? `${o.labels.camera} ${pad(story.cams)}/12` : `${o.labels.frame} ${pad(story.frame + 1)}/15`);
      d.counter.dataset.alert = q >= 0.55 && q < 0.7 ? 'true' : 'false';
    }
    if (d.strip) { const on = story.s4 > 0.15 && t5 < 0.05; d.strip.style.opacity = on ? '1' : '0'; d.strip.style.pointerEvents = on ? 'auto' : 'none'; d.strip.style.visibility = on ? 'visible' : 'hidden'; }
    if (o.narrated) {
      const bands: [number, number][] = [[0.03, 0.22], [0.3, 0.52], [0.56, 0.68], [0.8, 1.2]];
      d.narr.forEach((el, i) => { if (!el) return; const op = bell(q, bands[i][0], bands[i][1]) * (1 - clamp(t5 / 0.1)); el.style.opacity = op.toFixed(3); el.style.transform = `translateY(${((1 - op) * 18).toFixed(1)}px)`; });
    }
  }

  let drawn = -1, drawnY = -1, lastDraw = 0, lastSide = -1;
  return {
    /** Invalidate measured sheet heights after the content changes size. */
    remeasure() { measured = false; },
    frame(input: LandingInput) {
      inp = input;
      const now = input.now, sys = input.sys, d = o.dom();
      const step = reduce ? 40 : Math.floor(((now - t0) / 1000) * 12);
      const pv = clamp(sys / VOID), q = clamp((sys - VOID) / STORY), t5 = clamp((sys - VOID - STORY) / TEXT), x = Math.max(0, (sys - SEC0) / SECT);
      const falling = fallT0 !== null && now - fallT0 < 1800;
      const moving = Math.abs(sys - drawnY) > 0.3 || Math.abs(parx) > 0.05 || !!input.ptr || falling;
      const glyphMode = t5 >= 0.3, sheetsOn = t5 > 0.55, enter = ease(clamp((t5 - 0.55) / 0.3));
      let geo: Geo | null = null;
      if (d.sheets) { d.sheets.style.visibility = sheetsOn ? 'visible' : 'hidden'; d.sheets.style.pointerEvents = sheetsOn && enter > 0.9 ? 'auto' : 'none'; d.sheets.setAttribute('aria-hidden', sheetsOn ? 'false' : 'true'); }
      if (sheetsOn) geo = layoutSheets(d, x, enter);
      // each sheet's title comes out of glyph noise as its sheet opens
      if (geo && d.heads) {
        const S = C.strip, open = H - 4 * S;
        d.heads.forEach((el, k) => {
          if (!el) return;
          const T = el.dataset.text ?? '', u = reduce ? 1 : clamp(((geo!.hs[k] - S) / (open - S)) * 1.25);
          setText(el, u >= 1 ? T : decode(u, T));
        });
      }
      setText(d.title, t5 < 1 ? decode((t5 - 0.62) / 0.33) : o.title);
      const glyphVisible = glyphMode && x < 1.05;
      if ((step !== drawn || moving || glyphVisible) && now - lastDraw > 28) {
        if (glyphMode) {
          if (glyphVisible) {
            const m = ease(clamp((t5 - 0.3) / 0.55)), reveal = clamp((t5 - 0.3) / 0.25), glitch = 0.03 + 0.55 * (1 - clamp((t5 - 0.3) / 0.45));
            const clip = sheetsOn && geo ? { x: 0, y: geo.tops[0] + C.strip, w: W, h: Math.max(0, geo.hs[0] - C.strip) } : null;
            drawGlyphs(step, now, m, reveal, glitch, rectFor(sheetsOn ? geo : null), clip);
          }
        } else {
          if (t5 > 0) drawBlocks(t5);
          else if (q > 0) drawStory(step, now, q);
          else drawVoid(step, now, pv);
          ctx.putImageData(img, 0, 0);
        }
        overlays(d, pv, q, t5);
        drawn = step; drawnY = sys; lastDraw = now;
      }
      if (sheetsOn && x > 0.8 && x < 2.05 && step !== lastSide) o.onLab?.(step);
      if (sheetsOn && x > 1.8 && x < 3.05 && step !== lastSide) o.onNotes?.(step);
      lastSide = step;
    },
    jumpOffset(k: number) { return SEC0 + k * SECT + (k === 0 ? 0 : SECT * 0.12); },
  };
}
