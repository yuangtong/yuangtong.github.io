/**
 * The carcoma: six shapes from Acid Dither Shapes (Pixelbuddha, commercial
 * license) grow at 12 fps over the page in difference mode, an ordered Bayer
 * screen covers it, the section changes underneath and the carcoma retreats.
 * Drawn on a 360 x 225 grid stretched over the viewport.
 */
import { acidShape, type AcidShapeId } from './acid-shapes';
import { BAYER, u32 } from './dither';
import { acidRamps, color } from './tokens';

export const CARCOMA = { W: 360, H: 225, swapAt: 17, end: 31 } as const;
const IDS: AcidShapeId[] = ['f1', 'f4', 'f11', 'f13', 'f22', 'f34'];
const SPOTS = [[70, 60], [290, 50], [180, 120], [40, 185], [320, 180], [175, 20]];

export function createCarcoma(canvas: HTMLCanvasElement) {
  const { W, H } = CARCOMA;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H), px = new Uint32Array(img.data.buffer);
  const WHITE = u32(color.white);
  const ramps = acidRamps.map((r) => r.map(u32));
  const shapes = IDS.map(acidShape);
  return {
    /** Draws step t (0..end) of the transition. */
    draw(t: number) {
      px.fill(0);
      const grow = t < 17 ? t : Math.max(0, 30 - t);
      shapes.forEach((s, i) => {
        const sc = Math.floor((grow - i * 0.8) / 2) + 1;
        if (sc < 1 || grow - i * 0.8 <= 0) return;
        const ramp = ramps[i % ramps.length], cyc = Math.floor(t / 3), cols = [0, WHITE];
        for (let L = 2; L <= 8; L++) cols.push(ramp[(L - 2 + cyc) % 4]);
        const ox = SPOTS[i][0] - ((s.w * sc) >> 1), oy = SPOTS[i][1] - ((s.h * sc) >> 1);
        for (let y = 0; y < s.h * sc; y++) {
          const Y = oy + y; if (Y < 0 || Y >= H) continue;
          for (let x = 0; x < s.w * sc; x++) {
            const X = ox + x; if (X < 0 || X >= W) continue;
            const v = s.cells[((y / sc) | 0) * s.w + ((x / sc) | 0)];
            if (v) px[Y * W + X] = cols[v];
          }
        }
      });
      const cover = t < 12 ? 0 : t <= 17 ? (t - 12) / 5 : t <= 24 ? 1 - (t - 17) / 7 : 0;
      if (cover > 0) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < cover) px[y * W + x] = WHITE;
      ctx.putImageData(img, 0, 0);
    },
    clear() { ctx.clearRect(0, 0, W, H); },
  };
}
