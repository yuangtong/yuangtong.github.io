'use client';

import { useEffect, useRef, useState } from 'react';
import type { CamaraPage } from '@/content/types';
import { camaraInks, camaraProcess, camaraRetro, color, corkGrid, type CamaraInk } from '@/lib/tokens';

const CELL = 2;   // fine cells: 2 px, so the effects read the face (owner, 2026-11-27)
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const RAMP = ' .:-=+*#%@';
const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
type Effect = 'pixels' | 'dither' | 'halftone' | 'ascii' | 'stitch';
const FX: Effect[] = ['pixels', 'dither', 'halftone', 'ascii', 'stitch'];
/** A stroke made without the image (the cursor, no camera): plain ink, it stays. */
const INKED = 255;
const WINDOW = 3;                                   // effects shown at once; the arrows move the row
const INKS = Object.keys(camaraInks) as CamaraInk[];
type Ink = CamaraInk | 'multi';
const MULTI = INKS.length;                          // the multicolour ink's index in a cell
const BRUSH = { small: 10, medium: 20, large: 36 }; // radius in px
type Brush = keyof typeof BRUSH;
const DETAILS = ['fine', 'medium', 'coarse'] as const;
type Detail = (typeof DETAILS)[number];
/** Each effect's grain per detail, in px (pixels and dither: in cells). */
// pixels are bigger than the rest, so they read as pixels and not as the image (owner, 2026-11-27)
const SIZE: Record<Effect, number[]> = { pixels: [3, 6, 10], dither: [1, 2, 4], halftone: [5, 8, 12], ascii: [6, 8, 12], stitch: [6, 8, 12] };
/** A stroke that comes back this close to where it started, after this long, closes a loop (px). */
const LOOP = { near: 44, length: 160 };
const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const RETRO = camaraRetro.map(rgb);
const INK_RGB = INKS.map((k) => rgb(camaraInks[k]));
const PAPER = rgb(corkGrid.paper);
/** The nearest colour of the retro palette, as an index. */
function nearest(r: number, g: number, b: number) {
  let best = 0, bd = 1e9;
  for (let i = 0; i < RETRO.length; i++) { const c = RETRO[i], d = (c[0] - r) ** 2 * 0.3 + (c[1] - g) ** 2 * 0.59 + (c[2] - b) ** 2 * 0.11; if (d < bd) { bd = d; best = i; } }
  return best;
}
/** Posterized, like an old game's textures: four levels per channel. */
const poster = (v: number) => Math.round(v / 85) * 85;
type Mode = 'draw' | 'toy';
type Source = 'idle' | 'loading' | 'hand' | 'camera' | 'cursor';
type Pt = { x: number; y: number };
type HL = { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: { x: number; y: number }[][] }; setOptions: (o: { numHands: number }) => Promise<void>; close: () => void };

/**
 * cámara (canvas "lab: cámara v2", approved 2026-11-27). A webcam toy. The
 * gate asks for the camera; once it is on, the controls slide in as a column
 * on the left and the camera takes the rest, with the photo button under it;
 * "full screen" gives the camera the whole page and folds the controls into a
 * card. Two modes. Draw, the default on a computer: MediaPipe's hand
 * landmarker reads both hands in the browser, a pinch (landmarks 4 and
 * 8) puts the pen down and the index tip paints the chosen effect (pixels,
 * dither, halftone, ascii or cross-stitch); a stroke that closes a loop fills
 * what it circles, and a new stroke paints over the last. The space bar, or
 * the tracking switch, pauses the hands so a finished figure stays put.
 * Web toy, the only mode on phones: the whole image takes the effect, live,
 * with no tracking. Changing mode clears the image. Effects read every frame with an automatic exposure,
 * measured inside what is painted. The cursor without a camera keeps its
 * strokes in ink. Nothing is sent or kept: frames stay in
 * the browser.
 */
