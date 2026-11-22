/**
 * Opening sequence engine (home G7.3): the hero falls into a spiral void and
 * comes out in Muybridge's 1878 gallop: twelve threads, the hill, the rock
 * that rolls back, and the frame in which no hoof touches the ground.
 * Draws a 240 x 150 cell grid (6 px cells) into a 1440 x 900 canvas.
 */
import { BAYER, u32 } from './dither';
import { color, introPalette as ip } from './tokens';
import { GALLOP, type Gallop } from './media';

export const STAGE = { w: 1440, h: 900 } as const;
/** Scroll length of the void and of the story, in design pixels. */
export const VOID = 4600;
export const STORY = 4400;
export const SPAN = VOID + STORY;

export type IntroInput = {
  progress: number; // 0..SPAN
  step: number; // gallop step at 12 fps
  now: number;
  t: number; // seconds since start, for slow drifts
  ptr: { x: number; y: number } | null;
  manual: boolean;
  selected: number | null;
  reduce: boolean;
};

export type IntroState = { cams: number; frame: number; s4: number; q: number; pv: number; wantFrame: number | null };

const W = STAGE.w, H = STAGE.h, CS = 6, GC = 240, GR = 150;
const FW = GALLOP.w, NF = GALLOP.count;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const easeIn = (v: number) => v * v * v;
const smooth = (a: number, b: number, v: number) => { v = clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
export const bell = (q: number, a: number, b: number) => ease(clamp((q - a) / 0.05)) * (1 - ease(clamp((q - b) / 0.05)));
function h2(i: number, j: number) { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const BAYN = BAYER.map((v) => (v + 0.5) / 16);

const MASK: Uint8Array[] = [];
for (let q = 0; q <= 32; q++) { const rq = q / 10, mk = new Uint8Array(36); for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) { const dx = i + 0.5 - 3, dy = j + 0.5 - 3; mk[j * 6 + i] = dx * dx + dy * dy <= rq * rq ? 1 : 0; } MASK.push(mk); }
const mi = (r: number) => { const k = Math.round(r * 10); return MASK[k < 0 ? 0 : k > 32 ? 32 : k]; };

const F3: Record<string, string[]> = { '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '011', '001', '111'], '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'], '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'] };
const F5: Record<string, string[]> = { '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'], '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'], '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'] };
const YEAR = '1878';
function yearPix(x: number, y: number) { if (y < 0 || y >= 35 || x < 0) return false; const d = Math.floor(x / 30), lx = x - d * 30; if (d > 3 || lx >= 25) return false; return F5[YEAR[d]][Math.floor(y / 5)][Math.floor(lx / 5)] === '1'; }
function numPix(n: number, x: number, y: number) { const s = String(n); if (y < 0 || y >= 5 || x < 0) return false; const d = Math.floor(x / 4), lx = x - d * 4; if (d >= s.length || lx >= 3) return false; return F3[s[d]][y][lx] === '1'; }

