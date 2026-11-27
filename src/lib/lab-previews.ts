/**
 * Live previews for the lab's doors (canvas "lab: índice v2", 2026-11-26): a
 * hint of each piece, not the piece. They run at 12 fps and only while their
 * door is open; a door that is closed keeps one still frame.
 */
import type { LabPreview } from '@/content/types';
import { BAYER, pixelView, type PixelView } from './dither';
import { drawCard, type Media } from './lab-cards';
import { bitsplash, boletos, color, corkGrid, labDesk, lalande, travesia } from './tokens';

export type PreviewMedia = Media & { tickets?: HTMLImageElement[]; card?: HTMLImageElement };

function grid(c: CanvasRenderingContext2D, w: number, h: number, dot: string = corkGrid.dot) {
  c.fillStyle = corkGrid.paper; c.fillRect(0, 0, w, h); c.fillStyle = dot;
  for (let y = 4; y < h; y += 8) for (let x = 4; x < w; x += 8) if ((((x + y) / 8) & 1) === 0) c.fillRect(x - 1, y - 1, 2, 2);
}

const views = new WeakMap<HTMLCanvasElement, PixelView>();

/** Draw one frame of a door's preview. `step` counts 12 fps frames. */
export function drawPreview(cv: HTMLCanvasElement, kind: LabPreview, step: number, m: PreviewMedia) {
  const c = cv.getContext('2d'); if (!c) return;
  const w = cv.width, h = cv.height, t = step / 12;
  if (kind === 'gallop') {
    let v = views.get(cv);
    if (!v || v.w !== w || v.h !== h) { v = pixelView(cv)!; views.set(cv, v); }
    drawCard(v, 'medio', 8, step, m);
  } else if (kind === 'drop') {
    c.fillStyle = lalande.signal; c.fillRect(0, 0, w, h);
    const fx = w * 0.62, y = ((step * 7) % (h + 40)) - 20;
    c.fillStyle = lalande.white; c.fillRect(fx - 4, y, 8, 12);
    c.fillStyle = lalande.cup;
    for (let a = 0; a < 6; a++) { const ang = a * 1.047 + t * 0.6; c.fillRect(fx + Math.cos(ang) * 16 - 5, h - 46 + Math.sin(ang) * 16 - 5, 10, 10); }
    c.fillStyle = lalande.cupRim; c.fillRect(fx - 6, h - 52, 12, 12);
  } else if (kind === 'tunnel') {
    c.fillStyle = travesia.ink; c.fillRect(0, 0, w, h);
    const ramps = Object.values(travesia.ramps);
    for (let k = 0; k < 14; k++) {
      const s = (k * 40 + step * 5) % 560, a = s / 560;
      c.strokeStyle = ramps[(k + Math.floor(t / 2)) % ramps.length][2]; c.globalAlpha = a; c.lineWidth = 2 + a * 4;
      c.strokeRect(w / 2 - s * 0.9, h / 2 - s * 0.32, s * 1.8, s * 0.64);
    }
    c.globalAlpha = 1;
  } else if (kind === 'desk') {
    c.fillStyle = labDesk; c.fillRect(0, 0, w, h);
    const p = m.photo;
    for (let i = 0; i < 3; i++) {
      const x = 32 + i * Math.min(150, (w - 64) / 3), y = 30 + i * 16, cell = [8, 4, 16][i];
      c.fillStyle = color.white; c.fillRect(x, y, 130, 104);
      for (let yy = 0; yy < 88; yy += cell) for (let xx = 0; xx < 114; xx += cell) {
        const l = p ? p.data[Math.min(p.h - 1, Math.floor((yy / 88) * p.h)) * p.w + Math.min(p.w - 1, Math.floor((0.33 + (xx / 114) * 0.6) * p.w))] : (Math.sin((xx + yy * 1.3 + step * 4) / 30) + 1) / 2;
        if ((1 - l) * 16 > BAYER[((yy / cell) & 3) * 4 + ((xx / cell) & 3)]) { c.fillStyle = l < 0.3 ? color.ink : color.signal; c.fillRect(x + 8 + xx, y + 8 + yy, cell, cell); }
      }
    }
  } else if (kind === 'tickets') {
    grid(c, w, h);
    (m.tickets ?? []).forEach((im, i) => {
      if (!im.naturalWidth) return;
      const tw = 100, th = tw * (im.naturalHeight / im.naturalWidth);
      const x = 40 + i * 118 + Math.sin(t + i) * 3, y = 30 + (i % 2) * 18;
      c.save(); c.translate(x + tw / 2, y + th / 2); c.rotate((i - 1.5) * 0.08);
      c.shadowColor = boletos.shadow; c.shadowOffsetX = 2; c.shadowOffsetY = 3; c.drawImage(im, -tw / 2, -th / 2, tw, th); c.restore();
      c.fillStyle = boletos.pins[(i * 5) % boletos.pins.length]; c.beginPath(); c.arc(x + tw / 2, y + 2, 6, 0, 6.3); c.fill();
    });
  } else if (kind === 'card') {
    grid(c, w, h);
    const im = m.card; if (!im?.naturalWidth) return;
    const sx = Math.cos(t * 1.1), cw = 230 * Math.abs(sx), ch = 145;
    c.save(); c.translate(Math.min(w * 0.45, w - 140), h / 2); c.shadowColor = boletos.shadow; c.shadowOffsetY = 10; c.shadowBlur = 16; c.drawImage(im, -cw / 2, -ch / 2, cw, ch); c.restore();
  } else if (kind === 'splash') {
    grid(c, w, h);
    for (let s = 0; s < 3; s++) {
      const P = bitsplash.pairs[s], cx = 90 + s * Math.min(150, (w - 120) / 3), cy = 70 + (s % 2) * 50, r = 10 + ((step * 2 + s * 30) % 60);
      for (let y = -r; y <= r; y += 8) for (let x = -r * 1.3; x <= r * 1.3; x += 8) {
        const d = Math.hypot(x / 1.3, y) / r + Math.sin(x * 0.3 + y * 0.2 + s) * 0.15; if (d >= 1) continue;
        c.fillStyle = BAYER[((Math.round(y + 400) / 8) & 3) * 4 + ((Math.round(x + 400) / 8) & 3)] / 16 < 0.4 ? P[1] : P[0];
        c.fillRect(cx + x, cy + y, 8, 8);
      }
    }
  } else if (kind === 'trail') {
    // a fingertip writes a loop that glows and cools, like the piece
    grid(c, w, h);
    for (let k = 0; k < 40; k++) {
      const a = (step - k) * 0.18, x = w / 2 + Math.sin(a) * Math.min(160, w * 0.3), y = h / 2 + Math.sin(a * 2) * 50, age = k / 40;
      c.fillStyle = age < 0.45 ? color.signal : color.echo; if (age > 0.85) continue;
      c.fillRect(Math.round(x / 8) * 8, Math.round(y / 8) * 8, 8, 8);
    }
  } else {
    grid(c, w, h, color.dotOff);
  }
}
