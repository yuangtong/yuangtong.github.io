'use client';

import { useEffect, useRef, useState } from 'react';
import type { CamaraPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { camaraInks, camaraProcess, camaraRetro, color, corkGrid, type CamaraInk } from '@/lib/tokens';

const CELL = 2;   // fine cells: 2 px, so the effects read the face (owner, 2026-11-27)
const HC = 5;     // the screened hand keeps its own, coarser unit
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const RAMP = ' .:-=+*#%@';
const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
const TRAIL = 3200;
type Effect = 'pixels' | 'dither' | 'halftone' | 'ascii' | 'stitch' | 'kana' | 'trail';
const FX: Effect[] = ['pixels', 'dither', 'halftone', 'ascii', 'stitch', 'kana', 'trail'];
/** Effects that need no image: they work with only the hand and with the cursor. */
const BARE: Effect[] = ['kana', 'trail'];
const INKS = Object.keys(camaraInks) as CamaraInk[];
type Ink = CamaraInk | 'multi';
const MULTI = INKS.length;                          // the multicolour ink's index in a cell
const BRUSH = { small: 10, medium: 20, large: 36 }; // radius in px
type Brush = keyof typeof BRUSH;
const DETAILS = ['fine', 'medium', 'coarse'] as const;
type Detail = (typeof DETAILS)[number];
/** Each effect's grain per detail, in px (pixels and dither: in cells). */
const SIZE: Record<Effect, number[]> = { pixels: [1, 2, 4], dither: [1, 2, 4], halftone: [5, 8, 12], ascii: [6, 8, 12], stitch: [6, 8, 12], kana: [10, 13, 18], trail: [1, 1, 1] };
const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const RETRO = camaraRetro.map(rgb);
const INK_RGB = INKS.map((k) => rgb(camaraInks[k]));
const PAPER = rgb(corkGrid.paper), INK0 = rgb(color.ink);
/** The nearest colour of the retro palette, as an index. */
function nearest(r: number, g: number, b: number) {
  let best = 0, bd = 1e9;
  for (let i = 0; i < RETRO.length; i++) { const c = RETRO[i], d = (c[0] - r) ** 2 * 0.3 + (c[1] - g) ** 2 * 0.59 + (c[2] - b) ** 2 * 0.11; if (d < bd) { bd = d; best = i; } }
  return best;
}
/** Posterized, like an old game's textures: four levels per channel. */
const poster = (v: number) => Math.round(v / 85) * 85;
type Source = 'idle' | 'loading' | 'hand' | 'camera' | 'cursor';
type Pt = { x: number; y: number };
type Shape = { path: Path2D; chars: { x: number; y: number; c: string }[]; ink: number; size: number };
type HL = { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: { x: number; y: number }[][] }; setOptions: (o: { numHands: number }) => Promise<void>; close: () => void };

/**
 * cámara (canvas "lab: cámara", 2026-11-26; owner's notes, 2026-11-27). A
 * webcam toy. The visitor turns the camera on and sees themselves, mirrored;
 * MediaPipe's hand landmarker reads one or two hands in the browser. A pinch
 * (landmarks 4 and 8) puts the pen down and the index tip paints the chosen
 * effect over the image: pixels, dither, halftone, ascii, cross-stitch, or the
 * glowing trail; kana draws a closed shape that fills with Japanese text. The
 * effects read every frame with an automatic exposure, measured inside what is
 * painted, so lights and shadows always draw the face. On phones the camera
 * turns on without tracking and a tap covers the whole image. The camera can
 * also show only the hand, and without a camera the cursor draws. Nothing is
 * sent or kept: frames stay in the browser.
 */
