'use client';

import { useEffect, useRef, useState } from 'react';
import type { CamaraPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { camaraInks, color, corkGrid, type CamaraInk } from '@/lib/tokens';

const CELL = 8;
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const GLY = ' .:-=+*#%@';
const SCR = '#%@&*+=01<>/\\';
const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
const TRAIL = 3200;
const FX: Effect[] = ['pixels', 'dither', 'glyphs', 'trail'];
const INKS = Object.keys(camaraInks) as CamaraInk[];
type Effect = 'pixels' | 'dither' | 'glyphs' | 'trail';
type Source = 'idle' | 'loading' | 'hand' | 'cursor';
type Pt = { x: number; y: number };
type HL = { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: { x: number; y: number }[][] }; setOptions: (o: { numHands: number }) => Promise<void>; close: () => void };
const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

/**
 * cámara (canvas "lab: cámara", 2026-11-26; owner's notes, 2026-11-27). A
 * webcam toy. The visitor turns the camera on and sees themselves, mirrored;
 * MediaPipe's hand landmarker reads one or two hands in the browser. A pinch
 * (landmarks 4 and 8) puts the pen down and the index tip paints the chosen
 * effect over the image (pixels, dither, glyphs, or the glowing trail), in an
 * ink from the site's palette; the photo is taken after 3, 2, 1. The camera can
 * also show only the hand (screened from its 21 points), and without a camera
 * the cursor draws. Nothing is sent or kept: frames stay in the browser.
 */
