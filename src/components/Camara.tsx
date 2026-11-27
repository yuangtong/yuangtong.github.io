'use client';

import { useEffect, useRef, useState } from 'react';
import type { CamaraPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { color, corkGrid } from '@/lib/tokens';

const CELL = 8;
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const GLY = '#%@&*+=01<>/\\';
const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
type Under = 'off' | 'dots' | 'glyphs';
type Source = 'idle' | 'loading' | 'hand' | 'cursor';
type Pt = { x: number; y: number };
type HL = { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: { x: number; y: number }[][] }; close: () => void };

/**
 * cámara (canvas "lab: cámara", 2026-11-26; docs/LAB.md). The camera as an
 * instrument: MediaPipe's hand landmarker reads one hand in the visitor's
 * browser. A pinch (thumb tip, 4, to index tip, 8) puts the pen down and the
 * index tip leaves a trail of glyphs that scramble, glow in signal blue and
 * cool back into the paper; an open hand lifts it. Underneath, the hand is
 * screened from its 21 points (dots or glyphs), never from the camera image.
 * MediaPipe and its model load only when the camera is turned on, from this
 * site; no frame leaves the device. Without a camera, the cursor draws.
 */
export function Camara({ page }: { page: CamaraPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Source>('idle');
  const [under, setUnder] = useState<Under>('dots');
  const [long, setLong] = useState(true);
  const [pen, setPen] = useState(false);
  const [note, setNote] = useState('');
  const [top, setTop] = useState(0);
  const st = useRef({ source: 'idle' as Source, under: 'dots' as Under, long: true, ptr: null as Pt | null, ptrDown: false, hand: null as Pt[] | null, pen: false });
  st.current.source = source; st.current.under = under; st.current.long = long;
  const lm = useRef<HL | null>(null);
  const stream = useRef<MediaStream | null>(null);

  // drawing: the trail and the screened hand, at 12 fps
  useEffect(() => {
    const root = rootRef.current, cv = cvRef.current; if (!root || !cv) return;
    setTop(root.getBoundingClientRect().top + window.scrollY);
    const reduce = prefersReducedMotion(), ctx = cv.getContext('2d')!;
    let GW = 0, GH = 0, born = new Float32Array(0), seed = new Uint8Array(0), last: Pt | null = null, lastPen = false, step = -1, raf = 0;
    const fit = () => {
      const w = Math.ceil(cv.clientWidth / CELL), h = Math.ceil(cv.clientHeight / CELL); if (w === GW && h === GH) return;
      GW = w; GH = h; born = new Float32Array(GW * GH).fill(-1); seed = new Uint8Array(GW * GH); cv.width = GW * CELL; cv.height = GH * CELL;
    };
    const mark = (a: Pt, b: Pt, now: number) => {
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4));
      for (let i = 0; i <= n; i++) {
        const x = a.x + ((b.x - a.x) * i) / n, y = a.y + ((b.y - a.y) * i) / n;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (dx && dy && Math.random() < 0.5) continue;
          const cx = Math.floor(x / CELL) + dx, cy = Math.floor(y / CELL) + dy; if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) continue;
          born[cy * GW + cx] = now; seed[cy * GW + cx] = Math.floor(Math.random() * 255);
        }
      }
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const s = Math.floor(now / (1000 / 12)); if (s === step) return; step = s;
      fit();
      const S = st.current, H = S.source === 'hand' ? S.hand : null;
      const down = S.source === 'hand' ? S.pen && !!H : S.ptrDown, tip = S.source === 'hand' ? (H ? H[8] : null) : S.ptr;
      if (down && tip) mark(last && lastPen ? last : tip, tip, now);
      last = tip; lastPen = down;
      const life = S.long ? 3200 : 1400, dens = new Float32Array(GW * GH);
      if (H && S.under !== 'off') {
        H.forEach((p, i) => {
          const r = i === 0 ? 7 : 3.4, cx = p.x / CELL, cy = p.y / CELL;
          for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
            if (x < 0 || y < 0 || x >= GW || y >= GH) continue; const d = 1 - Math.hypot(x - cx, y - cy) / r; if (d > 0) dens[y * GW + x] = Math.min(1, dens[y * GW + x] + d * 0.7);
          }
        });
      }
      ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = `500 ${CELL}px ${getComputedStyle(cv).fontFamily}`; ctx.textBaseline = 'top';
      const tt = Math.floor(now / 80);
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const id = y * GW + x, X = x * CELL, Y = y * CELL, b = born[id], age = b < 0 ? 1e9 : now - b;
        if (age < life) {
          if (age < 260 && !reduce) { ctx.fillStyle = color.ink; ctx.fillText(GLY[(seed[id] + tt) % GLY.length], X, Y); continue; }   // it scrambles
          const cool = (age - 260) / (life - 260), th = (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
          if (cool < 0.45) { ctx.fillStyle = color.signal; ctx.fillRect(X, Y, CELL, CELL); continue; }                                // it glows
          if (th > (cool - 0.45) / 0.55) { ctx.fillStyle = cool < 0.7 ? color.signal : color.echo; ctx.fillRect(X + 1, Y + 1, CELL - 2, CELL - 2); continue; } // and cools
        }
        const dv = dens[id];
        if (dv > 0.05 && dv * 16 > BAY[(y & 3) * 4 + (x & 3)]) {
          ctx.fillStyle = color.ink;
          if (S.under === 'glyphs') ctx.fillText(GLY[(x * 7 + y * 3) % GLY.length], X, Y); else ctx.fillRect(X + 2, Y + 2, 4, 4);
          continue;
        }
        if (((x + y) & 1) === 0) { ctx.fillStyle = corkGrid.dot; ctx.fillRect(X + 3, Y + 3, 2, 2); }
      }
      if (H) {
        ctx.strokeStyle = color.quiet; ctx.lineWidth = 1;
        for (const [a, c] of BONES) { ctx.beginPath(); ctx.moveTo(H[a].x, H[a].y); ctx.lineTo(H[c].x, H[c].y); ctx.stroke(); }
        H.forEach((p, i) => { const on = i === 4 || i === 8, z = on ? 8 : 4; ctx.fillStyle = on && S.pen ? color.signal : color.ink; ctx.fillRect(p.x - z / 2, p.y - z / 2, z, z); });
      } else if (tip && S.source === 'cursor') { ctx.strokeStyle = down ? color.signal : color.ink; ctx.strokeRect(tip.x - 7.5, tip.y - 7.5, 15, 15); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // the hand: one detection per new video frame
  useEffect(() => {
    if (source !== 'hand') return;
    const video = videoRef.current, cv = cvRef.current; if (!video || !cv) return;
    let raf = 0, lastT = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const L = lm.current; if (!L || document.hidden || video.readyState < 2 || video.currentTime === lastT) return;
      lastT = video.currentTime;
      const hand = L.detectForVideo(video, performance.now()).landmarks[0];
      if (!hand) { st.current.hand = null; if (st.current.pen) { st.current.pen = false; setPen(false); } return; }
      // cover the canvas with the video, mirrored like a mirror
      const W = cv.clientWidth, H = cv.clientHeight, vw = video.videoWidth || 640, vh = video.videoHeight || 480, k = Math.max(W / vw, H / vh), ox = (W - vw * k) / 2, oy = (H - vh * k) / 2;
      const pts = hand.map((p) => ({ x: W - (ox + p.x * vw * k), y: oy + p.y * vh * k }));
      st.current.hand = pts;
      // the pinch, in proportion to the hand, with some slack so the pen does not flicker
      const size = Math.hypot(pts[0].x - pts[9].x, pts[0].y - pts[9].y) || 1, gap = Math.hypot(pts[4].x - pts[8].x, pts[4].y - pts[8].y) / size;
      const was = st.current.pen, now = was ? gap < 0.45 : gap < 0.3;
      if (now !== was) { st.current.pen = now; setPen(now); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [source]);

  useEffect(() => () => { stream.current?.getTracks().forEach((t) => t.stop()); lm.current?.close(); }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setNote(page.noCamera); setSource('cursor'); return; }
    setSource('loading'); setNote(page.loading);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      stream.current = s;
      const v = videoRef.current!; v.srcObject = s; await v.play();
      if (!lm.current) {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks('/lab/camara/wasm');
        const make = (delegate: 'GPU' | 'CPU') => HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: '/lab/camara/hand_landmarker.task', delegate }, runningMode: 'VIDEO', numHands: 1 });
        lm.current = (await make('GPU').catch(() => make('CPU'))) as unknown as HL;
      }
      setNote(''); setSource('hand');
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
      setNote((e as DOMException)?.name === 'NotAllowedError' ? page.denied : page.noCamera); setSource('cursor');
    }
  };
  const useCursor = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; st.current.hand = null; st.current.pen = false; setPen(false); setNote(''); setSource('cursor'); };
  const local = (e: React.PointerEvent): Pt => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const live = source === 'hand';

  return (
    <section ref={rootRef} className="camara" aria-label={page.title} style={{ height: `calc(100svh - ${top}px)` }}>
      <canvas
        ref={cvRef} className="camara__cv" role="img" aria-label={live ? page.canvasHand : page.canvasCursor}
        onPointerDown={(e) => { if (source === 'hand') return; if (source === 'idle') setSource('cursor'); st.current.ptr = local(e); st.current.ptrDown = true; setPen(true); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { st.current.ptr = local(e); }}
        onPointerUp={() => { if (source === 'hand') return; st.current.ptrDown = false; setPen(false); }} onPointerLeave={() => { if (source === 'hand') return; st.current.ptrDown = false; setPen(false); }}
      />
      <video ref={videoRef} className="camara__video" playsInline muted aria-hidden="true" />
      <div className="camara__state" aria-live="polite">
        <span className="label">{live ? page.sourceHand : page.sourceCursor}</span>
        <span className="label" data-on={pen}>{pen ? page.penDown : page.penUp}</span>
      </div>
      <div className="camara__panel">
        <div className="camara__head">
          <h1 className="camara__title">{page.title}</h1>
          <p className="camara__lead">{page.lead}</p>
        </div>
        <p className="label camara__privacy">{page.privacy}</p>
        <div className="camara__actions">
          {live
            ? <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.stop}</button>
            : <button type="button" className="btn btn--signal btn--sm" onClick={startCamera} disabled={source === 'loading'}>{source === 'loading' ? page.loading : page.start} <span aria-hidden="true">→</span></button>}
          {!live && <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.cursor}</button>}
        </div>
        {note && <p className="label camara__note" role="status">{note}</p>}
        <div className="camara__controls">
          <div role="group" aria-label={page.under.label} className="camara__group">
            <span className="label">{page.under.label}</span>
            {(['off', 'dots', 'glyphs'] as Under[]).map((u) => <button key={u} type="button" className="camara__seg" aria-pressed={under === u} onClick={() => setUnder(u)}>{page.under[u]}</button>)}
          </div>
          <div role="group" aria-label={page.trail.label} className="camara__group">
            <span className="label">{page.trail.label}</span>
            <button type="button" className="camara__seg" aria-pressed={!long} onClick={() => setLong(false)}>{page.trail.short}</button>
            <button type="button" className="camara__seg" aria-pressed={long} onClick={() => setLong(true)}>{page.trail.long}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
