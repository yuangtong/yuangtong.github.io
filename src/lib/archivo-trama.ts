/** Re-screens a photo for archivo.exe: dots in one ink, an ordered ramp, or plain pixels. */
import type { ArchivePalette } from '@/content/types';
import { BAYER } from './dither';
import { archivePalettes, color } from './tokens';

const images = new Map<string, { img: HTMLImageElement; ok: boolean; cbs: ((i: HTMLImageElement) => void)[] }>();
export function getImage(src: string, cb: (img: HTMLImageElement) => void) {
  let o = images.get(src);
  if (o?.ok) { cb(o.img); return; }
  if (o) { o.cbs.push(cb); return; }
  o = { img: new Image(), ok: false, cbs: [cb] };
  images.set(src, o);
  const rec = o;
  rec.img.onload = () => { rec.ok = true; rec.cbs.forEach((f) => f(rec.img)); rec.cbs = []; };
  // photos from the CMS come from another origin; the canvas reads their pixels
  if (/^https?:/.test(src)) rec.img.crossOrigin = 'anonymous';
  rec.img.src = src;
}

function coverRect(img: HTMLImageElement, W: number, H: number) {
  const ia = img.naturalWidth / img.naturalHeight, a = W / H;
  let sw: number, sh: number;
  if (ia > a) { sh = img.naturalHeight; sw = sh * a; } else { sw = img.naturalWidth; sh = sw / a; }
  return [(img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh] as const;
}

let sample: HTMLCanvasElement | null = null;

/** `cell` 0 draws the original photo. */
export function drawTrama(cv: HTMLCanvasElement, img: HTMLImageElement, W: number, H: number, cell: number, palKey: ArchivePalette) {
  const D = 2, ctx = cv.getContext('2d')!;
  if (cv.width !== Math.round(W * D) || cv.height !== Math.round(H * D)) { cv.width = Math.round(W * D); cv.height = Math.round(H * D); }
  ctx.setTransform(D, 0, 0, D, 0, 0);
  const cr = coverRect(img, W, H);
  if (!cell) { ctx.imageSmoothingEnabled = true; ctx.drawImage(img, cr[0], cr[1], cr[2], cr[3], 0, 0, W, H); return; }
  const gw = Math.ceil(W / cell), gh = Math.ceil(H / cell);
  sample ??= document.createElement('canvas');
  sample.width = gw; sample.height = gh;
  const sx = sample.getContext('2d', { willReadFrequently: true })!;
  sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = 'high';
  const cg = coverRect(img, gw * cell, gh * cell);
  sx.drawImage(img, cg[0], cg[1], cg[2], cg[3], 0, 0, gw, gh);
  const d = sx.getImageData(0, 0, gw, gh).data, tot = gw * gh;
  const L = new Float32Array(tot), hist = new Uint32Array(64);
  for (let q = 0; q < tot; q++) { L[q] = (0.2126 * d[q * 4] + 0.7152 * d[q * 4 + 1] + 0.0722 * d[q * 4 + 2]) / 255; hist[Math.min(63, (L[q] * 64) | 0)]++; }
  // stretch the levels between the 3% darkest and lightest cells
  let acc = 0, lo = 0, hi = 1;
  for (let q = 0; q < 64; q++) { acc += hist[q]; if (acc > tot * 0.03) { lo = q / 64; break; } }
  acc = 0;
  for (let q = 63; q >= 0; q--) { acc += hist[q]; if (acc > tot * 0.03) { hi = (q + 1) / 64; break; } }
  for (let q = 0; q < tot; q++) { const t = Math.min(1, Math.max(0, (L[q] - lo) / Math.max(0.1, hi - lo))); L[q] = t * t * (3 - 2 * t) * 0.6 + t * 0.4; }
  ctx.imageSmoothingEnabled = false;
  if (palKey === 'color') { ctx.drawImage(sample, 0, 0, gw * cell, gh * cell); return; }
  ctx.fillStyle = color.paper; ctx.fillRect(0, 0, W, H);
  const pal = archivePalettes[palKey];
  if ('ramp' in pal) {
    const ramp = pal.ramp, n = ramp.length - 1, buckets: number[][] = ramp.map(() => []);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const v = L[y * gw + x] * n;
      let k = Math.floor(v);
      if (v - k > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16) k++;
      buckets[Math.min(n, k)].push(x, y);
    }
    buckets.forEach((b, k) => {
      if (k === n || !b.length) return;
      ctx.fillStyle = ramp[k];
      for (let j = 0; j < b.length; j += 2) ctx.fillRect(b[j] * cell, b[j + 1] * cell, cell, cell);
    });
    return;
  }
  ctx.fillStyle = 'ink' in pal ? pal.ink : color.ink;
  ctx.beginPath();
  const half = cell / 2, min = 0.45 / D;
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    const r = half * Math.sqrt(Math.max(0, 0.96 - L[y * gw + x])) * 1.16;
    if (r < min) continue;
    const cx = x * cell + half, cy = y * cell + half;
    ctx.moveTo(cx + r, cy);
    ctx.arc(cx, cy, r, 0, 6.2832);
  }
  ctx.fill();
}
