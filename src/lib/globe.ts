/**
 * Contact globe (design G8, contacto v2): a dot grid wrapped on a sphere, land
 * from Natural Earth, a great-circle arc in dots from Lima to the visitor's
 * time zone. The visitor's place comes from the time zone; no location asked.
 */
import { globe as C } from './tokens';
import { isLand } from './world-land';

export type Place = { lat: number; lon: number; tz: string };
export const LIMA: Place = { lat: -12.05, lon: -77.04, tz: 'America/Lima' };

/** Time zone -> an approximate point. Names live in content. */
const TZ: Record<string, [number, number]> = {
  'America/Lima': [-12.05, -77.04], 'America/Bogota': [4.7, -74.1], 'America/Mexico_City': [19.4, -99.1],
  'America/Santiago': [-33.4, -70.6], 'America/Argentina/Buenos_Aires': [-34.6, -58.4], 'America/Sao_Paulo': [-23.5, -46.6],
  'America/Caracas': [10.5, -66.9], 'America/Guayaquil': [-2.2, -79.9], 'America/La_Paz': [-16.5, -68.1],
  'America/New_York': [40.7, -74.0], 'America/Chicago': [41.9, -87.6], 'America/Denver': [39.7, -105.0],
  'America/Los_Angeles': [34.1, -118.2], 'America/Toronto': [43.7, -79.4], 'America/Panama': [9.0, -79.5],
  'Europe/Madrid': [40.4, -3.7], 'Europe/London': [51.5, -0.1], 'Europe/Paris': [48.9, 2.35],
  'Europe/Berlin': [52.5, 13.4], 'Europe/Rome': [41.9, 12.5], 'Europe/Amsterdam': [52.4, 4.9], 'Europe/Lisbon': [38.7, -9.1],
  'Asia/Tokyo': [35.7, 139.7], 'Asia/Shanghai': [31.2, 121.5], 'Asia/Seoul': [37.6, 127.0], 'Asia/Kolkata': [19.1, 72.9],
  'Asia/Singapore': [1.35, 103.8], 'Asia/Dubai': [25.2, 55.3], 'Australia/Sydney': [-33.9, 151.2],
};

export function visitorPlace(): Place {
  let tz = LIMA.tz;
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch { /* keep Lima */ }
  if (TZ[tz]) return { lat: TZ[tz][0], lon: TZ[tz][1], tz };
  const off = -new Date().getTimezoneOffset() / 60;
  return { lat: 20, lon: Math.max(-170, Math.min(170, off * 15)), tz };
}

export function clockIn(tz: string) {
  try { return new Intl.DateTimeFormat('es-PE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }
  catch { return '--:--'; }
}

const RAD = Math.PI / 180;
const vec = (p: { lat: number; lon: number }) => { const la = p.lat * RAD, lo = p.lon * RAD; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; };

export function createGlobe(cv: HTMLCanvasElement, o: { you: Place; meLabel: string; youLabel: string; font: string; reduce: boolean }) {
  const same = Math.abs(o.you.lat - LIMA.lat) < 1 && Math.abs(o.you.lon - LIMA.lon) < 1;
  // start turned so that Lima and the visitor both face us
  let mid = (LIMA.lon + o.you.lon) / 2;
  if (Math.abs(LIMA.lon - o.you.lon) > 180) mid += 180;
  let rot = -mid * RAD, tilt = 0.18, dragging = false;
  const pts: [number, number, boolean][] = [];
  // rows of equal spacing, fewer dots near the poles
  for (let lat = -84; lat <= 84; lat += 2) {
    const n = Math.max(8, Math.round(180 * Math.cos(lat * RAD)));
    for (let k = 0; k < n; k++) { const lon = -180 + (k * 360) / n; pts.push([lat, lon, isLand(lat, lon)]); }
  }
  const project = (lat: number, lon: number, R: number, cx: number, cy: number, lift = 1) => {
    const la = lat * RAD, lo = lon * RAD + rot, r = R * lift;
    const x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    return [cx + x * r, cy - (y * ct - z * st) * r, y * st + z * ct];
  };
  const mark = (ctx: CanvasRenderingContext2D, p: Place, R: number, cx: number, cy: number, label: string, col: string, blink: boolean) => {
    const q = project(p.lat, p.lon, R, cx, cy); if (q[2] <= 0) return;
    ctx.fillStyle = col;
    if (!blink || o.reduce || Math.floor(performance.now() / 500) % 2 === 0) ctx.fillRect(q[0] - 6, q[1] - 6, 12, 12);
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(q[0] - 9.5, q[1] - 9.5, 19, 19);
    ctx.font = `500 13px ${o.font}`; ctx.textBaseline = 'middle';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = col; ctx.fillRect(q[0] + 16, q[1] - 11, tw + 14, 22);
    ctx.fillStyle = C.label; ctx.fillText(label, q[0] + 23, q[1] + 1);
  };
  const draw = () => {
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    const D = 2;
    if (cv.width !== w * D || cv.height !== h * D) { cv.width = w * D; cv.height = h * D; }
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(D, 0, 0, D, 0, 0); ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
    ctx.fillStyle = C.sea;
    const land: number[][] = [];
    for (const p of pts) {
      const q = project(p[0], p[1], R, cx, cy); if (q[2] <= 0.02) continue;
      if (p[2]) { land.push(q); continue; }
      const s = 0.9 * q[2] + 0.3; ctx.fillRect(q[0] - s / 2, q[1] - s / 2, s, s);
    }
    ctx.fillStyle = C.land;
    for (const q of land) { const s = 3.2 * q[2] + 0.8; ctx.beginPath(); ctx.arc(q[0], q[1], s / 2, 0, 6.2832); ctx.fill(); }
    if (!same) {
      // a great circle from Lima to the visitor, lifted off the ground, in dots
      const a = vec(LIMA), b = vec(o.you), om = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
      const t = o.reduce ? -1 : (performance.now() / 1000) % 2, N = 48;
      for (let i = 0; i <= N; i++) {
        const f = i / N, s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om);
        const p = [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
        const q = project(Math.asin(p[1]) / RAD, Math.atan2(p[0], p[2]) / RAD, R, cx, cy, 1 + 0.16 * Math.sin(f * Math.PI));
        if (q[2] <= -0.05) continue;
        const on = Math.abs(f - t / 2) < 0.06, sz = on ? 5 : 2.6;
        ctx.fillStyle = on ? C.arcHead : C.arc;
        ctx.fillRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz);
      }
    }
    mark(ctx, LIMA, R, cx, cy, o.meLabel, C.me, true);
    if (!same) mark(ctx, o.you, R, cx, cy, o.youLabel, C.you, false);
  };
  let raf = 0, dead = false;
  const loop = () => {
    if (dead) return;
    raf = requestAnimationFrame(loop);
    if (!dragging && !o.reduce) rot += 0.0035;
    draw();
  };
  raf = requestAnimationFrame(loop);
  return {
    same,
    down(e: PointerEvent) {
      dragging = true;
      const sx = e.clientX, sy = e.clientY, r0 = rot, t0 = tilt;
      const k = cv.getBoundingClientRect().width / cv.offsetWidth || 1;
      const mv = (ev: PointerEvent) => { rot = r0 + ((ev.clientX - sx) / k) * 0.008; tilt = Math.max(-0.9, Math.min(0.9, t0 + ((ev.clientY - sy) / k) * 0.006)); };
      const up = () => { dragging = false; window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    },
    destroy() { dead = true; cancelAnimationFrame(raf); },
  };
}
