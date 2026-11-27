/**
 * Live previews for the lab's doors (canvas "lab: índice v2", 2026-11-26): a
 * hint of each piece, not the piece. They run at 12 fps and only while their
 * door is open; a door that is closed keeps one still frame.
 */
import type { LabPreview } from '@/content/types';
import { BAYER } from './dither';
import type { Media } from './lab-cards';
import { GALLOP, horseAt } from './media';
import { bitsplash, boletos, color, corkGrid, labDesk, lalande } from './tokens';
import { createTravesia } from './travesia-engine';

const tunnels = new WeakMap<HTMLCanvasElement, ReturnType<typeof createTravesia>>();

export type PreviewMedia = Media & { tickets?: HTMLImageElement[]; cards?: HTMLImageElement[]; pages?: HTMLImageElement[] };

function grid(c: CanvasRenderingContext2D, w: number, h: number, dot: string = corkGrid.dot) {
  c.fillStyle = corkGrid.paper; c.fillRect(0, 0, w, h); c.fillStyle = dot;
  for (let y = 4; y < h; y += 8) for (let x = 4; x < w; x += 8) if ((((x + y) / 8) & 1) === 0) c.fillRect(x - 1, y - 1, 2, 2);
}

/** The piece's push pin (Boletos.tsx), drawn on the canvas: tilted, with its needle, shade and shine. */
let PIN: { stem: Path2D; shade: Path2D } | null = null;   // made on first use: Path2D only exists in the browser
function pin(c: CanvasRenderingContext2D, x: number, y: number, col: string, k = 1) {
  PIN ??= { stem: new Path2D('M8.6 7.5 H15.4 L16.6 19 H7.4 Z'), shade: new Path2D('M13.6 8.5 H15.4 L16.4 18.4 H14.2 Z') };
  c.save(); c.translate(x - 12 * k, y - 16 * k); c.scale(k, k); c.translate(12, 16); c.rotate(-0.314); c.translate(-12, -16);
  c.strokeStyle = boletos.needle; c.lineWidth = 1.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(12, 20); c.lineTo(12, 31); c.stroke();
  c.fillStyle = col; c.beginPath(); c.ellipse(12, 19, 8, 3.2, 0, 0, 6.2832); c.fill(); c.fill(PIN.stem); c.beginPath(); c.ellipse(12, 7, 7.6, 4.6, 0, 0, 6.2832); c.fill();
  c.fillStyle = boletos.ink; c.globalAlpha = 0.14; c.beginPath(); c.ellipse(13, 19.6, 7, 2.2, 0, 0, 6.2832); c.fill(); c.globalAlpha = 0.12; c.fill(PIN.shade);
  c.fillStyle = boletos.light; c.globalAlpha = 0.4; c.fillRect(9.4, 9, 1.7, 9); c.globalAlpha = 0.55; c.beginPath(); c.ellipse(9.8, 5.6, 3.2, 1.6, 0, 0, 6.2832); c.fill();
  c.restore();
}

