/** Shared helpers for the indexed canvas: ordered dither and packed colors. */

export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** '#rrggbb' to a little-endian 0xAABBGGRR value for Uint32Array pixel buffers. */
export function u32(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0xff000000 | ((n & 255) << 16) | (n & 0xff00) | ((n >> 16) & 255)) >>> 0;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type PixelView = { ctx: CanvasRenderingContext2D; img: ImageData; px: Uint32Array; w: number; h: number };

export function pixelView(el: HTMLCanvasElement): PixelView | null {
  const ctx = el.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(el.width, el.height);
  return { ctx, img, px: new Uint32Array(img.data.buffer), w: el.width, h: el.height };
}
