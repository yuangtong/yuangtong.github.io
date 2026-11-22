/** Live dithered visuals for the lab pieces. */
import type { ExperimentVisual } from '@/content/types';
import { BAYER, u32, type PixelView } from './dither';
import { horseAt, type Gallop, type Luma } from './media';
import { color, introPalette } from './tokens';

export const CELLS = [4, 8, 16] as const;
export type Media = { gallop?: Gallop; original?: Float32Array[]; photo?: Luma };

export function drawCard(v: PixelView, visual: ExperimentVisual, cs: number, step: number, m: Media) {
  const CW = v.w, CH = v.h, bg = u32(color.white), ac = u32(color.signal), lt = u32(introPalette.cardLight), md = u32(introPalette.cardMid), ink = u32(color.ink);
  const cols = Math.ceil(CW / cs), rows = Math.ceil(CH / cs), px = v.px;
  const fill = (x0: number, y0: number, w: number, h: number, c: number) => { for (let y = y0; y < Math.min(CH, y0 + h); y++) for (let x = x0; x < Math.min(CW, x0 + w); x++) px[y * CW + x] = c; };
  px.fill(bg);
  if (visual === 'medio') {
    if (!m.gallop) return;
    const f = step % 15;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const k = 344 / CW, val = horseAt(m.gallop.frames, f, (c + 0.5) * cs * 0.62 * k + 40, (r + 0.5) * cs * 0.62 * k - 20);
      if (!val) continue;
      const cx = c * cs + cs / 2, cy = r * cs + cs / 2, rad = (cs / 2) * (0.35 + (0.65 * (val - 120)) / 135);
      for (let y = Math.max(0, Math.floor(cy - rad)); y <= Math.min(CH - 1, Math.ceil(cy + rad)); y++) for (let x = Math.max(0, Math.floor(cx - rad)); x <= Math.min(CW - 1, Math.ceil(cx + rad)); x++) { const dx = x + 0.5 - cx, dy = y + 0.5 - cy; if (dx * dx + dy * dy <= rad * rad) px[y * CW + x] = ac; }
    }
  } else if (visual === 'camara') {
    if (!m.original) return;
    const Lm = m.original[step % 15];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const sx = Math.min(299, Math.floor(90 + ((c + 0.5) * cs / CW) * 200)), sy = Math.min(199, Math.floor(((r + 0.5) * cs / CH) * 196));
      const l = Lm[sy * 300 + sx] * 1.15 - 0.05;
      if (l * 16 > BAYER[(r & 3) * 4 + (c & 3)] + 0.5) fill(c * cs, r * cs, cs, cs, ac);
    }
  } else if (visual === 'dona') {
    const tt = step / 12, cx1 = Math.cos(tt * 0.9), sx1 = Math.sin(tt * 0.9), cy1 = Math.cos(tt * 0.55), sy1 = Math.sin(tt * 0.55);
    const sdf = (qx: number, qy: number, qz: number) => { const y1 = qy * cx1 - qz * sx1, z1 = qy * sx1 + qz * cx1, x2 = qx * cy1 + z1 * sy1, z2 = -qx * sy1 + z1 * cy1, qq = Math.sqrt(x2 * x2 + z2 * z2) - 0.62; return Math.sqrt(qq * qq + y1 * y1) - 0.28; };
    px.fill(ac);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u = ((c + 0.5) / cols * 2 - 1) * 1.2, w = ((r + 0.5) / rows * 2 - 1) * 1.2;
      let z = -1.6, hit = false, d = 0;
      for (let i = 0; i < 24; i++) { d = sdf(u, w, z); if (d < 0.012) { hit = true; break; } z += d; if (z > 1.6) break; }
      if (!hit) continue;
      const e = 0.02, nx = sdf(u + e, w, z) - d, ny = sdf(u, w + e, z) - d, nz = sdf(u, w, z + e) - d, ln = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1, sh = (nx * -0.45 + ny * -0.65 + nz * -0.6) / ln;
      for (let y = r * cs; y < Math.min(CH, r * cs + cs); y++) for (let x = c * cs; x < Math.min(CW, c * cs + cs); x++) {
        const mx = Math.floor(((x - c * cs) * 8) / cs), my = Math.floor(((y - r * cs) * 8) / cs);
        let lit: boolean;
        if (sh > 0.72) lit = my % 4 < 3 && mx !== 7; else if (sh > 0.38) lit = mx % 4 !== 3 && my % 4 !== 3; else if (sh > 0.08) lit = !!(((mx >> 1) + (my >> 1)) & 1); else lit = false;
        px[y * CW + x] = lit ? bg : ink;
      }
    }
  } else if (visual === 'fotos') {
    const p = m.photo; if (!p) return;
    const gap = cs >= 8 ? 1 : 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const sx = Math.min(p.w - 1, Math.floor((0.33 + ((c + 0.5) * cs / CW) * 0.6) * p.w)), sy = Math.min(p.h - 1, Math.floor(((r + 0.5) * cs / CH) * p.h)), l = p.data[sy * p.w + sx];
      fill(c * cs, r * cs, cs - gap, cs - gap, l > 0.8 ? bg : l > 0.6 ? lt : l > 0.35 ? md : ac);
    }
  }
  v.ctx.putImageData(v.img, 0, 0);
}