export function Camara({ page }: { page: CamaraPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Source>('idle');
  const [mirror, setMirror] = useState(true);
  const [two, setTwo] = useState(false);
  const [effect, setEffect] = useState<Effect>('pixels');
  const [ink, setInk] = useState<CamaraInk>('signal');
  const [pen, setPen] = useState(false);
  const [note, setNote] = useState('');
  const [count, setCount] = useState(0);
  const [top, setTop] = useState(0);
  const st = useRef({ source: 'idle' as Source, mirror: true, effect: 'pixels' as Effect, ink: 'signal' as CamaraInk, ptr: null as Pt | null, ptrDown: false, mouse: false, hands: [] as Pt[][], pens: [false, false], clear: false, clean: false });
  Object.assign(st.current, { source, mirror, effect, ink });
  const lm = useRef<HL | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const live = source === 'hand', image = live && mirror;

  // drawing: the mirror, the painted effect and the hands
  useEffect(() => {
    const root = rootRef.current, cv = cvRef.current, video = videoRef.current; if (!root || !cv || !video) return;
    setTop(root.getBoundingClientRect().top + window.scrollY);
    const reduce = prefersReducedMotion(), ctx = cv.getContext('2d')!, sc = document.createElement('canvas'), sx = sc.getContext('2d', { willReadFrequently: true })!;
    let GW = 0, GH = 0, paint = new Float32Array(0), seed = new Uint8Array(0), fxc = new Uint8Array(0), ikc = new Uint8Array(0), last: (Pt | null)[] = [null, null, null], lastPen = [false, false, false], step = -1, raf = 0;
    const fit = () => {
      const w = Math.ceil(cv.clientWidth / CELL), h = Math.ceil(cv.clientHeight / CELL); if (w === GW && h === GH) return;
      GW = w; GH = h; paint = new Float32Array(GW * GH).fill(-1); seed = new Uint8Array(GW * GH); fxc = new Uint8Array(GW * GH); ikc = new Uint8Array(GW * GH);
      cv.width = GW * CELL; cv.height = GH * CELL; sc.width = GW; sc.height = GH;
    };
    // every stroke keeps its own effect and ink
    const mark = (a: Pt, b: Pt, now: number) => {
      const S = st.current, img = S.source === 'hand' && S.mirror, f = FX.indexOf(img ? S.effect : 'trail'), k = INKS.indexOf(S.ink);
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4)), r = img && S.effect !== 'trail' ? 3 : 1;
      for (let i = 0; i <= n; i++) {
        const x = a.x + ((b.x - a.x) * i) / n, y = a.y + ((b.y - a.y) * i) / n;
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r + 1) continue;
          const cx = Math.floor(x / CELL) + dx, cy = Math.floor(y / CELL) + dy; if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) continue;
          paint[cy * GW + cx] = now; seed[cy * GW + cx] = Math.floor(Math.random() * 255); fxc[cy * GW + cx] = f; ikc[cy * GW + cx] = k;
        }
      }
    };
    // the video covers the canvas, mirrored
    const cover = (c: CanvasRenderingContext2D, W: number, H: number) => {
      const vw = video.videoWidth || 640, vh = video.videoHeight || 480, k = Math.max(W / vw, H / vh);
      c.save(); c.translate(W, 0); c.scale(-1, 1); c.drawImage(video, (W - vw * k) / 2, (H - vh * k) / 2, vw * k, vh * k); c.restore();
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const S = st.current, img = S.source === 'hand' && S.mirror && video.readyState >= 2;
      const fps = img ? 24 : 12, s = Math.floor(now / (1000 / fps)); if (s === step) return; step = s;
      fit();
      if (S.clear) { paint.fill(-1); S.clear = false; }
      const inkHex = camaraInks[S.ink], rgbs = INKS.map((k) => rgb(camaraInks[k]));
      // pens: each hand, or the cursor
      const tips: (Pt | null)[] = [], downs: boolean[] = [];
      if (S.source === 'hand') for (let h = 0; h < 2; h++) { tips.push(S.hands[h]?.[8] ?? null); downs.push(!!S.hands[h] && S.pens[h]); }
      // the pointer paints too: alone without a camera, and alongside the hands with one
      tips.push(S.ptr); downs.push(S.source === 'hand' ? S.mouse : S.ptrDown);
      tips.forEach((tip, h) => { if (downs[h] && tip) mark(last[h] && lastPen[h] ? last[h]! : tip, tip, now); last[h] = tip; lastPen[h] = downs[h]; });
      // the base: you, or the paper
      let px: Uint8ClampedArray | null = null;
      if (img) { cover(ctx, cv.width, cv.height); cover(sx, GW, GH); px = sx.getImageData(0, 0, GW, GH).data; }
      else {
        ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = corkGrid.dot; for (let y = 0; y < GH; y++) for (let x = (y & 1); x < GW; x += 2) ctx.fillRect(x * CELL + 3, y * CELL + 3, 2, 2);
      }
      // the hand screened from its points, when the image is not shown
      if (S.source === 'hand' && !S.mirror) {
        ctx.fillStyle = color.ink;
        for (const H of S.hands) H.forEach((p, i) => {
          const r = i === 0 ? 7 : 3.4, cx = p.x / CELL, cy = p.y / CELL;
          for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
            if (x < 0 || y < 0 || x >= GW || y >= GH) continue; const d = 1 - Math.hypot(x - cx, y - cy) / r;
            if (d > 0 && d * 0.7 * 16 > BAY[(y & 3) * 4 + (x & 3)]) ctx.fillRect(x * CELL + 2, y * CELL + 2, 4, 4);
          }
        });
      }
      // the painted cells
      ctx.font = `500 ${CELL}px ${getComputedStyle(cv).fontFamily}`; ctx.textBaseline = 'top';
      const tt = Math.floor(now / 80);
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const id = y * GW + x, b = paint[id]; if (b < 0) continue;
        const X = x * CELL, Y = y * CELL, age = now - b, cellInk = camaraInks[INKS[ikc[id]]], inkRgb = rgbs[ikc[id]];
        // an image effect without the image (only the hand, the cursor) shows as the trail
        const fx: Effect = FX[fxc[id]] !== 'trail' && px ? FX[fxc[id]] : 'trail';
        if (fx === 'trail') {
          if (age > TRAIL) { if (FX[fxc[id]] === 'trail') paint[id] = -1; continue; }
          if (age < 260 && !reduce) { ctx.fillStyle = color.ink; ctx.fillText(SCR[(seed[id] + tt) % SCR.length], X, Y); continue; }
          const cool = (age - 260) / (TRAIL - 260);
          if (cool < 0.45) { ctx.fillStyle = cellInk; ctx.fillRect(X, Y, CELL, CELL); continue; }
          if ((BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16 > (cool - 0.45) / 0.55) { ctx.fillStyle = cellInk; ctx.globalAlpha = 0.6; ctx.fillRect(X + 1, Y + 1, CELL - 2, CELL - 2); ctx.globalAlpha = 1; }
          continue;
        }
        if (!px) continue;
        if (fx === 'pixels') {
          // blocks of 2 x 2 cells take one colour, tinted toward the ink
          const bx = x & ~1, by = y & ~1, o = (by * GW + bx) * 4, t = 0.25;
          ctx.fillStyle = `rgb(${px[o] * (1 - t) + inkRgb[0] * t | 0},${px[o + 1] * (1 - t) + inkRgb[1] * t | 0},${px[o + 2] * (1 - t) + inkRgb[2] * t | 0})`;
          ctx.fillRect(X, Y, CELL, CELL); continue;
        }
        const o = id * 4, L = (0.299 * px[o] + 0.587 * px[o + 1] + 0.114 * px[o + 2]) / 255;
        ctx.fillStyle = corkGrid.paper; ctx.fillRect(X, Y, CELL, CELL);
        ctx.fillStyle = cellInk;
        if (fx === 'dither') { if ((1 - L) * 16 > BAY[(y & 3) * 4 + (x & 3)] + 0.5) ctx.fillRect(X, Y, CELL, CELL); }
        else ctx.fillText(GLY[Math.min(GLY.length - 1, Math.floor((1 - L) * GLY.length))], X, Y);
      }
      // the hands' points (left out of the photo)
      if (!S.clean) {
        if (S.source === 'hand') for (let h = 0; h < S.hands.length; h++) {
          const H = S.hands[h];
          ctx.strokeStyle = img ? corkGrid.paper : color.quiet; ctx.lineWidth = 1;
          for (const [a, c] of BONES) { ctx.beginPath(); ctx.moveTo(H[a].x, H[a].y); ctx.lineTo(H[c].x, H[c].y); ctx.stroke(); }
          H.forEach((p, i) => { const on = i === 4 || i === 8, z = on ? 8 : 4; ctx.fillStyle = on && S.pens[h] ? inkHex : img ? corkGrid.paper : color.ink; ctx.fillRect(p.x - z / 2, p.y - z / 2, z, z); });
        }
        if (S.ptr && (S.source === 'cursor' || S.mouse)) { ctx.strokeStyle = S.ptrDown ? inkHex : color.ink; ctx.strokeRect(S.ptr.x - 7.5, S.ptr.y - 7.5, 15, 15); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // the hands: one detection per new video frame
  useEffect(() => {
    if (source !== 'hand') return;
    const video = videoRef.current, cv = cvRef.current; if (!video || !cv) return;
    let raf = 0, lastT = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const L = lm.current; if (!L || document.hidden || video.readyState < 2 || video.currentTime === lastT) return;
      lastT = video.currentTime;
      const found = L.detectForVideo(video, performance.now()).landmarks;
      const W = cv.clientWidth, H = cv.clientHeight, vw = video.videoWidth || 640, vh = video.videoHeight || 480, k = Math.max(W / vw, H / vh), ox = (W - vw * k) / 2, oy = (H - vh * k) / 2;
      const hands = found.slice(0, 2).map((hand) => hand.map((p) => ({ x: W - (ox + p.x * vw * k), y: oy + p.y * vh * k })));
      const pens = hands.map((pts, h) => {
        // the pinch, in proportion to the hand, with some slack so the pen does not flicker
        const size = Math.hypot(pts[0].x - pts[9].x, pts[0].y - pts[9].y) || 1, gap = Math.hypot(pts[4].x - pts[8].x, pts[4].y - pts[8].y) / size;
        return st.current.pens[h] ? gap < 0.45 : gap < 0.3;
      });
      st.current.hands = hands; st.current.pens = [pens[0] ?? false, pens[1] ?? false];
      const any = st.current.pens[0] || st.current.pens[1]; if (any !== st.current.ptrDown) { st.current.ptrDown = any; setPen(any); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [source]);

  useEffect(() => { lm.current?.setOptions({ numHands: two ? 2 : 1 }).catch(() => {}); }, [two, source]);
  useEffect(() => () => { stream.current?.getTracks().forEach((t) => t.stop()); lm.current?.close(); }, []);

  // the photo: 3, 2, 1, a clean frame, and it downloads
  useEffect(() => {
    if (!count) return;
    const id = setTimeout(() => {
      if (count > 1) { setCount(count - 1); return; }
      st.current.clean = true;
      setTimeout(() => {
        cvRef.current?.toBlob((b) => {
          st.current.clean = false; setCount(0); if (!b) return;
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `camara-${Date.now()}.png`;
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); setNote(page.saved);
        }, 'image/png');
      }, 120);
    }, 1000);
    return () => clearTimeout(id);
  }, [count, page.saved]);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setNote(page.noCamera); setSource('cursor'); return; }
    setSource('loading'); setNote(page.loading);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      stream.current = s;
      const v = videoRef.current!; v.srcObject = s; await v.play();
      if (!lm.current) {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks('/lab/camara/wasm');
        const make = (delegate: 'GPU' | 'CPU') => HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: '/lab/camara/hand_landmarker.task', delegate }, runningMode: 'VIDEO', numHands: two ? 2 : 1 });
        lm.current = (await make('GPU').catch(() => make('CPU'))) as unknown as HL;
      }
      setNote(''); st.current.clear = true; setSource('hand');
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
      setNote((e as DOMException)?.name === 'NotAllowedError' ? page.denied : page.noCamera); setSource('cursor');
    }
  };
  const useCursor = () => {
    stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null;
    st.current.hands = []; st.current.pens = [false, false]; st.current.ptrDown = false; st.current.clear = true; setPen(false); setNote(''); setSource('cursor');
  };
  const local = (e: React.PointerEvent): Pt => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const effects: Effect[] = ['pixels', 'dither', 'glyphs', 'trail'];

  return (
    <section ref={rootRef} className="camara" aria-label={page.title} style={{ height: `calc(100svh - ${top}px)` }}>
      <canvas
        ref={cvRef} className="camara__cv" role="img" aria-label={image ? page.canvasMirror : live ? page.canvasHand : page.canvasCursor}
        onPointerDown={(e) => { if (source !== 'cursor' && source !== 'hand') return; st.current.ptr = local(e); if (source === 'hand') st.current.mouse = true; else { st.current.ptrDown = true; setPen(true); } e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { st.current.ptr = local(e); }}
        onPointerUp={() => { st.current.mouse = false; if (source !== 'cursor') return; st.current.ptrDown = false; setPen(false); }}
      />
      <video ref={videoRef} className="camara__video" playsInline muted aria-hidden="true" />

      {(source === 'idle' || source === 'loading') && (
        <div className="camara__gate" role="dialog" aria-label={page.gate.title}>
          <h1 className="camara__gate-title">{page.gate.title}</h1>
          <p className="camara__gate-text">{page.gate.text}</p>
          <div className="camara__actions">
            <button type="button" className="btn btn--signal btn--sm" onClick={startCamera} disabled={source === 'loading'}>{source === 'loading' ? page.loading : page.gate.camera} <span aria-hidden="true">→</span></button>
            <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.gate.cursor}</button>
          </div>
        </div>
      )}

      {(live || source === 'cursor') && (
        <>
          <div className="camara__state" aria-live="polite">
            <span className="label">{live ? page.sourceHand : page.sourceCursor}</span>
            <span className="label" data-on={pen}>{pen ? page.penDown : page.penUp}</span>
          </div>
          <div className="camara__panel">
            <div className="camara__head">
              <h1 className="camara__title">{page.title}</h1>
              <p className="camara__lead">{page.lead}</p>
            </div>
            {note && <p className="label camara__note" role="status">{note}</p>}
            <div className="camara__controls">
              {live && (
                <div role="group" aria-label={page.view.label} className="camara__group">
                  <span className="label">{page.view.label}</span>
                  <button type="button" className="camara__seg" aria-pressed={mirror} onClick={() => setMirror(true)}>{page.view.mirror}</button>
                  <button type="button" className="camara__seg" aria-pressed={!mirror} onClick={() => setMirror(false)}>{page.view.hand}</button>
                </div>
              )}
              {live && (
                <div role="group" aria-label={page.hands.label} className="camara__group">
                  <span className="label">{page.hands.label}</span>
                  <button type="button" className="camara__seg" aria-pressed={!two} onClick={() => setTwo(false)}>{page.hands.one}</button>
                  <button type="button" className="camara__seg" aria-pressed={two} onClick={() => setTwo(true)}>{page.hands.two}</button>
                </div>
              )}
              {image && (
                <div role="group" aria-label={page.effect.label} className="camara__group">
                  <span className="label">{page.effect.label}</span>
                  {effects.map((f) => <button key={f} type="button" className="camara__seg" aria-pressed={effect === f} onClick={() => setEffect(f)}>{page.effect[f]}</button>)}
                </div>
              )}
              <div role="group" aria-label={page.colour.label} className="camara__group">
                <span className="label">{page.colour.label}</span>
                {(Object.keys(camaraInks) as CamaraInk[]).map((k) => (
                  <button key={k} type="button" className="camara__ink" aria-pressed={ink === k} aria-label={page.colour.names[k]} title={page.colour.names[k]} style={{ background: camaraInks[k] }} onClick={() => setInk(k)} />
                ))}
              </div>
            </div>
            <div className="camara__actions">
              <button type="button" className="btn btn--signal btn--sm" onClick={() => { setNote(''); setCount(3); }} disabled={count > 0}>{page.photo}</button>
              <button type="button" className="btn btn--line btn--sm" onClick={() => { st.current.clear = true; }}>{page.clear}</button>
              {live
                ? <button type="button" className="btn btn--line btn--sm" onClick={useCursor}>{page.stop}</button>
                : <button type="button" className="btn btn--line btn--sm" onClick={startCamera}>{page.camera}</button>}
            </div>
          </div>
          <ol className="camara__how">
            {page.how.map((h, i) => <li key={h}><span className="label">{String(i + 1).padStart(2, '0')}</span> {h}</li>)}
          </ol>
        </>
      )}
      {count > 0 && <p className="camara__count" aria-live="assertive">{count}</p>}
    </section>
  );
}
