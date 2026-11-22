/** Dithered header images for the note cards, one accent per note. */
import type { Note } from '@/content/types';
import { BAYER, u32, type PixelView } from './dither';
import { horseAt, type Gallop } from './media';
import { noteSwatch } from './tokens';

export function drawNote(v: PixelView, n: Note, step: number, g?: Gallop, orig?: Float32Array[]) {
  if (!g) return;
  if (n.visual === 'foto' && !orig) return;
  const [inkHex, paperHex] = noteSwatch[n.accent];
  const W = v.w, H = v.h, bg = u32(paperHex), ac = u32(inkHex), f = step % 15, tt = step / 12;
  let sdf: ((x: number, y: number, z: number) => number) | null = null;
  if (n.visual === 'dona') {
    const c1 = Math.cos(tt * 0.7), s1 = Math.sin(tt * 0.7), c2 = Math.cos(tt * 0.45), s2 = Math.sin(tt * 0.45);
    sdf = (px, py, pz) => { const y1 = py * c1 - pz * s1, z1 = py * s1 + pz * c1, x2 = px * c2 + z1 * s2, z2 = -px * s2 + z1 * c2, q = Math.sqrt(x2 * x2 + z2 * z2) - 0.62; return Math.sqrt(q * q + y1 * y1) - 0.28; };
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = (x + 0.5) / W, w = (y + 0.5) / H;
    let L: number;
    if (n.visual === 'foto') L = orig![f][Math.min(199, Math.floor(w * 196)) * 300 + Math.min(299, Math.floor((0.12 + u * 0.76) * 300))] * 1.2 - 0.08;
    else if (n.visual === 'ecos') {
      L = 0.93;
      if (horseAt(g.frames, f, (u * 1.15 - 0.12) * 300, (w * 1.1 - 0.05) * 176)) L = 0.08;
      else for (let k = 1; k <= 4; k++) if (horseAt(g.frames, f - k, (u * 1.15 - 0.12 + k * 0.06) * 300, (w * 1.1 - 0.05) * 176)) { L = 0.3 + k * 0.12; break; }
    } else {
      const px = (u * 2 - 1) * 1.6, py = (w * 2 - 1) * 0.9;
      let z = -1.6, hit = false, d = 0;
      for (let i = 0; i < 22; i++) { d = sdf!(px, py, z); if (d < 0.015) { hit = true; break; } z += d; if (z > 1.6) break; }
      if (hit) { const e = 0.03, nx = sdf!(px + e, py, z) - d, ny = sdf!(px, py + e, z) - d, nz = sdf!(px, py, z + e) - d, ln = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1, sh = (nx * -0.45 + ny * -0.65 + nz * -0.6) / ln; L = 0.12 + 0.8 * Math.max(0, sh); }
      else L = 0.78 + 0.18 * (0.5 + 0.5 * Math.sin(Math.atan2(py, px) * 6 + Math.hypot(px, py) * 9 - tt * 2));
    }
    v.px[y * W + x] = L * 16 > BAYER[(y & 3) * 4 + (x & 3)] + 0.5 ? bg : ac;
  }
  v.ctx.putImageData(v.img, 0, 0);
}

