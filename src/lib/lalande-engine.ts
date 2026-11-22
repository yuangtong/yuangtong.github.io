/**
 * Lalande, historia 02 (design "Lalande v4", Historias project). Scroll
 * drives `p` from 0 to 1: the horse in the air comes apart and its letters
 * spell "Lalande"; the word becomes a drop that falls on a small narcissus
 * against a dithered blue sky; the pointer is the breeze; the narcissus spins
 * and implodes into red, and Clarice Lispector's book is born from that point,
 * turns, opens on the quote, and the close is embroidered in cross-stitch.
 *
 * The scene is drawn in a 1440 x 900 frame centred in a grid that fills the
 * stage; sky and rain cover the whole grid.
 */
import type { Gallop } from './media';
import { BAYER } from './dither';
import { lalande as P } from './tokens';

export const FRAME = { W: 1440, H: 900 } as const;
const G = 12, K = 2;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const easeIn = (v: number) => v * v * v;
const smooth = (a: number, b: number, v: number) => { v = clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
const bell = (q: number, a: number, b: number) => smooth(a, a + 0.03, q) * (1 - smooth(b - 0.03, b, q));
function h2(i: number, j: number) { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const BAYN = BAYER.map((v) => (v + 0.5) / 16);
const WORD = 'lalande', TEAR = 'lagrimasdeangel', RAIN = 'lalandelagrimasdeangelnarcisomarmadrugada';
type V3 = [number, number, number];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export type LalandeDom = {
  n1: HTMLElement | null; n2: HTMLElement | null; spec: HTMLElement | null; breeze: HTMLElement | null;
  cue: HTMLElement | null; title: HTMLElement | null; book: HTMLElement | null; hinge: HTMLElement | null;
};
export type LalandeOptions = {
  canvas: HTMLCanvasElement; gallop: Gallop; dom: () => LalandeDom; reduce: boolean;
  /** Grid size in design pixels (at least the frame). */
  W: number; H: number;
  fonts: { word: string; mono: string; script: string }; closeText: string; breezeLabel: string;
};

type FP = { ty: number; x?: number; y?: number; z?: number; g?: number; sl?: number; lx?: number; ly?: number; lz?: number; u?: V3; v?: V3; n?: V3; a?: number; pet?: number; rim?: boolean };

export function createLalande(o: LalandeOptions) {
  const W = Math.ceil(o.W / G) * G, H = Math.ceil(o.H / G) * G, COLS = W / G, ROWS = H / G;
  const OX = Math.round((W - FRAME.W) / 2 / G) * G, OY = Math.round((H - FRAME.H) / 2 / G) * G;
  const CX = OX + 720;
  o.canvas.width = W * K; o.canvas.height = H * K;
  const ctx = o.canvas.getContext('2d')!;
  const MONO = `500 11px ${o.fonts.mono}`;
  const THR = new Float32Array(COLS * ROWS);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) THR[r * COLS + c] = h2(c, r);
  const cell = (x: number, y: number, bg: string | null, fg: string, ch: string) => { if (bg) { ctx.fillStyle = bg; ctx.fillRect(x - G / 2, y - G / 2, G, G); } if (ch) { ctx.fillStyle = fg; ctx.fillText(ch, x, y + 1); } };

  // the horse: the same frame in the air with which Sísifo ends
  const FW = 300, FH = 176;
  const horseCells: { x: number; y: number; v: number; h: number }[] = [];
  {
    const fr = o.gallop.frames[o.gallop.flight], sc = FW / 980, hcx = CX, hcy = OY + 470;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const X = 150 + (c * G + G / 2 - hcx) * sc, Y = 88 + (r * G + G / 2 - hcy) * sc;
      if (X < 0 || Y < 0 || X >= FW || Y >= FH) continue;
      const v = fr[(Y | 0) * FW + (X | 0)];
      if (v > 30) horseCells.push({ x: c * G + G / 2, y: r * G + G / 2, v, h: h2(c, r) });
    }
    horseCells.sort((a, b) => a.x - b.x || a.y - b.y);
  }

  // the word and the embroidered close: built once the fonts are in
  let wordCells: { x: number; y: number; h: number }[] = [], stitches: { x: number; y: number }[] = [];
  const LINE = { size: 100, k: 8, x: OX + 690, y: OY + 260, a: 0.865, b: 0.925 };
  const buildText = () => {
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
    const x = oc.getContext('2d', { willReadFrequently: true })!;
    x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `300 330px ${o.fonts.word}`;
    x.fillText('Lalande', CX, OY + 460);
    const d = x.getImageData(0, 0, W, H).data;
    wordCells = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const px = c * G + G / 2, py = r * G + G / 2; if (d[(py * W + px) * 4 + 3] > 110) wordCells.push({ x: px, y: py, h: h2(c + 3, r + 5) }); }
    wordCells.sort((a, b) => a.x - b.x || a.y - b.y);
    const cw = 760, ch = Math.ceil(LINE.size * 1.6), sc = document.createElement('canvas'); sc.width = cw; sc.height = ch;
    const sx = sc.getContext('2d', { willReadFrequently: true })!;
    sx.fillStyle = '#000'; sx.textBaseline = 'middle'; sx.font = `500 ${LINE.size}px ${o.fonts.script}`; sx.fillText(o.closeText, 0, ch / 2);
    const dd = sx.getImageData(0, 0, cw, ch).data, list: { x: number; y: number }[] = [];
    for (let yy = 0; yy < ch; yy += LINE.k) for (let xx = 0; xx < cw; xx += LINE.k) { const cx = Math.min(cw - 1, xx + (LINE.k >> 1)), cy = Math.min(ch - 1, yy + (LINE.k >> 1)); if (dd[(cy * cw + cx) * 4 + 3] > 100) list.push({ x: LINE.x + xx, y: LINE.y - ch / 2 + yy }); }
    list.sort((a, b) => a.x - b.x || a.y - b.y);
    stitches = list;
  };
  const fl = document.fonts?.load ? Promise.all([document.fonts.load(`300 330px ${o.fonts.word}`), document.fonts.load(`500 56px ${o.fonts.script}`), document.fonts.load(MONO)]) : Promise.resolve();
  fl.then(buildText, buildText);

  // the narcissus in 3D: points projected to the grid
  const FPs: FP[] = [], H0 = 450;
  {
    for (let t = 0; t <= 1; t += 1 / 160) for (let sw = -1; sw <= 1; sw++) FPs.push({ x: 12 * Math.sin(t * Math.PI) + sw * 5, y: t * H0, z: 0, ty: 0, g: t });
    for (const s of [-1, 1]) for (let t = 0; t <= 1; t += 1 / 80) for (let b = -1; b <= 1; b += 0.2) {
      const wdt = 16 * Math.sin(Math.PI * t) * (1 - 0.3 * t);
      FPs.push({ x: s * (110 * t * t + 8) + b * wdt * 0.7, y: 8 + 320 * t - 40 * t * t + b * wdt * 0.5, z: s * 18 * t, ty: 1, g: t * 0.55, sl: s });
    }
    const n = norm([0, -0.22, 1]), u = norm(cross(n, [0, 1, 0])), v = cross(u, n);
    for (let k = 0; k < 6; k++) {
      const th = (k * Math.PI) / 3 + 0.26;
      for (let a = 0; a <= 1; a += 1 / 36) for (let b = -1; b <= 1; b += 1 / 9) {
        const w = 54 * Math.sin(Math.PI * Math.min(1, a * 1.05)) * 0.5 * b, r = 18 + 122 * a;
        FPs.push({ ty: 2, lx: r * Math.cos(th) - w * Math.sin(th), ly: r * Math.sin(th) + w * Math.cos(th), lz: 7 * a * a, u, v, n, a, pet: k });
      }
    }
    for (let j = 0; j <= 7; j++) for (let ph = 0; ph < 30; ph++) {
      const rad = 30 + 12 * Math.pow(j / 7, 2), dep = (j / 7) * 48, an = (ph / 30) * Math.PI * 2;
      FPs.push({ ty: 3, lx: Math.cos(an) * rad, ly: Math.sin(an) * rad, lz: dep, u, v, n, rim: j === 7 });
    }
  }
  const ZB = new Float32Array(COLS * ROWS), ZC: (string | null)[] = new Array(COLS * ROWS), ZK: string[] = new Array(COLS * ROWS), ZF: string[] = new Array(COLS * ROWS);

  const t0 = performance.now();
  let impactT: number | null = null, wind = 0, lastPtr: { x: number } | null = null;

  /** Draw progress `p` (0..1). `ptr` is in grid coordinates. */
  function draw(p: number, now: number, ptr: { x: number; y: number } | null) {
    const d = o.dom(), reduce = o.reduce;
    const t = reduce ? 0 : (now - t0) / 1000;
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = MONO;
    let r: number, c: number, i: number;

    // a dithered blue sky for the narcissus; red climbs into it
    const blue = smooth(0.15, 0.23, p) * (1 - smooth(0.63, 0.72, p)), red = smooth(0.565, 0.645, p);
    if (blue > 0) {
      for (r = 0; r < ROWS; r++) {
        const L = (r / (ROWS - 1)) * 3, lb = L | 0, fr = L - lb;
        for (c = 0; c < COLS; c++) {
          const id = r * COLS + c;
          if (THR[id] * 0.45 + (r / ROWS) * 0.55 > blue * 1.12) continue;
          const k = lb + (fr > BAYN[(r & 3) * 4 + (c & 3)] ? 1 : 0);
          const isRed = red > (1 - r / ROWS) * 0.6 + THR[id] * 0.4;
          ctx.fillStyle = isRed ? P.red[Math.min(3, 3 - k)] : P.sky[Math.min(3, k)]; ctx.fillRect(c * G, r * G, G, G);
        }
      }
    }
    const onBlue = blue > 0.5;

    // letter rain: faint over the sky, red over the paper when the book comes
    const rainSky = blue * 0.45, rainBook = smooth(0.64, 0.72, p) * (1 - smooth(0.9, 0.99, p)) * 0.8;
    if (rainSky > 0.02 || rainBook > 0.02) {
      for (c = 0; c < COLS; c++) {
        if (h2(c, 7) > 0.34) continue;
        const sp = 5 + 9 * h2(c, 9), head = (t * sp + h2(c, 11) * ROWS * 2) % (ROWS + 16);
        for (let q = 0; q < 8; q++) {
          r = Math.floor(head) - q; if (r < 0 || r >= ROWS) continue;
          const al = 1 - q / 8, chr = RAIN[(c * 7 + r + Math.floor(t * 6)) % RAIN.length];
          if (rainSky > 0.02 && blue > THR[r * COLS + c]) { ctx.globalAlpha = al * rainSky; ctx.fillStyle = q === 0 ? P.white : red > 0.3 ? P.rainPink : P.pale; ctx.fillText(chr, c * G + G / 2, r * G + G / 2 + 1); }
          if (rainBook > 0.02) { ctx.globalAlpha = al * rainBook; ctx.fillStyle = q === 0 ? P.bookRed : P.rainRed; ctx.fillText(chr, c * G + G / 2, r * G + G / 2 + 1); }
        }
      }
      ctx.globalAlpha = 1;
    }

    // 1. the horse comes apart and its letters spell the word
    const mA = clamp((p - 0.025) / 0.1), mM = clamp((p - 0.15) / 0.075);
    if (p < 0.24 && horseCells.length && wordCells.length) {
      const nH = horseCells.length, nW = wordCells.length, tick = Math.floor(t * 10);
      for (i = 0; i < nH; i++) {
        const hc = horseCells[i], wc = wordCells[Math.floor((i * nW) / nH)];
        const mi = ease(clamp(mA * 1.6 - hc.h * 0.6));
        let x = lerp(hc.x, wc.x, mi), y = lerp(hc.y, wc.y, mi) - Math.sin(Math.PI * mi) * 60 * hc.h;
        let col: string = mi >= 1 ? P.signal : P.ink;
        if (mM > 0) {
          const mj = ease(clamp(mM * 1.6 - wc.h * 0.6));
          x = lerp(x, CX + (wc.h - 0.5) * 30, mj); y = lerp(y, OY + 118 + (h2(i, 4) - 0.5) * 30, mj);
          if (mj >= 1) continue;
          col = onBlue ? P.white : P.signal;
        }
        const ch = mi > 0 && mi < 1 && h2(i, tick) < 0.25 ? RAIN[(i + tick) % RAIN.length] : WORD[i % WORD.length];
        const solid = (mi <= 0 && hc.v > 170) || (mi >= 1 && mM <= 0);
        if (solid) cell(x, y, P.signal, P.white, ch);
        else cell(x, y, null, col, mi <= 0 && hc.v < 120 ? '·' : ch);
      }
    }

    // 2. the drop falls; the narcissus grows below; the pointer is the breeze
    const grow = ease(clamp((p - 0.22) / 0.12)), bloom = ease(clamp((p - 0.28) / 0.1));
    const yaw = ease(clamp((p - 0.5) / 0.1)) * Math.PI * 2.5 + (p > 0.5 ? t * 0.4 : 0);
    const imp = ease(clamp((p - 0.585) / 0.06));
    let target = 0;
    if (ptr && !reduce) {
      if (lastPtr) target = (ptr.x - lastPtr.x) * 0.004;
      target += ((ptr.x - CX) / 720) * 0.12;
      lastPtr = { x: ptr.x };
    } else lastPtr = null;
    wind += (target - wind) * 0.08;
    let spring = 0;
    if (p >= 0.42) { if (impactT === null) impactT = now; } else impactT = null;
    const sinceImp = impactT === null ? 1e9 : now - impactT;
    if (impactT !== null && !reduce) spring = 0.22 * Math.exp(-sinceImp / 900) * Math.sin(sinceImp / 140);
    const sway = (reduce ? 0 : 0.04 * Math.sin(t * 0.9)) + wind + spring;
    if (d.breeze) { const bs = `${o.breezeLabel} ${Math.abs(sway).toFixed(2)}`; if (d.breeze.textContent !== bs) d.breeze.textContent = bs; }
    const BX = CX, BY = OY + 890, FOC = 1400, headTop = BY - H0 - 120;
    if (grow > 0 && imp < 1) {
      ZB.fill(-1e9); ZC.fill(null);
      const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw);
      for (const Q of FPs) {
        let px: number, py: number, pz: number;
        if (Q.ty < 2) { if (Q.g! > grow) continue; px = Q.x!; py = Q.y!; pz = Q.z!; }
        else {
          if (bloom <= 0) continue;
          const s = bloom, u = Q.u!, v = Q.v!, n = Q.n!;
          px = u[0] * Q.lx! * s + v[0] * Q.ly! * s + n[0] * Q.lz! * s;
          py = H0 + u[1] * Q.lx! * s + v[1] * Q.ly! * s + n[1] * Q.lz! * s;
          pz = u[2] * Q.lx! * s + v[2] * Q.ly! * s + n[2] * Q.lz! * s;
        }
        // turn around the stem
        const rx = px * cy0 + pz * sy0, rz = -px * sy0 + pz * cy0; px = rx; pz = rz;
        // the breeze bends the top more than the base
        const bend = sway * Math.pow(py / H0, 1.4), cb = Math.cos(bend), sb = Math.sin(bend);
        const bx = px * cb - py * sb, by = px * sb + py * cb; px = bx; py = by;
        // implosion toward the centre of the flower
        if (imp > 0) { const k2 = 1 - imp; px *= k2; py = H0 + (py - H0) * k2; pz *= k2; }
        const persp = FOC / (FOC - pz), sx = BX + px * persp, syy = BY - py * persp;
        const gc = Math.floor(sx / G), gr = Math.floor(syy / G);
        if (gc < 0 || gr < 0 || gc >= COLS || gr >= ROWS) continue;
        const gid = gr * COLS + gc;
        if (pz <= ZB[gid]) continue;
        ZB[gid] = pz;
        let chh: string, colr: string, bgc: string;
        if (Q.ty === 0) { chh = '|'; bgc = P.stem; colr = P.stemLight; }
        else if (Q.ty === 1) { chh = Q.sl! > 0 ? '/' : '\\'; bgc = P.stem; colr = P.stemLight; }
        else if (Q.ty === 2) { const front = Q.n![2] * cy0 > -0.2; chh = TEAR[(Q.pet! * 5 + Math.floor(Q.a! * 9)) % TEAR.length]; bgc = front ? P.white : P.pale; colr = P.electric; }
        else { chh = Q.rim ? 'O' : '@'; bgc = Q.rim ? P.cupRim : P.cup; colr = Q.rim ? P.cup : P.cupRim; }
        ZC[gid] = bgc; ZK[gid] = chh; ZF[gid] = colr;
      }
      for (i = 0; i < ZC.length; i++) { const bg = ZC[i]; if (bg) cell((i % COLS) * G + G / 2, Math.floor(i / COLS) * G + G / 2, bg, ZF[i], ZK[i]); }
      if (imp > 0.85) { ctx.globalAlpha = (1 - imp) * 6; ctx.fillStyle = P.rainRed; ctx.beginPath(); ctx.arc(BX, BY - H0, 140 * imp, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    }
    // the drop: falls slowly with the scroll and breaks on the petal
    if (p >= 0.215 && p < 0.42) {
      const dy = lerp(OY + 118, headTop, easeIn(clamp((p - 0.235) / 0.185))), Rd = 40, form = clamp((p - 0.215) / 0.02);
      for (r = Math.floor((dy - Rd * 2.6) / G); r <= Math.ceil((dy + Rd) / G); r++) for (c = Math.floor((CX - Rd) / G); c <= Math.ceil((CX + Rd) / G); c++) {
        const ex = c * G + G / 2 - CX, ey = r * G + G / 2 - dy;
        const inside = ex * ex + ey * ey < Rd * Rd || (ey < 0 && ey > -Rd * 2.6 && Math.abs(ex) < Rd * (1 + ey / (Rd * 2.6)));
        if (!inside || h2(c, r) > form) continue;
        const core = ex * ex + (ey + 6) * (ey + 6) < Rd * 0.45 * (Rd * 0.45);
        cell(c * G + G / 2, r * G + G / 2, core ? P.white : P.pale, P.electric, core ? '0' : 'o');
      }
    }
    // the splash runs on its own, not with the scroll
    if (impactT !== null && sinceImp < 1400 && p < 0.6) {
      const e = reduce ? 1 : clamp(sinceImp / 1100);
      for (i = 0; i < 44; i++) {
        const an = (i / 44) * Math.PI * 2 + h2(i, 2) * 0.3, rad = 26 + 170 * ease(e) * (0.5 + h2(i, 3) * 0.6);
        ctx.globalAlpha = 1 - e; ctx.fillStyle = P.white;
        ctx.fillText(i % 3 ? '·' : 'o', CX + Math.cos(an) * rad, headTop + Math.sin(an) * rad * 0.45 + 160 * e * e * h2(i, 5));
        ctx.globalAlpha = 1;
      }
    }

    // 3. the real book: born where the flower imploded, turns, settles and opens
    const appear = ease(clamp((p - 0.64) / 0.08));
    if (d.book) {
      if (appear <= 0.001) d.book.style.visibility = 'hidden';
      else {
        d.book.style.visibility = 'visible';
        const turn = ease(clamp((p - 0.72) / 0.12)), face = ease(clamp((p - 0.84) / 0.06)), open = ease(clamp((p - 0.9) / 0.07));
        const bcx = lerp(CX, OX + 360, face) + open * 120, bcy = lerp(lerp(BY - H0, OY + 450, appear), OY + 450, face);
        let yawD = lerp(-560, -30, appear) + turn * 360;
        const tilt = ptr && !reduce ? ((ptr.x - bcx) / 720) * 10 : 0;
        yawD = lerp(yawD, -14 + tilt + open * 10, face);
        const pitchD = lerp(8, 3, face), sc = appear * lerp(1, 0.92, face) * lerp(1, 0.9, open);
        d.book.style.transform = `translate3d(${(bcx - 160).toFixed(1)}px,${(bcy - 240).toFixed(1)}px,0) rotateX(${pitchD.toFixed(2)}deg) rotateY(${yawD.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        if (d.hinge) { const rise = ease(clamp(open * 2)), swing = ease(clamp((open - 0.3) / 0.7)); d.hinge.style.transform = `translateZ(${(22 + rise * 6).toFixed(1)}px) rotateY(${(-swing * 150).toFixed(1)}deg)`; }
      }
    }

    // 4. the close, embroidered in cross-stitch
    if (p > 0.86 && stitches.length) {
      const cnt = Math.floor(stitches.length * clamp((p - LINE.a) / (LINE.b - LINE.a)));
      if (cnt > 0) {
        const kk = LINE.k, m = kk * 0.2;
        ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.3, kk * 0.24);
        ctx.strokeStyle = P.red[0]; ctx.beginPath();
        for (i = 0; i < cnt; i++) { const s0 = stitches[i]; ctx.moveTo(s0.x + m, s0.y + kk - m); ctx.lineTo(s0.x + kk - m, s0.y + m); }
        ctx.stroke();
        ctx.strokeStyle = P.bookRed; ctx.beginPath();
        for (i = 0; i < cnt; i++) { const s1 = stitches[i]; ctx.moveTo(s1.x + m, s1.y + m); ctx.lineTo(s1.x + kk - m, s1.y + kk - m); }
        ctx.stroke();
      }
    }

    // the DOM texts
    const op = (el: HTMLElement | null, v: number) => { if (!el) return; el.style.opacity = v.toFixed(3); el.style.transform = `translateY(${((1 - v) * 16).toFixed(1)}px)`; };
    op(d.n1, bell(p, 0.27, 0.41));
    op(d.n2, bell(p, 0.44, 0.57));
    if (d.spec) d.spec.style.opacity = bell(p, 0.25, 0.6).toFixed(3);
    if (d.cue) d.cue.style.opacity = (1 - clamp(p / 0.02)).toFixed(3);
    if (d.title) { const w = ease(clamp((p - 0.905) / 0.03)); d.title.style.clipPath = `inset(-10% ${((1 - w) * 100).toFixed(1)}% -10% 0)`; }
  }

  return { draw, size: { W, H, OX, OY } };
}
