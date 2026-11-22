/**
 * Travesía ácida: the landing's void with no bottom. Nested squares turn,
 * the zoom never ends, and every twelve layers the acid changes (the change is
 * dithered over three layers). Scroll moves you through it; it also drifts on
 * its own. Drawn in the dot grid: one disc per cell on the night ink.
 */
import { BAYER } from './dither';
import { travesia as T, type TravesiaRamp } from './tokens';

const PER = 12, L = 22, QQ = 0.84;
const IDS = Object.keys(T.ramps) as TravesiaRamp[];
const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const u32 = (c: number[]) => (0xff000000 | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0;
const COLS = IDS.map((id) => T.ramps[id].map((h) => u32(hex(h))));
const INK = u32(hex(T.ink)), CORE = u32(hex(T.core));

export type TravesiaState = { cell: number; ramp: TravesiaRamp | 'todos'; base: number; reduce: boolean };

export function createTravesia(cv: HTMLCanvasElement, initialDepth = 0) {
  const buf = document.createElement('canvas'), bx = buf.getContext('2d', { willReadFrequently: true })!;
  const ctx = cv.getContext('2d')!;
  let depth = initialDepth, speed = 0, boost = 0, px = 0.5, py = 0.5, last = performance.now();
  let img: ImageData | null = null, pix: Uint32Array | null = null, masks: Record<string, Uint8Array> = {}, maskCell = 0;

  const rampAt = (a: number, bay: number, fixed: number) => {
    if (fixed >= 0) return fixed;
    let i = Math.floor(a / PER);
    const within = a % PER;
    if (within >= PER - 3 && bay < (within - (PER - 4)) / 4) i++;
    return i % IDS.length;
  };

  return {
    /** Scroll or swipe: positive goes deeper. */
    push(d: number) { depth = Math.max(0, depth + d); boost = Math.max(-1.5, Math.min(6, boost + d * 0.5)); },
    get depth() { return depth; },
    frame(now: number, s: TravesiaState, ptr: [number, number] | null) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const CS = s.cell, w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return null;
      const GC = Math.ceil(w / CS), GR = Math.ceil(h / CS);
      if (cv.width !== GC * CS || cv.height !== GR * CS || maskCell !== CS) { cv.width = GC * CS; cv.height = GR * CS; img = null; masks = {}; maskCell = CS; }
      if (buf.width !== GC || buf.height !== GR) { buf.width = GC; buf.height = GR; }
      boost *= Math.pow(0.25, dt);
      const target = s.reduce ? 0 : s.base * (1 + boost);
      speed += (target - speed) * Math.min(1, dt * 4);
      depth = Math.max(0, depth + speed * dt);
      const tx = ptr && !s.reduce ? ptr[0] : 0.5, ty = ptr && !s.reduce ? ptr[1] : 0.5;
      px += (tx - px) * Math.min(1, dt * 3); py += (ty - py) * Math.min(1, dt * 3);
      const cx = GC / 2 + (px - 0.5) * GC * 0.35, cy = GR / 2 + (py - 0.5) * GR * 0.35;
      // the tunnel in a small layer: red = layer number, green = light
      const n0 = Math.floor(depth), fr = depth - n0, S0 = Math.hypot(GC, GR) * 1.5, t = now / 1000;
      bx.setTransform(1, 0, 0, 1, 0, 0); bx.fillStyle = `rgb(${n0 % 250},40,0)`; bx.fillRect(0, 0, GC, GR);
      for (let k = 0; k <= L; k++) {
        const a = n0 + k, sz = S0 * Math.pow(QQ, k - fr);
        if (sz < 1.2) break;
        bx.setTransform(1, 0, 0, 1, cx, cy); bx.rotate(a * 0.085 + (s.reduce ? 0 : t * 0.04));
        const bright = a % 2 === 0, R = a % 250;
        if (k === L) bx.fillStyle = 'rgb(255,255,0)';
        else { const gr = bx.createLinearGradient(-sz / 2, -sz / 2, sz / 2, sz / 2); gr.addColorStop(0, `rgb(${R},${bright ? 235 : 70},0)`); gr.addColorStop(1, `rgb(${R},${bright ? 120 : 10},0)`); bx.fillStyle = gr; }
        bx.fillRect(-sz / 2, -sz / 2, sz, sz);
      }
      const tone = bx.getImageData(0, 0, GC, GR).data;
      if (!img) { img = ctx.createImageData(cv.width, cv.height); pix = new Uint32Array(img.data.buffer); }
      const W = cv.width, px32 = pix!;
      const mask = (rr: number) => { const key = rr.toFixed(1); let m = masks[key]; if (!m) { m = new Uint8Array(CS * CS); for (let j = 0; j < CS; j++) for (let i = 0; i < CS; i++) { const dx = i + 0.5 - CS / 2, dy = j + 0.5 - CS / 2; m[j * CS + i] = dx * dx + dy * dy <= rr * rr ? 1 : 0; } masks[key] = m; } return m; };
      const fixed = s.ramp === 'todos' ? -1 : IDS.indexOf(s.ramp);
      for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) {
        const id = (r * GC + c) * 4, R0 = tone[id], G0 = tone[id + 1], bay = (BAYER[(r & 3) * 4 + (c & 3)] + 0.5) / 16;
        let fg: number, rad: number;
        if (R0 === 255 && G0 === 255) { fg = CORE; rad = CS * 0.5; }
        else {
          let a = n0 - (n0 % 250) + R0; if (a < n0 - 2) a += 250;
          const li = Math.max(0, Math.min(3, Math.round((G0 / 255) * 3 + bay - 0.5)));
          fg = COLS[rampAt(a, bay, fixed)][li]; rad = CS * (0.18 + li * 0.1);
        }
        const m = mask(rad), o = r * CS * W + c * CS;
        for (let jj = 0; jj < CS; jj++) { const row = o + jj * W, mr = jj * CS; for (let ii = 0; ii < CS; ii++) px32[row + ii] = m[mr + ii] ? fg : INK; }
      }
      ctx.putImageData(img, 0, 0);
      return { depth: n0, ramp: IDS[rampAt(n0 + 6, 0.5, fixed)], speed: s.base ? speed / s.base : 0 };
    },
  };
}