export function Camara({ page }: { page: CamaraPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Source>('idle');
  const [touch, setTouch] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [two, setTwo] = useState(false);
  const [effect, setEffect] = useState<Effect>('pixels');
  const [ink, setInk] = useState<Ink>('signal');
  const [brush, setBrush] = useState<Brush>('medium');
  const [detail, setDetail] = useState<Detail>('medium');
  const [pen, setPen] = useState(false);
  const [note, setNote] = useState('');
  const [count, setCount] = useState(0);
  const [top, setTop] = useState(0);
  const st = useRef({
    source: 'idle' as Source, mirror: true, effect: 'pixels' as Effect, ink: 'signal' as Ink, brush: 'medium' as Brush, detail: 'medium' as Detail,
    ptr: null as Pt | null, ptrDown: false, mouse: false, hands: [] as Pt[][], pens: [false, false], clear: false, clean: false, fill: false, text: '',
  });
  Object.assign(st.current, { source, mirror, effect, ink, brush, detail, text: page.kana.text });
  const lm = useRef<HL | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const tap = useRef<{ x: number; y: number; t: number } | null>(null);
  const live = source === 'hand' || source === 'camera', image = source === 'camera' || (source === 'hand' && mirror);

  // phones: the camera without tracking, and a tap covers the image (owner, 2026-11-27)
  useEffect(() => { setTouch(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches); }, []);

  // drawing: the mirror, the painted effects and the hands
  useEffect(() => {
    const root = rootRef.current, cv = cvRef.current, video = videoRef.current; if (!root || !cv || !video) return;
    setTop(root.getBoundingClientRect().top + window.scrollY);
    const reduce = prefersReducedMotion(), ctx = cv.getContext('2d')!;
    const sc = document.createElement('canvas'), sx = sc.getContext('2d', { willReadFrequently: true })!;
    const oc = document.createElement('canvas'), ox = oc.getContext('2d')!;
    const mono = getComputedStyle(cv).fontFamily, zh = getComputedStyle(document.documentElement).getPropertyValue('--font-zh').trim() || 'sans-serif';
    let GW = 0, GH = 0, paint = new Float32Array(0), seed = new Uint8Array(0), fxc = new Uint8Array(0), ikc = new Uint8Array(0), dtc = new Uint8Array(0), od: ImageData | null = null;
    let last: (Pt | null)[] = [null, null, null], lastPen = [false, false, false], step = -1, raf = 0, lo = 0, hi = 255;
    let shapes: Shape[] = [], paths: Pt[][] = [[], [], []];
    const fit = () => {
      const w = Math.ceil(cv.clientWidth / CELL), h = Math.ceil(cv.clientHeight / CELL); if (w === GW && h === GH) return;
      GW = w; GH = h; const n = GW * GH;
      paint = new Float32Array(n).fill(-1); seed = new Uint8Array(n); fxc = new Uint8Array(n); ikc = new Uint8Array(n); dtc = new Uint8Array(n);
      cv.width = GW * CELL; cv.height = GH * CELL; sc.width = oc.width = GW; sc.height = oc.height = GH; od = ox.createImageData(GW, GH); shapes = [];
    };
    const now0 = (S: typeof st.current) => {
      const img = S.source === 'camera' || (S.source === 'hand' && S.mirror);
      return { e: img || BARE.includes(S.effect) ? S.effect : 'trail' as Effect, k: S.ink === 'multi' ? MULTI : INKS.indexOf(S.ink), d: DETAILS.indexOf(S.detail) };
    };
    const set = (id: number, e: number, k: number, d: number, now: number) => { paint[id] = now; seed[id] = (Math.random() * 255) | 0; fxc[id] = e; ikc[id] = k; dtc[id] = d; };
    // every stroke keeps its own effect, ink, brush and grain
    const mark = (a: Pt, b: Pt, now: number) => {
      const S = st.current, { e, k, d } = now0(S), f = FX.indexOf(e);
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 3)), r = Math.round((e === 'trail' ? BRUSH[S.brush] / 2 : BRUSH[S.brush]) / CELL);
      for (let i = 0; i <= n; i++) {
        const x = a.x + ((b.x - a.x) * i) / n, y = a.y + ((b.y - a.y) * i) / n;
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r + 1) continue;
          const cx = Math.floor(x / CELL) + dx, cy = Math.floor(y / CELL) + dy; if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) continue;
          set(cy * GW + cx, f, k, d, now);
        }
      }
    };
    // a closed outline fills with text, line after line, only inside it
    const close = (pts: Pt[]) => {
      if (pts.length < 3) return;
      const S = st.current, { k, d } = now0(S), size = SIZE.kana[d], path = new Path2D();
      path.moveTo(pts[0].x, pts[0].y); for (const p of pts) path.lineTo(p.x, p.y); path.closePath();
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
      const text = Array.from(S.text), chars: Shape['chars'] = []; let i = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let y = y0; y + size <= y1 + size * 0.5; y += size * 1.25) for (let x = x0; x + size <= x1 + size * 0.5; x += size) {
        if (!ctx.isPointInPath(path, x + size / 2, y + size / 2)) continue;
        chars.push({ x, y, c: text[i++ % text.length] });
      }
      shapes.push({ path, chars, ink: k, size });
    };
    const fillAll = (now: number) => {
      const S = st.current, { e, k, d } = now0(S);
      if (e === 'kana') { const w = cv.width, h = cv.height; close([{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }]); return; }
      const f = FX.indexOf(e); for (let id = 0; id < GW * GH; id++) set(id, f, k, d, now);
    };
    // the video covers the canvas, mirrored
    const cover = (c: CanvasRenderingContext2D, W: number, H: number) => {
      const vw = video.videoWidth || 640, vh = video.videoHeight || 480, s = Math.max(W / vw, H / vh);
      c.save(); c.translate(W, 0); c.scale(-1, 1); c.drawImage(video, (W - vw * s) / 2, (H - vh * s) / 2, vw * s, vh * s); c.restore();
    };
    const inkOf = (k: number, sd: number) => (k === MULTI ? RETRO[3 + (sd % 12)] : INK_RGB[k]);
    const css = (c: number[], a = 1) => (a === 1 ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})` : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const S = st.current, img = (S.source === 'camera' || (S.source === 'hand' && S.mirror)) && video.readyState >= 2;
      const fps = img ? 24 : 12, s = Math.floor(now / (1000 / fps)); if (s === step) return; step = s;
      fit();
      if (S.clear) { paint.fill(-1); shapes = []; paths = [[], [], []]; S.clear = false; }
      if (S.fill) { fillAll(now); S.fill = false; }
      const { e: cur } = now0(S), inkHex = S.ink === 'multi' ? color.signal : camaraInks[S.ink];
      // pens: each hand, or the pointer
      const tips: (Pt | null)[] = [], downs: boolean[] = [];
      if (S.source === 'hand') for (let h = 0; h < 2; h++) { tips.push(S.hands[h]?.[8] ?? null); downs.push(!!S.hands[h] && S.pens[h]); }
      else { tips.push(null, null); downs.push(false, false); }
      // the pointer paints too: alone without tracking, and alongside the hands with it
      tips.push(S.ptr); downs.push(S.source === 'hand' ? S.mouse : S.ptrDown);
      tips.forEach((tip, h) => {
        if (cur === 'kana') {
          if (downs[h] && tip) { const q = paths[h][paths[h].length - 1]; if (!q || Math.hypot(q.x - tip.x, q.y - tip.y) > 3) paths[h].push({ ...tip }); }
          else if (paths[h].length) { close(paths[h]); paths[h] = []; }
        } else {
          if (paths[h].length) { close(paths[h]); paths[h] = []; }
          if (downs[h] && tip) mark(last[h] && lastPen[h] ? last[h]! : tip, tip, now);
        }
        last[h] = tip; lastPen[h] = downs[h];
      });

      // the base: you, or the paper
      let px: Uint8ClampedArray | null = null;
      if (img) { cover(ctx, cv.width, cv.height); cover(sx, GW, GH); px = sx.getImageData(0, 0, GW, GH).data; }
      else {
        ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = corkGrid.dot; for (let y = 4; y < cv.height; y += 8) for (let x = 4; x < cv.width; x += 8) if ((((x + y) / 8) & 1) === 0) ctx.fillRect(x - 1, y - 1, 2, 2);
      }
      // the hand screened from its points, when the image is not shown
      if (S.source === 'hand' && !S.mirror) {
        ctx.fillStyle = color.ink;
        const hw = Math.ceil(cv.width / HC), hh = Math.ceil(cv.height / HC);
        for (const H of S.hands) H.forEach((p, i) => {
          const r = i === 0 ? 11 : 5.4, cx = p.x / HC, cy = p.y / HC;
          for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
            if (x < 0 || y < 0 || x >= hw || y >= hh) continue; const d = 1 - Math.hypot(x - cx, y - cy) / r;
            if (d > 0 && d * 0.7 * 16 > BAY[(y & 3) * 4 + (x & 3)]) ctx.fillRect(x * HC + 1, y * HC + 1, HC - 2, HC - 2);
          }
        });
      }

      // automatic exposure: the lights and shadows inside what is painted, so the effects always draw the face
      if (px) {
        const hist = new Uint32Array(256); let n = 0;
        for (let id = 0; id < GW * GH; id += 3) if (paint[id] >= 0 && fxc[id] < 5) { const o = id * 4; hist[(px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) | 0]++; n++; }
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
        const id = y * GW + x, b = paint[id]; if (b < 0) continue;
        let fx = FX[fxc[id]]; const k = ikc[id], multi = k === MULTI, dd = dtc[id];
        // an image effect without the image (only the hand, the cursor) shows as the trail
        if (!px && !BARE.includes(fx)) fx = 'trail';
        if (fx === 'trail') {
          const age = now - b;
          if (age > TRAIL) { if (FX[fxc[id]] === 'trail') paint[id] = -1; continue; }
          const cool = (age - 260) / (TRAIL - 260), c = inkOf(k, seed[id]);
          if (age < 260 && !reduce) put(id, INK0);
          else if (cool < 0.45) put(id, c);
          else if ((BAY[((y >> 1) & 3) * 4 + ((x >> 1) & 3)] + 0.5) / 16 > (cool - 0.45) / 0.55) put(id, c, 150);
          continue;
        }
        if (fx === 'kana') continue;
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

      // kana: the closed shapes, tinted, filled with text that is darker where you are
      ctx.textBaseline = 'top';
      for (const sh of shapes) {
        ctx.fillStyle = css(sh.ink === MULTI ? RETRO[5] : INK_RGB[sh.ink], 0.32); ctx.fill(sh.path);
        ctx.strokeStyle = color.ink; ctx.lineWidth = 1; ctx.stroke(sh.path);
        ctx.font = `400 ${sh.size}px ${zh}`; ctx.fillStyle = color.ink;
        for (const ch of sh.chars) {
          if (px) { const c = around(ch.x + sh.size / 2, ch.y + sh.size / 2, sh.size), dark = 1 - lum(c); if (dark < 0.12) continue; ctx.globalAlpha = Math.min(1, 0.2 + dark); }
          ctx.fillText(ch.c, ch.x, ch.y);
        }
        ctx.globalAlpha = 1;
      }
      // the outline being drawn
      ctx.strokeStyle = inkHex; ctx.lineWidth = 1.5;
      for (const p of paths) if (p.length > 1) { ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); for (const q of p) ctx.lineTo(q.x, q.y); ctx.stroke(); }

      // the hands' points (left out of the photo)
      if (!S.clean) {
        if (S.source === 'hand') for (let h = 0; h < S.hands.length; h++) {
          const H = S.hands[h];
          ctx.strokeStyle = img ? corkGrid.paper : color.quiet; ctx.lineWidth = 1;
          for (const [a, c] of BONES) { ctx.beginPath(); ctx.moveTo(H[a].x, H[a].y); ctx.lineTo(H[c].x, H[c].y); ctx.stroke(); }
          H.forEach((p, i) => { const on = i === 4 || i === 8, z = on ? 8 : 4; ctx.fillStyle = on && S.pens[h] ? inkHex : img ? corkGrid.paper : color.ink; ctx.fillRect(p.x - z / 2, p.y - z / 2, z, z); });
        }
        if (S.ptr && (S.source === 'cursor' || S.mouse || (S.source === 'camera' && S.ptrDown))) { ctx.strokeStyle = S.ptrDown || S.mouse ? inkHex : color.ink; ctx.lineWidth = 1; ctx.strokeRect(S.ptr.x - 7.5, S.ptr.y - 7.5, 15, 15); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // the hands: one detection per new video frame
  useEffect(() => {
    if (source !== 'hand') return;
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
  }, [source]);

  useEffect(() => { lm.current?.setOptions({ numHands: two ? 2 : 1 }).catch(() => {}); }, [two, source]);
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

  // with tracking on a computer; on a phone the camera alone (owner, 2026-11-27)
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
        const make = (delegate: 'GPU' | 'CPU') => HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: '/lab/camara/hand_landmarker.task', delegate }, runningMode: 'VIDEO', numHands: two ? 2 : 1 });
        lm.current = (await make('GPU').catch(() => make('CPU'))) as unknown as HL;
      }
      setNote(''); st.current.clear = true; setSource(track ? 'hand' : 'camera');
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
      setNote((e as DOMException)?.name === 'NotAllowedError' ? page.denied : page.noCamera); setSource('cursor');
    }
  };
  const useCursor = () => {
    stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
    st.current.hands = []; st.current.pens = [false, false]; st.current.ptrDown = false; st.current.clear = true; setPen(false); setNote(''); setSource('cursor');
  };
  const local = (e: React.PointerEvent): Pt => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const effects: Effect[] = image ? FX : BARE;

  return (
    <section ref={rootRef} className="camara" aria-label={page.title} style={{ height: `calc(100svh - ${top}px)` }}>
      <canvas
        ref={cvRef} className="camara__cv" role="img" aria-label={image ? page.canvasMirror : live ? page.canvasHand : page.canvasCursor}
        onPointerDown={(e) => {
          if (source !== 'cursor' && source !== 'hand' && source !== 'camera') return;
          const p = local(e); st.current.ptr = p; tap.current = { ...p, t: e.timeStamp };
          if (source === 'hand') st.current.mouse = true; else { st.current.ptrDown = true; setPen(true); }
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => { st.current.ptr = local(e); }}
        onPointerUp={(e) => {
          // on the camera without tracking, a tap covers the whole image
          const t = tap.current, p = local(e); tap.current = null;
          if (source === 'camera' && t && e.timeStamp - t.t < 300 && Math.hypot(p.x - t.x, p.y - t.y) < 8) st.current.fill = true;
          st.current.mouse = false; if (source === 'hand') return; st.current.ptrDown = false; setPen(false);
        }}
      />
      <video ref={videoRef} className="camara__video" playsInline muted aria-hidden="true" />

      {(source === 'idle' || source === 'loading') && (
        <div className="camara__gate" role="dialog" aria-label={page.gate.title}>
          <h1 className="camara__gate-title">{page.gate.title}</h1>
          <p className="camara__gate-text">{page.gate.text}</p>
          {touch && <p className="camara__gate-text">{page.gate.touch}</p>}
          <div className="camara__actions">
            <button type="button" className="btn btn--signal btn--sm" onClick={() => startCamera()} disabled={source === 'loading'}>{source === 'loading' ? page.loading : page.gate.camera} <span aria-hidden="true">→</span></button>
            <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.gate.cursor}</button>
          </div>
        </div>
      )}

      {(live || source === 'cursor') && (
        <>
          <div className="camara__state" aria-live="polite">
            <span className="label">{source === 'hand' ? page.sourceHand : source === 'camera' ? page.sourceCamera : page.sourceCursor}</span>
            <span className="label" data-on={pen}>{pen ? page.penDown : page.penUp}</span>
          </div>
          <div className="camara__panel">
            <div className="camara__head">
              <h1 className="camara__title">{page.title}</h1>
              <p className="camara__lead">{page.lead}</p>
            </div>
            {note && <p className="label camara__note" role="status">{note}</p>}
            <div className="camara__controls">
              {source === 'hand' && (
                <div role="group" aria-label={page.view.label} className="camara__group">
                  <span className="label">{page.view.label}</span>
                  <button type="button" className="camara__seg" aria-pressed={mirror} onClick={() => setMirror(true)}>{page.view.mirror}</button>
                  <button type="button" className="camara__seg" aria-pressed={!mirror} onClick={() => setMirror(false)}>{page.view.hand}</button>
                </div>
              )}
              {source === 'hand' && (
                <div role="group" aria-label={page.hands.label} className="camara__group">
                  <span className="label">{page.hands.label}</span>
                  <button type="button" className="camara__seg" aria-pressed={!two} onClick={() => setTwo(false)}>{page.hands.one}</button>
                  <button type="button" className="camara__seg" aria-pressed={two} onClick={() => setTwo(true)}>{page.hands.two}</button>
                </div>
              )}
              {(
                <div role="group" aria-label={page.effect.label} className="camara__group">
                  <span className="label">{page.effect.label}</span>
                  {effects.map((f) => <button key={f} type="button" className="camara__seg" aria-pressed={effect === f} onClick={() => setEffect(f)}>{page.effect[f]}</button>)}
                </div>
              )}
              <div role="group" aria-label={page.brush.label} className="camara__group">
                <span className="label">{page.brush.label}</span>
                {(Object.keys(BRUSH) as Brush[]).map((b) => <button key={b} type="button" className="camara__seg" aria-pressed={brush === b} onClick={() => setBrush(b)}>{page.brush[b]}</button>)}
              </div>
              {(image || effect === 'kana') && (
                <div role="group" aria-label={page.pixel.label} className="camara__group">
                  <span className="label">{page.pixel.label}</span>
                  {DETAILS.map((d) => <button key={d} type="button" className="camara__seg" aria-pressed={detail === d} onClick={() => setDetail(d)}>{page.pixel[d]}</button>)}
                </div>
              )}
              <div role="group" aria-label={page.colour.label} className="camara__group">
                <span className="label">{page.colour.label}</span>
                {INKS.map((k) => (
                  <button key={k} type="button" className="camara__ink" aria-pressed={ink === k} aria-label={page.colour.names[k]} title={page.colour.names[k]} style={{ background: camaraInks[k] }} onClick={() => setInk(k)} />
                ))}
                <button type="button" className="camara__ink camara__ink--multi" aria-pressed={ink === 'multi'} aria-label={page.colour.names.multi} title={page.colour.names.multi} onClick={() => setInk('multi')} />
              </div>
            </div>
            <div className="camara__actions">
              <button type="button" className="btn btn--signal btn--sm" onClick={() => { setNote(''); setCount(3); }} disabled={count > 0}>{page.photo}</button>
              <button type="button" className="btn btn--line btn--sm" onClick={() => { st.current.clear = true; }}>{page.clear}</button>
              {live
                ? <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.stop}</button>
                : <button type="button" className="btn btn--line btn--sm" onClick={() => startCamera()}>{page.camera}</button>}
            </div>
          </div>
          <ol className="camara__how">
            {(touch ? page.howTouch : page.how).map((h, i) => <li key={h}><span className="label">{String(i + 1).padStart(2, '0')}</span> {h}</li>)}
            {effect === 'kana' && <li className="label camara__credit">{page.kana.credit}</li>}
          </ol>
        </>
      )}
      {count > 0 && <p className="camara__count" aria-live="assertive">{count}</p>}
    </section>
  );
}