export function Camara({ page }: { page: CamaraPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Source>('idle');
  const [touch, setTouch] = useState(false);
  const [mode, setMode] = useState<Mode>('draw');
  const [track, setTrack] = useState(true);
  const [full, setFull] = useState(false);
  const [effect, setEffect] = useState<Effect>('pixels');
  const [at, setAt] = useState(0);
  const [ink, setInk] = useState<Ink>('signal');
  const [brush, setBrush] = useState<Brush>('medium');
  const [detail, setDetail] = useState<Detail>('medium');
  const [pen, setPen] = useState(false);
  const [note, setNote] = useState('');
  const [count, setCount] = useState(0);
  const [top, setTop] = useState(0);
  const st = useRef({
    source: 'idle' as Source, mode: 'draw' as Mode, effect: 'pixels' as Effect, ink: 'signal' as Ink, brush: 'medium' as Brush, detail: 'medium' as Detail,
    ptr: null as Pt | null, ptrDown: false, mouse: false, hands: [] as Pt[][], pens: [false, false], clear: false, clean: false,
  });
  const lm = useRef<HL | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const on = source === 'hand' || source === 'camera' || source === 'cursor';
  const image = source === 'camera' || source === 'hand';
  const toy = image && (mode === 'toy' || source === 'camera');
  Object.assign(st.current, { source, mode: toy ? 'toy' : 'draw', effect, ink, brush, detail });

  // phones: the camera without tracking, as a web toy (owner, 2026-11-27)
  useEffect(() => { setTouch(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches); }, []);

  // drawing: the image, the painted effects and the hands
  useEffect(() => {
    const root = rootRef.current, cv = cvRef.current, video = videoRef.current; if (!root || !cv || !video) return;
    setTop(root.getBoundingClientRect().top + window.scrollY);
    const ctx = cv.getContext('2d')!;
    const sc = document.createElement('canvas'), sx = sc.getContext('2d', { willReadFrequently: true })!;
    const oc = document.createElement('canvas'), ox = oc.getContext('2d')!;
    const mono = getComputedStyle(cv).fontFamily;
    let GW = 0, GH = 0, paint = new Float32Array(0), seed = new Uint8Array(0), fxc = new Uint8Array(0), ikc = new Uint8Array(0), dtc = new Uint8Array(0), od: ImageData | null = null;
    let step = -1, raf = 0, lo = 0, hi = 255;
    const last: (Pt | null)[] = [null, null, null], lastPen = [false, false, false], strokes: Pt[][] = [[], [], []];
    // the stage changes size (side panel, full screen): what is painted stays, centred
    const fit = () => {
      const w = Math.ceil(cv.clientWidth / CELL), h = Math.ceil(cv.clientHeight / CELL); if (!w || !h || (w === GW && h === GH)) return;
      const n = w * h, np = new Float32Array(n).fill(-1), ns = new Uint8Array(n), nf = new Uint8Array(n), ni = new Uint8Array(n), nd = new Uint8Array(n);
      const dx = ((w - GW) / 2) | 0, dy = ((h - GH) / 2) | 0;
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const a = y * GW + x, b = Y * w + X; np[b] = paint[a]; ns[b] = seed[a]; nf[b] = fxc[a]; ni[b] = ikc[a]; nd[b] = dtc[a];
      }
      GW = w; GH = h; paint = np; seed = ns; fxc = nf; ikc = ni; dtc = nd;
      cv.width = GW * CELL; cv.height = GH * CELL; sc.width = oc.width = GW; sc.height = oc.height = GH; od = ox.createImageData(GW, GH);
    };
    const now0 = (S: typeof st.current) => {
      const img = S.source === 'camera' || S.source === 'hand';
      return { f: img ? FX.indexOf(S.effect) : INKED, k: S.ink === 'multi' ? MULTI : INKS.indexOf(S.ink), d: DETAILS.indexOf(S.detail), thin: !img };
    };
    const set = (id: number, f: number, k: number, d: number, now: number) => { paint[id] = now; seed[id] = (Math.random() * 255) | 0; fxc[id] = f; ikc[id] = k; dtc[id] = d; };
    // every stroke keeps its own effect, ink, brush and grain; a new one paints over the last
    const mark = (a: Pt, b: Pt, now: number) => {
      const S = st.current, { f, k, d, thin } = now0(S);
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 3)), r = Math.round((thin ? BRUSH[S.brush] / 2 : BRUSH[S.brush]) / CELL);
      for (let i = 0; i <= n; i++) {
        const x = a.x + ((b.x - a.x) * i) / n, y = a.y + ((b.y - a.y) * i) / n;
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r + 1) continue;
          const cx = Math.floor(x / CELL) + dx, cy = Math.floor(y / CELL) + dy; if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) continue;
          set(cy * GW + cx, f, k, d, now);
        }
      }
    };
    // a stroke that closes on itself fills what it circles
    const fillLoop = (pts: Pt[], now: number) => {
      const { f, k, d } = now0(st.current), path = new Path2D();
      path.moveTo(pts[0].x, pts[0].y); for (const p of pts) path.lineTo(p.x, p.y); path.closePath();
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let y = Math.max(0, Math.floor(y0 / CELL)); y <= Math.min(GH - 1, y1 / CELL); y++) for (let x = Math.max(0, Math.floor(x0 / CELL)); x <= Math.min(GW - 1, x1 / CELL); x++)
        if (ctx.isPointInPath(path, x * CELL + 1, y * CELL + 1)) set(y * GW + x, f, k, d, now);
    };
    const closes = (pts: Pt[]) => {
      if (pts.length < 12) return false;
      let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      const a = pts[0], b = pts[pts.length - 1]; return len > LOOP.length && Math.hypot(a.x - b.x, a.y - b.y) < LOOP.near;
    };
    const fillAll = (now: number) => { const { f, k, d } = now0(st.current); for (let id = 0; id < GW * GH; id++) set(id, f, k, d, now); };
    // the video covers the stage, mirrored
    const cover = (c: CanvasRenderingContext2D, W: number, H: number) => {
      const vw = video.videoWidth || 640, vh = video.videoHeight || 480, s = Math.max(W / vw, H / vh);
      c.save(); c.translate(W, 0); c.scale(-1, 1); c.drawImage(video, (W - vw * s) / 2, (H - vh * s) / 2, vw * s, vh * s); c.restore();
    };
    const inkOf = (k: number, sd: number) => (k === MULTI ? RETRO[3 + (sd % 12)] : INK_RGB[k]);
    const css = (c: number[], a = 1) => (a === 1 ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})` : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const S = st.current, img = (S.source === 'camera' || S.source === 'hand') && video.readyState >= 2;
      const fps = img ? 24 : 12, s = Math.floor(now / (1000 / fps)); if (s === step) return; step = s;
      fit(); if (!GW) return;
      if (S.clear) { paint.fill(-1); S.clear = false; }
      const inkHex = S.ink === 'multi' ? color.signal : camaraInks[S.ink];
      if (S.mode === 'toy') { if (img) fillAll(now); }
      else {
        // pens: each hand, and the pointer alongside
        const tips: (Pt | null)[] = [], downs: boolean[] = [];
        for (let h = 0; h < 2; h++) { tips.push(S.source === 'hand' ? S.hands[h]?.[8] ?? null : null); downs.push(S.source === 'hand' && !!S.hands[h] && S.pens[h]); }
        tips.push(S.ptr); downs.push(S.source === 'hand' ? S.mouse : S.ptrDown);
        tips.forEach((tip, h) => {
          if (downs[h] && tip) {
            mark(last[h] && lastPen[h] ? last[h]! : tip, tip, now);
            strokes[h].push({ ...tip });
            if (closes(strokes[h])) { fillLoop(strokes[h], now); strokes[h] = [{ ...tip }]; }
          } else strokes[h] = [];
          last[h] = tip; lastPen[h] = downs[h];
        });
      }

      // the base: you, or the paper
      let px: Uint8ClampedArray | null = null;
      if (img) { cover(ctx, cv.width, cv.height); cover(sx, GW, GH); px = sx.getImageData(0, 0, GW, GH).data; }
      else {
        ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = corkGrid.dot; for (let y = 4; y < cv.height; y += 8) for (let x = 4; x < cv.width; x += 8) if ((((x + y) / 8) & 1) === 0) ctx.fillRect(x - 1, y - 1, 2, 2);
      }

      // automatic exposure: the lights and shadows inside what is painted, so the effects always draw the face
      if (px) {
        const hist = new Uint32Array(256); let n = 0;
        for (let id = 0; id < GW * GH; id += 3) if (paint[id] >= 0) { const o = id * 4; hist[(px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) | 0]++; n++; }
        if (n < 300) { hist.fill(0); n = 0; for (let id = 0; id < GW * GH; id += 7) { const o = id * 4; hist[(px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) | 0]++; n++; } }
        let a = 0, l = 0, h = 255; for (let v = 0; v < 256; v++) { a += hist[v]; if (a >= n * 0.03) { l = v; break; } }
        a = 0; for (let v = 255; v >= 0; v--) { a += hist[v]; if (a >= n * 0.03) { h = v; break; } }
        if (h - l < 40) { const m = (h + l) / 2; l = m - 20; h = m + 20; }
        lo += (l - lo) * 0.25; hi += (h - hi) * 0.25;
      }
      const span = 255 / Math.max(1, hi - lo);
      const lift = (v: number) => Math.max(0, Math.min(255, (v - lo) * span));
      const sample = (o: number) => [lift(px![o]), lift(px![o + 1]), lift(px![o + 2])];
      const lum = (c: number[]) => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
      // the colour around a point, in px, averaged over its grain
      const around = (X: number, Y: number, g: number) => {
        const c = [0, 0, 0], q = g / 4;
        for (const [dx, dy] of [[-q, -q], [q, -q], [-q, q], [q, q]]) {
          const x = Math.min(GW - 1, Math.max(0, ((X + dx) / CELL) | 0)), y = Math.min(GH - 1, Math.max(0, ((Y + dy) / CELL) | 0)), o = (y * GW + x) * 4;
          c[0] += px![o] / 4; c[1] += px![o + 1] / 4; c[2] += px![o + 2] / 4;
        }
        return [lift(c[0]), lift(c[1]), lift(c[2])];
      };

      // the painted cells, at the cells' own resolution
      const D = od!.data; D.fill(0);
      const combos = new Set<number>(); let bx0 = GW, by0 = GH, bx1 = -1, by1 = -1;
      const put = (id: number, c: number[], a = 255) => { const o = id * 4; D[o] = c[0]; D[o + 1] = c[1]; D[o + 2] = c[2]; D[o + 3] = a; };
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const id = y * GW + x; if (paint[id] < 0) continue;
        const fx = FX[fxc[id]], k = ikc[id], multi = k === MULTI, dd = dtc[id];
        // strokes made without the image (the cursor, no camera) stay, in their ink (owner, 2026-11-27)
        if (!px || fxc[id] === INKED) { put(id, inkOf(k, seed[id])); continue; }
        if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
        if (fx === 'pixels' || fx === 'dither') {
          // the cell's block: its colour is read once, at the block's centre
          const bl = SIZE[fx][dd], bx = x - (x % bl), by = y - (y % bl), o = (Math.min(GH - 1, by + (bl >> 1)) * GW + Math.min(GW - 1, bx + (bl >> 1))) * 4, c = sample(o);
          const bq = BAY[((by / bl) & 3) * 4 + ((bx / bl) & 3)];
          if (fx === 'pixels') put(id, multi ? c.map(poster) : c.map((v, i) => v * 0.75 + INK_RGB[k][i] * 0.25));
          else if (multi) { const dz = ((bq + 0.5) / 16 - 0.5) * 72; put(id, RETRO[nearest(c[0] + dz, c[1] + dz, c[2] + dz)]); }   // ordered dither into the retro palette
          else put(id, (1 - lum(c)) * 16 > bq + 0.5 ? INK_RGB[k] : PAPER);
          continue;
        }
        put(id, PAPER); combos.add(fxc[id] * 4 + dd);
      }
      ox.putImageData(od!, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(oc, 0, 0, cv.width, cv.height);

      // the drawn effects: halftone dots, ascii, cross-stitches, over the paper
      const owner = (X: number, Y: number, f: number, d: number) => {
        const x = (X / CELL) | 0, y = (Y / CELL) | 0; if (x < 0 || y < 0 || x >= GW || y >= GH) return -1;
        const id = y * GW + x; return paint[id] >= 0 && fxc[id] === f && dtc[id] === d ? id : -1;
      };
      const X0 = bx0 * CELL, Y0 = by0 * CELL, X1 = (bx1 + 1) * CELL, Y1 = (by1 + 1) * CELL;
      for (const cb of combos) {
        const f = cb >> 2, d = cb & 3, fx = FX[f], g = SIZE[fx][d];
        if (fx === 'halftone') {
          // each ink on its own screen angle; multicolour prints four process screens
          const screens: [number, number][] = [[45, -1], [15, 0], [75, 1], [0, 2], [45, 3]];
          for (const [deg, ch] of screens) {
            const A = (deg * Math.PI) / 180, ca = Math.cos(A), sa = Math.sin(A), R = Math.hypot(X1 - X0, Y1 - Y0), cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2;
            const dots = new Map<string, Path2D>();
            for (let j = -R; j <= R; j += g) for (let i = -R; i <= R; i += g) {
              const X = cx + i * ca - j * sa, Y = cy + i * sa + j * ca; if (X < X0 || Y < Y0 || X >= X1 || Y >= Y1) continue;
              const id = owner(X, Y, f, d); if (id < 0) continue;
              const multi = ikc[id] === MULTI; if (multi !== ch >= 0) continue;
              const c = around(X, Y, g); let cov: number;
              if (!multi) cov = 1 - lum(c);
              else {
                const r = c[0] / 255, gg = c[1] / 255, b = c[2] / 255, kk = 1 - Math.max(r, gg, b);
                cov = ch === 3 ? kk : kk >= 1 ? 0 : (1 - [r, gg, b][ch] - kk) / (1 - kk);
              }
              if (cov < 0.04) continue;
              const key = multi ? ['c', 'm', 'y', 'k'][ch] : String(ikc[id]), rr = (g / 2) * Math.sqrt(cov) * 1.2;
              let p = dots.get(key); if (!p) { p = new Path2D(); dots.set(key, p); }
              p.moveTo(X + rr, Y); p.arc(X, Y, rr, 0, 6.2832);
            }
            if (ch >= 0) ctx.globalCompositeOperation = 'multiply';
            dots.forEach((p, key) => { ctx.fillStyle = ch >= 0 ? camaraProcess[key as keyof typeof camaraProcess] : camaraInks[INKS[+key]]; ctx.fill(p); });
            ctx.globalCompositeOperation = 'source-over';
          }
        } else if (fx === 'ascii') {
          const w = Math.round(g * 0.62); ctx.font = `500 ${g}px ${mono}`; ctx.textBaseline = 'top';
          for (let Y = Y0 - (Y0 % g); Y < Y1; Y += g) for (let X = X0 - (X0 % w); X < X1; X += w) {
            const id = owner(X + w / 2, Y + g / 2, f, d); if (id < 0) continue;
            const c = around(X + w / 2, Y + g / 2, g), ch = RAMP[Math.min(RAMP.length - 1, Math.floor((1 - lum(c)) * RAMP.length))]; if (ch === ' ') continue;
            ctx.fillStyle = ikc[id] === MULTI ? css(c.map(poster)) : camaraInks[INKS[ikc[id]]]; ctx.fillText(ch, X, Y);
          }
        } else if (fx === 'stitch') {
          // cross-stitch: one thread per square, two crossed strokes
          const threads = new Map<string, Path2D>(), pad = g * 0.16;
          for (let Y = Y0 - (Y0 % g); Y < Y1; Y += g) for (let X = X0 - (X0 % g); X < X1; X += g) {
            const id = owner(X + g / 2, Y + g / 2, f, d); if (id < 0) continue;
            const c = around(X + g / 2, Y + g / 2, g), dark = 1 - lum(c); let key: string;
            if (ikc[id] === MULTI) { const n = nearest(c[0], c[1], c[2]); if (n === 1 || n === 2) continue; key = camaraRetro[n]; }
            else { if (dark < 0.14) continue; key = css(INK_RGB[ikc[id]], dark > 0.5 ? 1 : 0.45); }
            let p = threads.get(key); if (!p) { p = new Path2D(); threads.set(key, p); }
            p.moveTo(X + pad, Y + pad); p.lineTo(X + g - pad, Y + g - pad); p.moveTo(X + g - pad, Y + pad); p.lineTo(X + pad, Y + g - pad);
          }
          ctx.lineWidth = Math.max(1.5, g * 0.24); ctx.lineCap = 'round';
          threads.forEach((p, key) => { ctx.strokeStyle = key; ctx.stroke(p); });
        }
      }

      // the hands' points (left out of the photo)
      if (!S.clean) {
        if (S.source === 'hand') for (let h = 0; h < S.hands.length; h++) {
          const H = S.hands[h];
          ctx.strokeStyle = img ? corkGrid.paper : color.quiet; ctx.lineWidth = 1;
          for (const [a, c] of BONES) { ctx.beginPath(); ctx.moveTo(H[a].x, H[a].y); ctx.lineTo(H[c].x, H[c].y); ctx.stroke(); }
          H.forEach((p, i) => { const on = i === 4 || i === 8, z = on ? 8 : 4; ctx.fillStyle = on && S.pens[h] ? inkHex : img ? corkGrid.paper : color.ink; ctx.fillRect(p.x - z / 2, p.y - z / 2, z, z); });
        }
        if (S.mode === 'draw' && S.ptr && (S.source === 'cursor' || S.mouse)) { ctx.strokeStyle = S.ptrDown || S.mouse ? inkHex : color.ink; ctx.lineWidth = 1; ctx.strokeRect(S.ptr.x - 7.5, S.ptr.y - 7.5, 15, 15); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // the hands: one detection per new video frame, only while drawing and not paused (owner, 2026-11-27)
  const tracking = source === 'hand' && mode === 'draw' && track;
  useEffect(() => {
    if (!tracking) { st.current.hands = []; st.current.pens = [false, false]; if (st.current.ptrDown) { st.current.ptrDown = false; setPen(false); } return; }
    const video = videoRef.current, cv = cvRef.current; if (!video || !cv) return;
    let raf = 0, lastT = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const L = lm.current; if (!L || document.hidden || video.readyState < 2 || video.currentTime === lastT) return;
      lastT = video.currentTime;
      const found = L.detectForVideo(video, performance.now()).landmarks;
      const W = cv.clientWidth, H = cv.clientHeight, vw = video.videoWidth || 640, vh = video.videoHeight || 480, k = Math.max(W / vw, H / vh), ox = (W - vw * k) / 2, oy = (H - vh * k) / 2;
      const hands = found.slice(0, 2).map((hand) => hand.map((p) => ({ x: W - (ox + p.x * vw * k), y: oy + p.y * vh * k })));
      const pens = hands.map((pts, h) => {
        // the pinch, in proportion to the hand, with some slack so the pen does not flicker
        const size = Math.hypot(pts[0].x - pts[9].x, pts[0].y - pts[9].y) || 1, gap = Math.hypot(pts[4].x - pts[8].x, pts[4].y - pts[8].y) / size;
        return st.current.pens[h] ? gap < 0.45 : gap < 0.3;
      });
      st.current.hands = hands; st.current.pens = [pens[0] ?? false, pens[1] ?? false];
      const any = st.current.pens[0] || st.current.pens[1]; if (any !== st.current.ptrDown) { st.current.ptrDown = any; setPen(any); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tracking]);

  // the space bar pauses and resumes the hands
  useEffect(() => {
    if (source !== 'hand' || mode !== 'draw') return;
    const key = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat || (e.target as HTMLElement)?.closest?.('button, input, textarea')) return;
      e.preventDefault(); setTrack((t) => !t);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [source, mode]);

  useEffect(() => () => { stream.current?.getTracks().forEach((t) => t.stop()); lm.current?.close(); }, []);

  // the photo: 3, 2, 1, a clean frame, and it downloads
  useEffect(() => {
    if (!count) return;
    const id = setTimeout(() => {
      if (count > 1) { setCount(count - 1); return; }
      st.current.clean = true;
      setTimeout(() => {
        cvRef.current?.toBlob((b) => {
          st.current.clean = false; setCount(0); if (!b) return;
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `camara-${Date.now()}.png`;
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); setNote(page.saved);
        }, 'image/png');
      }, 120);
    }, 1000);
    return () => clearTimeout(id);
  }, [count, page.saved]);

  // with tracking on a computer; on a phone the camera alone, as a web toy (owner, 2026-11-27)
  const startCamera = async (track = !touch) => {
    if (!navigator.mediaDevices?.getUserMedia) { setNote(page.noCamera); setSource('cursor'); return; }
    setSource('loading'); setNote(page.loading);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      stream.current = s;
      const v = videoRef.current!; v.srcObject = s; await v.play();
      if (track && !lm.current) {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks('/lab/camara/wasm');
        const make = (delegate: 'GPU' | 'CPU') => HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: '/lab/camara/hand_landmarker.task', delegate }, runningMode: 'VIDEO', numHands: 2 });   // both hands, always (owner, 2026-11-27)
        lm.current = (await make('GPU').catch(() => make('CPU'))) as unknown as HL;
      }
      setNote(''); st.current.clear = true; setMode(track ? 'draw' : 'toy'); setSource(track ? 'hand' : 'camera');
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
      setNote((e as DOMException)?.name === 'NotAllowedError' ? page.denied : page.noCamera); setSource('cursor');
    }
  };
  const useCursor = () => {
    stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
    st.current.hands = []; st.current.pens = [false, false]; st.current.ptrDown = false; st.current.clear = true; setPen(false); setNote(''); setMode('draw'); setSource('cursor');
  };
  const local = (e: React.PointerEvent): Pt => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  // changing mode starts over: a clean image, the hands followed again
  const switchMode = (m: Mode) => { if (m === mode) return; st.current.clear = true; setMode(m); setTrack(true); };
  const shown = Array.from({ length: WINDOW }, (_, i) => FX[(at + i) % FX.length]);
  const drawing = !toy;

  return (
    <section ref={rootRef} className="camara" data-on={on} data-full={full} aria-label={page.title} style={{ '--camara-top': `${top}px` } as React.CSSProperties}>
      <div className="camara__stage">
        <canvas
          ref={cvRef} className="camara__cv" data-draw={drawing && on} role="img" aria-label={toy ? page.canvasToy : image ? page.canvasMirror : page.canvasCursor}
          onPointerDown={(e) => {
            if (!drawing || (source !== 'cursor' && source !== 'hand')) return;
            st.current.ptr = local(e);
            if (source === 'hand') st.current.mouse = true; else { st.current.ptrDown = true; setPen(true); }
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => { st.current.ptr = local(e); }}
          onPointerUp={() => { st.current.mouse = false; if (source !== 'cursor') return; st.current.ptrDown = false; setPen(false); }}
        />
        <video ref={videoRef} className="camara__video" playsInline muted aria-hidden="true" />
        {on && (
          <div className="camara__state" aria-live="polite">
            <span className="label">{toy ? page.sourceToy : source === 'hand' ? (track ? page.sourceHand : page.track.paused) : page.sourceCursor}</span>
            {drawing && <span className="label" data-on={pen}>{pen ? page.penDown : page.penUp}</span>}
          </div>
        )}
        {count > 0 && <p className="camara__count" aria-live="assertive">{count}</p>}
      </div>

      <div className="camara__gate" role="dialog" aria-label={page.gate.title} inert={on} data-hidden={on}>
        <h1 className="camara__gate-title">{page.gate.title}</h1>
        <p className="camara__gate-text">{page.gate.text}</p>
        {touch && <p className="camara__gate-text">{page.gate.touch}</p>}
        {note && !on && <p className="label camara__note" role="status">{note}</p>}
        <div className="camara__actions">
          <button type="button" className="btn btn--signal btn--sm" onClick={() => startCamera()} disabled={source === 'loading'}>{source === 'loading' ? page.loading : page.gate.camera} <span aria-hidden="true">→</span></button>
          {!touch && <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.gate.cursor}</button>}
        </div>
      </div>

      <aside className="camara__side" inert={!on} aria-label={page.controls}>
        <div className="camara__head">
          <h1 className="camara__title">{page.title}</h1>
          <p className="camara__lead">{toy ? page.leadToy : page.lead}</p>
        </div>
        {note && on && <p className="label camara__note" role="status">{note}</p>}
        {source === 'hand' && (
          <div role="group" aria-label={page.mode.label} className="camara__group">
            <span className="label">{page.mode.label}</span>
            <div className="camara__row">
              <button type="button" className="camara__seg" aria-pressed={mode === 'draw'} onClick={() => switchMode('draw')}>{page.mode.draw}</button>
              <button type="button" className="camara__seg" aria-pressed={mode === 'toy'} onClick={() => switchMode('toy')}>{page.mode.toy}</button>
            </div>
          </div>
        )}
        {image && (
          <div role="group" aria-label={page.effect.label} className="camara__group">
            <span className="label">{page.effect.label} <span className="camara__at">{at + 1}–{((at + WINDOW - 1) % FX.length) + 1} / {FX.length}</span></span>
            <div className="camara__row">
              <button type="button" className="camara__arrow" aria-label={page.effect.back} onClick={() => setAt((at - 1 + FX.length) % FX.length)}>←</button>
              <div className="camara__strip">
                {shown.map((f) => <button key={f} type="button" className="camara__seg" aria-pressed={effect === f} onClick={() => setEffect(f)}>{page.effect[f]}</button>)}
              </div>
              <button type="button" className="camara__arrow" aria-label={page.effect.more} onClick={() => setAt((at + 1) % FX.length)}>→</button>
            </div>
          </div>
        )}
        {source === 'hand' && drawing && (
          <div role="group" aria-label={page.track.label} className="camara__group">
            <span className="label">{page.track.label} <span className="camara__at">{page.track.key}</span></span>
            <div className="camara__row">
              <button type="button" className="camara__seg" aria-pressed={track} onClick={() => setTrack(true)}>{page.track.on}</button>
              <button type="button" className="camara__seg" aria-pressed={!track} onClick={() => setTrack(false)}>{page.track.off}</button>
            </div>
          </div>
        )}
        {drawing && (
          <div role="group" aria-label={page.brush.label} className="camara__group">
            <span className="label">{page.brush.label}</span>
            <div className="camara__row">
              {(Object.keys(BRUSH) as Brush[]).map((b) => <button key={b} type="button" className="camara__seg" aria-pressed={brush === b} onClick={() => setBrush(b)}>{page.brush[b]}</button>)}
            </div>
          </div>
        )}
        {image && (
          <div role="group" aria-label={page.pixel.label} className="camara__group">
            <span className="label">{page.pixel.label}</span>
            <div className="camara__row">
              {DETAILS.map((d) => <button key={d} type="button" className="camara__seg" aria-pressed={detail === d} onClick={() => setDetail(d)}>{page.pixel[d]}</button>)}
            </div>
          </div>
        )}
        <div role="group" aria-label={page.colour.label} className="camara__group">
          <span className="label">{page.colour.label}</span>
          <div className="camara__row camara__row--wrap">
            {INKS.map((k) => (
              <button key={k} type="button" className="camara__ink" aria-pressed={ink === k} aria-label={page.colour.names[k]} title={page.colour.names[k]} style={{ background: camaraInks[k] }} onClick={() => setInk(k)} />
            ))}
            <button type="button" className="camara__ink camara__ink--multi" aria-pressed={ink === 'multi'} aria-label={page.colour.names.multi} title={page.colour.names.multi} onClick={() => setInk('multi')} />
          </div>
        </div>
        <ol className="camara__how">
          {(toy ? page.howToy : page.how).map((h, i) => <li key={h}><span className="label">{String(i + 1).padStart(2, '0')}</span> {h}</li>)}
        </ol>
        <div className="camara__actions camara__actions--end">
          {drawing && <button type="button" className="btn btn--line btn--sm" onClick={() => { st.current.clear = true; }}>{page.clear}</button>}
          <button type="button" className="btn btn--line btn--sm camara__full" aria-pressed={full} onClick={() => setFull(!full)}>{full ? page.full.off : page.full.on}</button>
          {source === 'cursor'
            ? <button type="button" className="btn btn--line btn--sm" onClick={() => startCamera()}>{page.camera}</button>
            : <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.stop}</button>}
        </div>
      </aside>

      <button type="button" className="btn btn--signal btn--sm camara__shot" inert={!on} onClick={() => { setNote(''); setCount(3); }} disabled={count > 0}>{page.photo}</button>
    </section>
  );
}