/** Draw one frame of a door's preview. `step` counts 12 fps frames. */
export function drawPreview(cv: HTMLCanvasElement, kind: LabPreview, step: number, m: PreviewMedia) {
  const c = cv.getContext('2d'); if (!c) return;
  const w = cv.width, h = cv.height, t = step / 12;
  if (kind === 'gallop') {
    // only the horse, small and whole inside the door, galloping in blue dots (owner, 2026-11-27)
    grid(c, w, h);
    const g = m.gallop; if (!g) return;
    const cs = 4, gh = Math.min(h - 32, 150), k = GALLOP.h / gh, gw = GALLOP.w / k, ox = (w - gw) / 2, oy = (h - gh) / 2, f = step % GALLOP.count;
    c.fillStyle = color.signal;
    for (let y = 0; y < gh; y += cs) for (let x = 0; x < gw; x += cs) {
      const val = horseAt(g.frames, f, (x + cs / 2) * k, (y + cs / 2) * k); if (!val) continue;
      const r = (cs / 2) * (0.45 + (0.55 * (val - 120)) / 135); if (r <= 0) continue;
      c.fillRect(ox + x + cs / 2 - r, oy + y + cs / 2 - r, r * 2, r * 2);
    }
  } else if (kind === 'drop') {
    c.fillStyle = lalande.signal; c.fillRect(0, 0, w, h);
    const fx = w * 0.62, y = ((step * 7) % (h + 40)) - 20;
    c.fillStyle = lalande.white; c.fillRect(fx - 4, y, 8, 12);
    c.fillStyle = lalande.cup;
    for (let a = 0; a < 6; a++) { const ang = a * 1.047 + t * 0.6; c.fillRect(fx + Math.cos(ang) * 16 - 5, h - 46 + Math.sin(ang) * 16 - 5, 10, 10); }
    c.fillStyle = lalande.cupRim; c.fillRect(fx - 6, h - 52, 12, 12);
  } else if (kind === 'tunnel') {
    // the piece itself, small: the same engine, the same dot grid and acids (owner, 2026-11-27)
    let eng = tunnels.get(cv); if (!eng) { eng = createTravesia(cv, 6); tunnels.set(cv, eng); }
    eng.frame(performance.now(), { cell: 6, ramp: 'todos', base: 1.4, reduce: step === 0 }, null);
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
      pin(c, x + tw / 2, y - 2, boletos.pins[(i * 5) % boletos.pins.length], 1.1);   // the piece's pins (owner, 2026-11-27)
    });
  } else if (kind === 'card') {
    grid(c, w, h);
    // each half turn brings the next city's card, not the same card's back (owner, 2026-11-27)
    const cards = (m.cards ?? []).filter((im) => im.naturalWidth); if (!cards.length) return;
    const a = t * 1.1, im = cards[Math.floor((a + Math.PI / 2) / Math.PI) % cards.length];
    const cw = 230 * Math.abs(Math.cos(a)), ch = 145;
    c.save(); c.translate(Math.min(w * 0.45, w - 140), h / 2); c.shadowColor = boletos.shadow; c.shadowOffsetY = 10; c.shadowBlur = 16; c.drawImage(im, -cw / 2, -ch / 2, cw, ch); c.restore();
  } else if (kind === 'book') {
    // the sketchbook closed; its cover opens once onto menta and lola, and it stays open (owner, 2026-11-27)
    grid(c, w, h);
    const [l, r] = m.pages ?? []; if (!l?.naturalWidth || !r?.naturalWidth) return;
    const ph = Math.min(h - 40, 190), pw = ph * (l.naturalWidth / l.naturalHeight), sp = Math.min(w / 2, w - pw - 24), y = (h - ph) / 2;
    const e = Math.min(1, Math.max(0, (step - 4) / 14)), turn = (1 - Math.cos(e * Math.PI)) / 2, k = Math.cos(turn * Math.PI);
    c.save(); c.shadowColor = boletos.shadow; c.shadowOffsetY = 6; c.shadowBlur = 12;
    if (turn > 0) c.drawImage(r, sp, y, pw, ph);                                   // lola, under the cover
    if (k > 0) { c.fillStyle = color.ink; c.fillRect(sp, y, pw * k, ph); }        // the cover, turning on the spine
    else c.drawImage(l, sp + pw * k, y, -pw * k, ph);                             // menta lands on the left
    c.restore();
    if (k > 0.35) { c.fillStyle = corkGrid.paper; c.font = `300 ${Math.round(ph * 0.13 * k)}px ${getComputedStyle(cv).fontFamily}`; c.textBaseline = 'top'; c.fillText('sketchbook', sp + 12 * k, y + 14, pw * k - 20); }
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
  } else {
    grid(c, w, h, color.dotOff);
  }
}
