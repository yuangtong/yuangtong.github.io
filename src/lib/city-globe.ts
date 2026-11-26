/**
 * The contact globe (src/lib/globe.ts), for the metro cards: the same dot grid
 * and land, every city with a card marked, the chosen one in blue and turned
 * to the middle. No route: the city is the point (owner, 2026-11-26).
 */
import { globe as C } from './tokens';
import { isLand } from './world-land';

export type GlobeCity = { city: string; lat: number; lon: number; labelLeft?: boolean };

const RAD = Math.PI / 180;

export function createCityGlobe(cv: HTMLCanvasElement, o: { cities: GlobeCity[]; font: string; reduce: boolean }) {
  let sel = 0, rot = -o.cities[0].lon * RAD, tilt = o.cities[0].lat * RAD, dragging = false;
  let target: { rot: number; tilt: number } | null = null;
  const pts: [number, number, boolean][] = [];
  for (let lat = -84; lat <= 84; lat += 2) {
    const n = Math.max(8, Math.round(180 * Math.cos(lat * RAD)));
    for (let k = 0; k < n; k++) { const lon = -180 + (k * 360) / n; pts.push([lat, lon, isLand(lat, lon)]); }
  }
  const project = (lat: number, lon: number, R: number, cx: number, cy: number) => {
    const la = lat * RAD, lo = lon * RAD + rot;
    const x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo), ct = Math.cos(tilt), st = Math.sin(tilt);
    return [cx + x * R, cy - (y * ct - z * st) * R, y * st + z * ct];
  };
  const mark = (ctx: CanvasRenderingContext2D, p: GlobeCity, R: number, cx: number, cy: number, on: boolean) => {
    const q = project(p.lat, p.lon, R, cx, cy); if (q[2] <= 0) return;
    const col = on ? C.me : C.you, s = on ? 12 : 8;
    ctx.fillStyle = col;
    if (!on || o.reduce || Math.floor(performance.now() / 500) % 2 === 0) ctx.fillRect(q[0] - s / 2, q[1] - s / 2, s, s);
    if (on) { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(q[0] - 9.5, q[1] - 9.5, 19, 19); }
    ctx.font = `500 13px ${o.font}`; ctx.textBaseline = 'middle';
    const tw = ctx.measureText(p.city).width, w = cv.clientWidth;
    // the label stays inside the canvas on narrow screens
    const lx = Math.max(2, Math.min(w - tw - 16, p.labelLeft ? q[0] - 28 - tw : q[0] + 14));
    ctx.fillStyle = col; ctx.fillRect(lx, q[1] - 11, tw + 14, 22);
    ctx.fillStyle = C.label; ctx.fillText(p.city, lx + 7, q[1] + 1);
  };
  const draw = () => {
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    const D = 2;
    if (cv.width !== w * D || cv.height !== h * D) { cv.width = w * D; cv.height = h * D; }
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(D, 0, 0, D, 0, 0); ctx.clearRect(0, 0, w, h);
    // the whole globe in view, with room for the labels
    const R = Math.min(w, h) * 0.45, cx = w / 2, cy = h / 2, land: number[][] = [];
    ctx.fillStyle = C.sea;
    for (const p of pts) {
      const q = project(p[0], p[1], R, cx, cy); if (q[2] <= 0.02) continue;
      if (p[2]) { land.push(q); continue; }
      const s = 0.9 * q[2] + 0.3; ctx.fillRect(q[0] - s / 2, q[1] - s / 2, s, s);
    }
    ctx.fillStyle = C.land;
    for (const q of land) { const s = 3.2 * q[2] + 0.8; ctx.beginPath(); ctx.arc(q[0], q[1], s / 2, 0, 6.2832); ctx.fill(); }
    o.cities.forEach((c, i) => { if (i !== sel) mark(ctx, c, R, cx, cy, false); });
    mark(ctx, o.cities[sel], R, cx, cy, true);
  };
  let raf = 0, dead = false;
  const loop = () => {
    if (dead) return;
    raf = requestAnimationFrame(loop);
    if (target && !dragging) {
      const dr = Math.atan2(Math.sin(target.rot - rot), Math.cos(target.rot - rot));
      if (o.reduce) { rot = target.rot; tilt = target.tilt; target = null; }
      else { rot += dr * 0.08; tilt += (target.tilt - tilt) * 0.08; if (Math.abs(dr) < 0.002) target = null; }
    } else if (!dragging && !o.reduce) rot += 0.0018;
    draw();
  };
  raf = requestAnimationFrame(loop);
  return {
    /** Turn the chosen city to the middle. */
    aim(i: number) { sel = i; const c = o.cities[i]; target = { rot: -c.lon * RAD, tilt: Math.max(-0.9, Math.min(0.9, c.lat * RAD)) }; },
    down(e: PointerEvent) {
      dragging = true; target = null;
      const sx = e.clientX, sy = e.clientY, r0 = rot, t0 = tilt;
      const mv = (ev: PointerEvent) => { rot = r0 + (ev.clientX - sx) * 0.008; tilt = Math.max(-0.9, Math.min(0.9, t0 + (ev.clientY - sy) * 0.006)); };
      const up = () => { dragging = false; window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    },
    destroy() { dead = true; cancelAnimationFrame(raf); },
  };
}