export function createIntro(canvas: HTMLCanvasElement, gallop: Gallop) {
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const px = new Uint32Array(img.data.buffer);
  const frames = gallop.frames;
  const horse = (f: number, x: number, y: number) => { f = ((f % NF) + NF) % NF; return x < 0 || y < 0 || x >= FW || y >= GALLOP.h ? 0 : frames[f][(y | 0) * FW + (x | 0)]; };

  const PAPER = u32(color.paper), INK = u32(ip.ink), EMPTY = u32(color.dotOff), ECHO = u32(color.echo), HORSE = u32(color.signal), DIM = u32(ip.dim);
  const WALL = u32(ip.wall), HILL_MID = u32(color.echo), ELEC = u32(ip.electric), LIGHT = u32(ip.light);
  const lv = (bg: number, fg: number, r: number) => ({ bg, fg, m: mi(r) });
  const LV_BLUE = [lv(INK, DIM, 0.8), lv(INK, u32(color.signal), 1.7), lv(INK, ELEC, 2.4), lv(INK, LIGHT, 2.8), lv(PAPER, EMPTY, 0.8)];
  const LV_ACID = [lv(INK, DIM, 0.8), lv(INK, u32(ip.violet), 1.7), lv(INK, u32(ip.red), 2.4), lv(INK, u32(ip.yellow), 2.8), lv(PAPER, EMPTY, 0.8)];
  const M08 = mi(0.8);

  const THR = new Float32Array(GC * GR), ACT = new Float32Array(GC * GR), DN = new Float32Array(GC * GR), maxd = Math.hypot(GC / 2, GR / 2);
  for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) { const id = r * GC + c; THR[id] = h2(c, r); ACT[id] = BAYN[(r & 3) * 4 + (c & 3)] * 0.5 + h2(c + 911, r + 37) * 0.5; DN[id] = Math.hypot(c - GC / 2, r - GR / 2) / maxd; }

  const L = 16, QQ = 0.84, S0 = 1500, ZEND = 28, DIAG = Math.hypot(W, H);
  const toneOf = (k: number) => { const dd = k / L; return k % 2 === 0 ? 0.04 + 0.16 * dd : 0.5 + 0.1 * dd; };
  const gray = (v: number) => { const g = Math.round(clamp(v) * 255); return 'rgb(' + g + ',' + g + ',' + g + ')'; };
  const buf = document.createElement('canvas'); buf.width = GC; buf.height = GR;
  const bx = buf.getContext('2d', { willReadFrequently: true })!;

  let parx = 0, pary = 0, fallT0: number | null = null;

  function put(r: number, c: number, bg: number, fg: number, msk: Uint8Array) {
    const o = r * CS * W + c * CS;
    for (let jj = 0; jj < 6; jj++) { const row = o + jj * W, mrow = jj * 6; for (let ii = 0; ii < 6; ii++) px[row + ii] = msk[mrow + ii] ? fg : bg; }
  }

  // 1. from the hero into the void
  function drawVoid(inp: IntroInput, p: number, mode: number) {
    const t = inp.reduce ? 0 : inp.t, step = inp.step;
    const m = clamp((p - 0.05) / 0.28), pB = clamp((p - 0.14) / 0.84), hb = ease(clamp((p - 0.05) / 0.32));
    const ptr = inp.ptr, tx = ptr && !inp.reduce ? (ptr.x - W / 2) * 0.03 * m : 0, ty = ptr && !inp.reduce ? (ptr.y - H / 2) * 0.03 * m : 0;
    parx += (tx - parx) * 0.15; pary += (ty - pary) * 0.15;
    const cx = W / 2 + parx, cy = H / 2 + pary;
    const Z = Math.exp(Math.log(ZEND) * pB), tw = 0.03 + 0.055 * pB + (inp.reduce ? 0 : 0.012 * Math.sin(t * 0.5)), g0 = inp.reduce ? 0.2 : t * 0.035;
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
    const hwc = Math.min(coreS * 0.8, W * 0.6) / CS, sCore = FW / Math.max(hwc, 1);
    const s1 = Math.exp(Math.log(1.7) + (Math.log(sCore) - Math.log(1.7)) * hb);
    const hcx = 146.2 + (cx / CS - 146.2) * hb, hcy = 91.8 + (cy / CS - 91.8) * hb;
    const ox = hcx - 150 / s1, oy = hcy - 88 / s1;
    const f = step % NF;
    const acidAmt = mode === 0 ? 0 : mode === 2 ? 1 : smooth(0.25, 0.5, pB) * (1 - smooth(0.72, 0.9, pB));
    const openA = m * 1.35, echoes = hb < 0.7;
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
        if (val) { fg = HORSE; msk = mi(0.4 + 2.6 * (0.5 + (0.5 * (val - 120)) / 135)); }
        else if (!isVoid && echoes) {
          let hit = 0;
          for (let e = 1; e <= 6; e++) if (horse(f - e, (c - ox) * s1 + e * 15.3, (r - oy) * s1)) { hit = e; break; }
          if (hit) { fg = ECHO; msk = mi(Math.max(0.8, 2.4 - hit * 0.25)); }
        }
        put(r, c, bg, fg, msk);
      }
    }
  }

  // 2. the story: 1878, the hill, the fall, the frame in the air
  function drawStory(inp: IntroInput, q: number, st: IntroState) {
    const now = inp.now, step = inp.step;
    const s1 = clamp(q / 0.25), s2 = clamp((q - 0.25) / 0.3), s4 = clamp((q - 0.7) / 0.3);
    if (q >= 0.55) { if (fallT0 === null) fallT0 = now; } else fallT0 = null;
    const fall = fallT0 === null ? 0 : inp.reduce ? 1 : clamp((now - fallT0) / 1700);
    const intro = ease(clamp(s1 / 0.3)), climb = ease(s2), settle = ease(clamp(s4 / 0.3)), zoom = ease(clamp((s4 - 0.2) / 0.6));
    const th = -0.3 * climb * (1 - settle), cth = Math.cos(th), sth = Math.sin(th);
    const sh = lerp(lerp(2.083, 3.2, intro), 1.9, zoom);
    const ax = lerp(lerp(120, 96, intro), 120, zoom), ay = lerp(117.6, 120, intro);
    const lift = zoom * 9, groundDrop = zoom * 44;
    const gy = ay + groundDrop;
    const wx = s1 * 330 + s2 * 260;
    const chest = (0.75 * 150) / sh;
    const R = 14, dHold = chest + R + 1;
    const dEnter = lerp(150, dHold, ease(clamp(s2 / 0.25)));
    const dB = q < 0.55 ? dEnter : dHold - easeIn(fall) * (dHold + 210);
    let P = s2 > 0 ? lerp(240, dHold + 3, climb) : 1e9;
    P = lerp(P, 600, settle);
    const groundVis = ease(clamp(s1 / 0.18));
    const wallVis = (1 - ease(clamp(s2 / 0.45))) * groundVis;
    const hillVis = ease(clamp(s2 / 0.4)) * (1 - settle);
    const rockVis = s2 > 0.02 && fall < 1 && s4 < 0.05;
    const bounce = q >= 0.55 ? Math.abs(Math.sin(fall * Math.PI * 4)) * (1 - fall) * 5 : 0;
    const rcx = ax + cth * dB + sth * (R + bounce), rcy = gy + sth * dB - cth * (R + bounce);
    const roll = (wx + dB) / R, cr = Math.cos(roll), sr = Math.sin(roll);
    // the gallop loops; in the air it freezes and follows the pointer and the strip
    const freeze = s4 > 0.15;
    let f = step % NF;
    st.wantFrame = null;
    if (freeze) {
      const ptr = inp.ptr;
      if (ptr && !inp.manual && !inp.reduce && ptr.y < H - 120) st.wantFrame = Math.max(0, Math.min(NF - 1, Math.floor((ptr.x / W) * NF)));
      f = st.wantFrame ?? inp.selected ?? gallop.flight;
    }
    const threadTravel = s1 * 330;
    let cams = 0;
    for (let ti = 0; ti < 12; ti++) if (ax + 50 + ti * 22 - threadTravel <= ax + chest) cams++;
    st.cams = cams; st.frame = f; st.s4 = s4;
    const echoAmt = zoom, hoof = gallop.hoof;

    for (let r = 0; r < GR; r++) {
      for (let c = 0; c < GC; c++) {
        const idx = r * GC + c, thr = THR[idx];
        let bg = PAPER, fg = EMPTY, msk = M08;
        if (wallVis > thr) {
          const yx = c - (118 - wx * 0.2), yy = r - 26;
          if (yearPix(Math.round(yx), yy)) { fg = WALL; msk = mi(2.4); }
          const wcol = c + wx * 0.5, seg = Math.floor(wcol / 16), inSeg = wcol - seg * 16;
          if (r > 34 && r < gy && inSeg < 1 && r & 1) { fg = EMPTY; msk = mi(1.3); }
          if (numPix((((seg % 40) + 40) % 40) + 1, Math.floor(inSeg) - 2, r - 36)) { fg = WALL; msk = mi(1.6); }
        }
        if (hillVis > thr) {
          const hf = 70 + 7 * Math.sin((c + wx * 0.15) * 0.035) + 4 * Math.sin((c + wx * 0.15) * 0.09 + 2);
          const hm = 96 + 8 * Math.sin((c + wx * 0.4) * 0.05 + 1) + 3 * Math.sin((c + wx * 0.4) * 0.13);
          if (r > hm) { fg = HILL_MID; msk = r - hm < 1.2 ? mi(2.2) : (c + r) & 1 ? mi(1.1) : M08; if (r - hm >= 1.2 && !((c + r) & 1)) fg = EMPTY; }
          else if (r > hf) { fg = r - hf < 1.2 ? WALL : EMPTY; msk = r - hf < 1.2 ? mi(1.9) : mi(1.0); }
        }
        const dxc = c - ax, dyc = r - gy;
        const u = dxc * cth + dyc * sth, hgt = dxc * sth - dyc * cth;
        const gH = u <= P ? 0 : -(u - P) * 0.9;
        if (groundVis > thr && hgt < gH) { const depth = gH - hgt; bg = PAPER; fg = INK; msk = depth < 1 ? mi(2.2) : mi(Math.max(0.5, 1.5 - depth * 0.05)); }
        // twelve threads: each one snaps when the chest passes and flashes
        if (s2 < 0.3 && groundVis > 0) {
          for (let ti = 0; ti < 12; ti++) {
            const tc = Math.round(ax + 50 + ti * 22 - threadTravel - s2 * 260);
            if (c !== tc) continue;
            const broken = tc <= ax + chest, top = 30;
            if (r < top || r >= gy) break;
            if (!broken) { fg = INK; msk = mi(1.9); }
            else {
              const since = ax + chest - tc;
              if (since < 14 && thr > since / 14) { fg = ELEC; msk = mi(2.6); }
              else if (r < top + 4 || r > gy - 3) { fg = INK; msk = mi(1.9); }
            }
            break;
          }
        }
        // the rock: a dithered sphere that rolls
        if (rockVis) {
          const rdx = c + 0.5 - rcx, rdy = r + 0.5 - rcy, rd2 = rdx * rdx + rdy * rdy;
          if (rd2 < R * R) {
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
        const X = 150 + hu * sh, Y = hoof - (hh - lift) * sh;
        const val = horse(f, X, Y);
        if (val) { fg = HORSE; msk = mi(0.4 + 2.6 * (0.5 + (0.5 * (val - 120)) / 135)); }
        else if (echoAmt > 0.05 && echoAmt > thr) {
          for (let e = 1; e <= 3; e++) if (horse(f - e, X + e * 22, Y)) { fg = ECHO; msk = mi(2.0 - e * 0.35); break; }
        }
        put(r, c, bg, fg, msk);
      }
    }
  }

  const state: IntroState = { cams: 0, frame: 0, s4: 0, q: 0, pv: 0, wantFrame: null };
  return {
    state,
    isFalling: (now: number) => fallT0 !== null && now - fallT0 < 1800,
    hasParallax: () => Math.abs(parx) > 0.05,
    draw(inp: IntroInput, mode = 1) {
      const pv = clamp(inp.progress / VOID), q = clamp((inp.progress - VOID) / STORY);
      state.pv = pv; state.q = q;
      if (q > 0) drawStory(inp, q, state); else drawVoid(inp, pv, mode);
      ctx.putImageData(img, 0, 0);
      return state;
    },
  };
}
