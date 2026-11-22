/**
 * The gallop: Eadweard Muybridge, public domain. Loaded once and shared by
 * every canvas on the page.
 *  - frames: 15 riderless frames of 300 x 176, red channel as coverage.
 *  - original: 15 photographic frames of 300 x 200, luminance 0..1.
 *  - photo: one still, luminance 0..1 at 336 x 224.
 */

export const GALLOP = { w: 300, h: 176, count: 15 } as const;

export type Gallop = { frames: Uint8Array[]; flight: number; hoof: number };
export type Luma = { w: number; h: number; data: Float32Array };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function draw(im: HTMLImageElement, w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.drawImage(im, 0, 0, w, h);
  return x;
}

let gallop: Promise<Gallop> | null = null;
export function loadGallop(): Promise<Gallop> {
  return (gallop ??= loadImage('/media/galope-sin-jinete.png').then((im) => {
    const { w, h, count } = GALLOP;
    const x = draw(im, w * count, h);
    const frames: Uint8Array[] = [];
    let flight = -1, best = 1e9, lowest = 0;
    for (let f = 0; f < count; f++) {
      const d = x.getImageData(f * w, 0, w, h).data, a = new Uint8Array(w * h);
      let bottom = 0;
      for (let k = 0; k < a.length; k++) { a[k] = d[k * 4]; if (a[k] > 30) bottom = Math.max(bottom, (k / w) | 0); }
      frames.push(a);
      // the frame with no hoof on the ground: its lowest hoof sits highest
      if (bottom < best) { best = bottom; flight = f; }
      lowest = Math.max(lowest, bottom);
    }
    return { frames, flight: flight < 0 ? 6 : flight, hoof: lowest || 172 };
  }));
}

let original: Promise<Float32Array[]> | null = null;
export function loadOriginal(): Promise<Float32Array[]> {
  return (original ??= loadImage('/media/galope-original.jpg').then((im) => {
    const x = draw(im, 4500, 200), out: Float32Array[] = [];
    for (let f = 0; f < 15; f++) {
      const d = x.getImageData(f * 300, 0, 300, 200).data, a = new Float32Array(300 * 200);
      for (let k = 0; k < a.length; k++) a[k] = d[k * 4] / 255;
      out.push(a);
    }
    return out;
  }));
}

let photo: Promise<Luma> | null = null;
export function loadPhoto(): Promise<Luma> {
  return (photo ??= loadImage('/media/galope-foto.jpg').then((im) => {
    const w = 336, h = 224, d = draw(im, w, h).getImageData(0, 0, w, h).data, data = new Float32Array(w * h);
    for (let k = 0; k < data.length; k++) data[k] = d[k * 4] / 255;
    return { w, h, data };
  }));
}

export function horseAt(frames: Uint8Array[], f: number, x: number, y: number): number {
  const n = frames.length;
  f = ((f % n) + n) % n;
  return x < 0 || y < 0 || x >= GALLOP.w || y >= GALLOP.h ? 0 : frames[f][(y | 0) * GALLOP.w + (x | 0)];
}
