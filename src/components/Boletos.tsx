'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoletosPage } from '@/content/types';
import { BOLETOS, BOLETO_COLOURS, boletoSrc, type Boleto } from '@/content/collections';
import { prefersReducedMotion } from '@/lib/dither';
import { boletos as T, corkGrid } from '@/lib/tokens';

/** The board is designed at 1440 x 900 and scaled to the width it gets. */
const BW = 1440, BH = 900, K = 0.3, CELL = 8;
type Mode = 'loose' | 'colour' | 'company' | 'price';
type Item = { x: number; y: number; r: number; z: number };
type Clip = { x: number; y: number; w: number; kind: string; col: string };
type Label = { x: number; y: number; w: number; text: string };

function rnd(s: number) { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); }
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
const soles = (n: number) => `S/ ${n.toFixed(2)}`;

/** A push pin, drawn (the owner's references, 2026-11-26). */
function Pin({ col, hidden }: { col: string; hidden: boolean }) {
  return (
    <svg className="bol-pin" viewBox="0 0 24 32" aria-hidden="true" style={{ opacity: hidden ? 0 : 1 }}>
      <g transform="rotate(-18 12 16)">
        <line x1="12" y1="20" x2="12" y2="31" stroke={T.needle} strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="12" cy="19" rx="8" ry="3.2" fill={col} />
        <path d="M8.6 7.5 H15.4 L16.6 19 H7.4 Z" fill={col} />
        <ellipse cx="12" cy="7" rx="7.6" ry="4.6" fill={col} />
        <ellipse cx="13" cy="19.6" rx="7" ry="2.2" fill={T.ink} opacity=".14" />
        <path d="M13.6 8.5 H15.4 L16.4 18.4 H14.2 Z" fill={T.ink} opacity=".12" />
        <rect x="9.4" y="9" width="1.7" height="9" rx=".8" fill={T.light} opacity=".4" />
        <ellipse cx="9.8" cy="5.6" rx="3.2" ry="1.6" fill={T.light} opacity=".55" />
      </g>
    </svg>
  );
}

/** A big clip holding a sorted column: a flat board clip or a binder clip. */
function ClipArt({ kind, col }: { kind: string; col: string }) {
  return kind === 'binder' ? (
    <svg viewBox="0 0 60 58" aria-hidden="true">
      <path d="M17 30 L21 5 Q22 1 26 1 H34 Q38 1 39 5 L43 30" fill="none" stroke={T.wire} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M21 30 L24 9 H36 L39 30" fill="none" stroke={T.wireLight} strokeWidth="1.6" />
      <path d="M5 27 H55 L51 57 H9 Z" fill={col} />
      <path d="M8 29 H52 L51.4 33 H8.6 Z" fill={T.light} opacity=".16" />
    </svg>
  ) : (
    <svg viewBox="0 0 100 46" aria-hidden="true">
      <path d="M37 16 V6 Q37 1 42 1 H58 Q63 1 63 6 V16 Z" fill={col} />
      <circle cx="50" cy="7" r="3.2" fill={corkGrid.paper} />
      <rect x="31" y="14" width="5" height="6" rx="1" fill={T.pivot} />
      <rect x="64" y="14" width="5" height="6" rx="1" fill={T.pivot} />
      <rect x="2" y="17" width="96" height="21" rx="3" fill={col} />
      <rect x="0" y="35" width="100" height="7" rx="2" fill={col} />
      <rect x="0" y="38.5" width="100" height="3.5" rx="1.5" fill={T.ink} opacity=".16" />
      <rect x="4" y="18.5" width="92" height="3" rx="1.5" fill={T.light} opacity=".4" />
    </svg>
  );
}

/** Scale a design-size stage to the width of its wrapper. */
function useStageScale() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / BW));
    ro.observe(el); setK(el.clientWidth / BW);
    return () => ro.disconnect();
  }, []);
  return { wrapRef, k };
}

/** The grey dot grid under the board, drawn once. */
function GridCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const ctx = cv.getContext('2d')!;
    ctx.fillStyle = corkGrid.paper; ctx.fillRect(0, 0, BW, BH); ctx.fillStyle = corkGrid.dot;
    for (let y = 4; y < BH; y += CELL) for (let x = 4; x < BW; x += CELL) if ((((x + y) / CELL) & 1) === 0) ctx.fillRect(x - 1, y - 1, 2, 2);
  }, []);
  return <canvas ref={ref} className="bol-grid" width={BW} height={BH} aria-hidden="true" />;
}

/**
 * Boletos de Lima (canvas "lab: boletos v2", 2026-11-26). The owner's tickets
 * pinned to the grid: drag one and it pins where you drop it; sort them into
 * columns, each held by a big clip; click one to open it with what it says.
 * From here, pasaje: the game where every ticket is money.
 */
export function Boletos({ page }: { page: BoletosPage }) {
  const [game, setGame] = useState(false);
  const swap = (on: boolean) => { setGame(on); window.scrollTo({ top: 0 }); };
  return game ? <Pasaje page={page} onBack={() => swap(false)} /> : <Board page={page} onPlay={() => swap(true)} />;
}

function Board({ page, onPlay }: { page: BoletosPage; onPlay: () => void }) {
  const { wrapRef, k } = useStageScale();
  const items = useRef<Item[]>(BOLETOS.map((_, i) => ({ x: 40 + rnd(i + 17) * 1280, y: 50 + rnd(i + 19) * 690, r: (rnd(i + 23) - 0.5) * 16, z: i + 1 })));
  const loose = useRef<Item[]>(items.current.map((t) => ({ ...t })));
  const top = useRef(BOLETOS.length + 1);
  const drag = useRef<{ i: number; dx: number; dy: number; sx: number; sy: number; moved: boolean } | null>(null);
  const [, redraw] = useState(0);
  const [mode, setMode] = useState<Mode>('loose');
  const [marks, setMarks] = useState<{ labels: Label[]; clips: Clip[] }>({ labels: [], clips: [] });
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const local = (e: React.PointerEvent) => { const r = wrapRef.current!.getBoundingClientRect(); return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; };
  const down = (e: React.PointerEvent, i: number) => {
    const p = local(e), t = items.current[i];
    drag.current = { i, dx: p.x - t.x, dy: p.y - t.y, sx: e.clientX, sy: e.clientY, moved: false };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return;
    if (!d.moved) { d.moved = true; items.current[d.i].z = ++top.current; setDragging(d.i); }
    const p = local(e), t = items.current[d.i]; t.x = p.x - d.dx; t.y = p.y - d.dy; redraw((n) => n + 1);
  };
  const up = () => {
    const d = drag.current; if (!d) return; drag.current = null;
    if (!d.moved) { setOpen(d.i); return; }
    // pinned again where it was dropped, on the grid's cells
    const t = items.current[d.i]; t.x = Math.round(t.x / CELL) * CELL; t.y = Math.round(t.y / CELL) * CELL;
    loose.current[d.i] = { ...t }; setDragging(null); setMode('loose'); setMarks({ labels: [], clips: [] });
  };

  const sort = (m: Mode) => {
    setMode(m);
    if (m === 'loose') { items.current = loose.current.map((t) => ({ ...t })); setMarks({ labels: [], clips: [] }); return; }
    const key = (b: Boleto) => (m === 'colour' ? b.colour : m === 'company' ? b.company : b.price == null ? '' : soles(b.price));
    const groups = new Map<string, number[]>();
    BOLETOS.forEach((b, i) => { const g = key(b); groups.set(g, [...(groups.get(g) ?? []), i]); });
    const names = [...groups.keys()].sort((a, b) => {
      if (m === 'colour') return BOLETO_COLOURS.indexOf(a) - BOLETO_COLOURS.indexOf(b);
      if (m === 'price') return (a === '' ? 1 : 0) - (b === '' ? 1 : 0) || parseFloat(a.slice(3)) - parseFloat(b.slice(3));
      return groups.get(b)!.length - groups.get(a)!.length || a.localeCompare(b);
    });
    const perBand = 12, bands = Math.ceil(names.length / perBand), top0 = 110, bandH = (BH - top0 - 30) / bands, colW = 1360 / Math.min(perBand, names.length);
    const maxH = Math.max(...BOLETOS.map((b) => b.h * K)), maxW = Math.max(...BOLETOS.map((b) => b.w * K));
    const labels: Label[] = [], clips: Clip[] = [];
    names.forEach((n, gi) => {
      const g = groups.get(n)!, x0 = 40 + (gi % perBand) * colW, y0 = top0 + Math.floor(gi / perBand) * bandH;
      const step = g.length > 1 ? Math.min(30, (bandH - maxH - 70) / (g.length - 1)) : 0;
      const text = m === 'colour' ? page.colours[n] ?? n : n === '' ? page.lightbox.noPrice : n;
      labels.push({ x: x0, y: y0 - 64, w: colW - 6, text: `${text} · ${g.length}` });
      const [kind, col] = T.clips[gi % T.clips.length], cw = kind === 'binder' ? Math.min(50, colW - 14) : Math.min(92, colW - 14);
      clips.push({ kind, col, w: cw, x: x0 + Math.min(colW - 10, maxW) / 2 - cw / 2, y: y0 - (kind === 'binder' ? 30 : 24) });
      g.forEach((i, ri) => { items.current[i] = { x: x0, y: y0 + ri * Math.max(6, step), r: 0, z: gi * 100 + ri + 1 }; });
    });
    setMarks({ labels, clips });
  };

  const modes: [Mode, string][] = [['loose', page.sort.loose], ['colour', page.sort.colour], ['company', page.sort.company], ['price', page.sort.price]];
  return (
    <section className="bol" aria-label={page.title}>
      <div className="bol__top">
        <div className="bol__head">
          <h1 className="h2">{page.title}</h1>
          <p className="lead">{page.lead}</p>
        </div>
        <div className="bol__play">
          <p className="bol__play-title">{page.play.title}</p>
          <p className="bol__play-text">{page.play.text}</p>
          <button type="button" className="btn btn--signal btn--sm" onClick={onPlay}>{page.play.cta} <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <div className="bol__bar">
        <div className="seg" role="group" aria-label={page.sort.label}>
          {modes.map(([m, l]) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => sort(m)}>{l}</button>)}
        </div>
        <p className="label">{mode === 'loose' ? page.hint.loose : page.hint.sorted}</p>
      </div>
      <div ref={wrapRef} className="bol__wrap" style={{ height: BH * k }}>
        <div className="bol__stage" style={{ transform: `scale(${k})` }} role="group" aria-label={page.boardLabel} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <GridCanvas />
          {marks.clips.map((c, i) => <div key={`c${i}`} className="bol-clip" style={{ width: c.w, transform: `translate(${c.x}px, ${c.y}px)` }}><ClipArt kind={c.kind} col={c.col} /></div>)}
          {marks.labels.map((l, i) => <span key={`l${i}`} className="bol-label" style={{ width: l.w, transform: `translate(${l.x}px, ${l.y}px)` }}>{l.text}</span>)}
          {BOLETOS.map((b, i) => {
            const t = items.current[i], dr = dragging === i;
            return (
              <button
                key={b.id} type="button" className={dr ? 'bol-t bol-t--drag' : 'bol-t'}
                aria-label={`${b.company}${b.price != null ? `, ${soles(b.price)}` : ''}${b.fare ? `, ${b.fare}` : ''}`}
                style={{ width: b.w * K, height: b.h * K, zIndex: dr ? 999 : t.z, transform: `translate(${t.x}px, ${t.y}px) rotate(${dr ? t.r * 0.4 : t.r}deg)` }}
                onPointerDown={(e) => down(e, i)} onClick={(e) => { if (e.detail === 0) setOpen(i); }}
              >
                <img src={boletoSrc(b.id)} alt="" draggable={false} />
                <Pin col={T.pins[Math.floor(rnd(i + 13) * T.pins.length)]} hidden={dr || mode !== 'loose'} />
              </button>
            );
          })}
        </div>
      </div>
      {open != null && <Lightbox page={page} i={open} go={setOpen} />}
    </section>
  );
}

/** One ticket large, with what it says. Escape closes; the arrows move. */
function Lightbox({ page, i, go }: { page: BoletosPage; i: number; go: (i: number | null) => void }) {
  const b = BOLETOS[i], L = page.lightbox, n = BOLETOS.length, closeRef = useRef<HTMLButtonElement>(null);
  const step = useCallback((d: number) => go((i + d + n) % n), [go, i, n]);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') go(null); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [go, step]);
  return (
    <div className="bol-lb" role="dialog" aria-modal="true" aria-label={`${L.label} ${b.id}`} onClick={() => go(null)}>
      <div className="bol-lb__img">
        <img src={boletoSrc(b.id)} alt={`${b.company}${b.price != null ? `, ${soles(b.price)}` : ''}`} />
      </div>
      <div className="bol-lb__info" onClick={(e) => e.stopPropagation()}>
        <p className="label">{b.id} / {String(i + 1).padStart(2, '0')} {L.of} {n}</p>
        <h2 className="bol-lb__title">{b.company}</h2>
        <dl className="bol-lb__rows">
          <div><dt className="label">{L.price}</dt><dd>{b.price != null ? soles(b.price) : L.noPrice}</dd></div>
          <div><dt className="label">{L.fare}</dt><dd>{b.fare || L.notPrinted}</dd></div>
          <div><dt className="label">{L.colour}</dt><dd>{page.colours[b.colour] ?? b.colour}</dd></div>
        </dl>
        <div className="bol-lb__nav">
          <button type="button" className="btn btn--ink btn--sm" aria-label={L.prev} onClick={() => step(-1)}>←</button>
          <button type="button" className="btn btn--ink btn--sm" aria-label={L.next} onClick={() => step(1)}>→</button>
          <button ref={closeRef} type="button" className="btn btn--ink btn--sm bol-lb__close" onClick={() => go(null)}>{L.close}</button>
        </div>
      </div>
    </div>
  );
}

/**
 * pasaje (canvas "lab: pasaje", 2026-11-26): every ticket is money. Tickets pop
 * up on the grid and go; click one to collect its fare. The dearer the ticket,
 * the less it stays, and the round quickens. Only the paper tickets play;
 * nothing takes money away. Motion steps at 12 fps, like the rest of the site.
 */
function Pasaje({ page, onBack }: { page: BoletosPage; onBack: () => void }) {
  const G = page.game, TIME = 30, KG = 0.36;
  const { wrapRef, k } = useStageScale();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ start: () => void; hit: (x: number, y: number) => void } | null>(null);
  const [hud, setHud] = useState({ phase: 'ready' as 'ready' | 'play' | 'over', left: TIME, money: 0, count: 0, note: '' });

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const reduce = prefersReducedMotion(), ctx = cv.getContext('2d')!, font = getComputedStyle(cv).fontFamily;
    const pool = BOLETOS.filter((b) => b.price != null && !b.electronic), ims = new Map<string, HTMLImageElement>();
    pool.forEach((b) => { const im = new Image(); im.src = boletoSrc(b.id); ims.set(b.id, im); });
    const grid = document.createElement('canvas'); grid.width = BW * 2; grid.height = BH * 2;
    { const g = grid.getContext('2d')!; g.scale(2, 2); g.fillStyle = corkGrid.paper; g.fillRect(0, 0, BW, BH); g.fillStyle = corkGrid.dot; for (let y = 4; y < BH; y += CELL) for (let x = 4; x < BW; x += CELL) if ((((x + y) / CELL) & 1) === 0) g.fillRect(x - 1, y - 1, 2, 2); }
    type Live = { b: Boleto; x: number; y: number; w: number; h: number; r: number; born: number; die: number; gone: number; took?: boolean };
    let live: Live[] = [], floats: { x: number; y: number; t: number; text: string }[] = [], phase: 'ready' | 'play' | 'over' = 'ready';
    let t0 = 0, money = 0, count = 0, nextAt = 0, seed = 1, tick = -1, lastHud = 0;
    const free = (x: number, y: number, w: number, h: number) => {
      if (x - w / 2 < 24 || x + w / 2 > BW - 24 || y - h / 2 < 24 || y + h / 2 > BH - 24) return false;
      return live.every((b) => Math.abs(b.x - x) > (b.w + w) / 2 + 12 || Math.abs(b.y - y) > (b.h + h) / 2 + 12);
    };
    const spawn = (now: number) => {
      const cand = pool.filter((b) => !live.some((l) => l.b === b)); if (!cand.length) return;
      const b = cand[Math.floor(rnd(seed++ * 3.1 + now) * cand.length)], w = b.w * KG, h = b.h * KG;
      for (let i = 0; i < 40; i++) {
        const x = 40 + rnd(seed++ * 7.7 + now) * (BW - 80), y = 40 + rnd(seed++ * 9.3 + now) * (BH - 80);
        if (!free(x, y, w, h)) continue;
        const el = (now - t0) / 1000 / TIME, life = Math.max(0.6, (2.1 - (b.price ?? 0) * 0.14) * (1 - el * 0.35));
        live.push({ b, x, y, w, h, r: (rnd(seed++) - 0.5) * 0.3, born: now, die: now + life * 1000, gone: 0 }); return;
      }
    };
    const finish = () => {
      phase = 'over'; live.forEach((b) => { if (!b.gone) b.gone = performance.now(); });
      let best: number | null = null; try { const v = localStorage.getItem('pasaje-best'); best = v ? parseFloat(v) : null; } catch { /* private mode */ }
      const rec = best == null || money > best; if (rec) try { localStorage.setItem('pasaje-best', money.toFixed(2)); } catch { /* private mode */ }
      setHud({ phase, left: 0, money, count, note: `${fill(G.result, { money: soles(money), n: count })}. ${rec ? G.best : fill(G.bestWas, { money: soles(best!) })}` });
    };
    api.current = {
      start() { live = []; floats = []; money = 0; count = 0; phase = 'play'; t0 = performance.now(); nextAt = t0 + 300; setHud({ phase, left: TIME, money, count, note: '' }); },
      hit(x, y) {
        if (phase !== 'play') return;
        for (let i = live.length - 1; i >= 0; i--) {
          const b = live[i]; if (b.gone) continue;
          const dx = x - b.x, dy = y - b.y, u = dx * Math.cos(-b.r) - dy * Math.sin(-b.r), v = dx * Math.sin(-b.r) + dy * Math.cos(-b.r);
          if (Math.abs(u) > b.w / 2 || Math.abs(v) > b.h / 2) continue;
          const now = performance.now(), val = b.b.price ?? 0; b.gone = now; b.took = true; money += val; count += 1;
          floats.push({ x: b.x, y: b.y - b.h / 2, t: now, text: `+${soles(val)}` });
          setHud((h) => ({ ...h, money, count, note: `${b.b.company}, ${b.b.fare}` }));
          return;
        }
      },
    };
    // at rest a few tickets lie on the grid, so the board reads before it plays
    [5, 12, 30, 44, 58, 66].forEach((n, i) => { const b = pool[n % pool.length]; live.push({ b, x: 460 + i * 140, y: 400 + (i % 2) * 150, w: b.w * KG, h: b.h * KG, r: (rnd(i + 3) - 0.5) * 0.3, born: -1e9, die: 1e15, gone: 0 }); });
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const s = Math.floor(now / (1000 / 12)); if (s === tick) return; tick = s;
      if (phase === 'play') {
        const left = TIME - (now - t0) / 1000;
        if (left <= 0) finish();
        else {
          if (now >= nextAt) { spawn(now); const el = (now - t0) / 1000 / TIME; nextAt = now + (520 - el * 220) * (0.7 + rnd(seed++) * 0.6); }
          live.forEach((b) => { if (!b.gone && now > b.die) b.gone = now; });
          if (now - lastHud > 100) { lastHud = now; setHud((h) => ({ ...h, left })); }
        }
      }
      live = live.filter((b) => !b.gone || now - b.gone < 340);
      floats = floats.filter((f) => now - f.t < 900);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(grid, 0, 0); ctx.setTransform(2, 0, 0, 2, 0, 0);
      for (const b of live) {
        const im = ims.get(b.b.id); if (!im?.naturalWidth) continue;
        const age = (now - b.born) / 1000; let sc = reduce ? 1 : age < 1 / 12 ? 0.6 : age < 2 / 12 ? 1.08 : 1, a = 1;
        if (b.gone) { const g = (now - b.gone) / 340; if (b.took) sc = 1 + Math.floor(g * 4) * 0.08; a = 1 - Math.floor(g * 4) / 4; }
        else if (b.die - now < 400) a = Math.floor((b.die - now) / 100) % 2 ? 1 : 0.55; // it blinks before it goes
        ctx.save(); ctx.globalAlpha = a; ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.scale(sc, sc);
        ctx.shadowColor = T.shadow; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 4;
        ctx.drawImage(im, -b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      }
      for (const f of floats) {
        const g = (now - f.t) / 900, y = f.y - 12 - Math.floor(g * 6) * 6;
        ctx.font = `500 20px ${font}`; const w = ctx.measureText(f.text).width, fx = Math.max(w / 2 + 12, Math.min(BW - 12 - w / 2, f.x));
        ctx.fillStyle = T.money; ctx.fillRect(fx - w / 2 - 8, y - 20, w + 16, 28);
        ctx.fillStyle = T.moneyText; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.fillText(f.text, fx, y - 6);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [G]);

  return (
    <section className="bol bol--game" aria-label={G.title}>
      <div className="bol__top">
        <div className="bol__head">
          <h1 className="h2">{G.title}</h1>
          <p className="lead">{G.lead}</p>
        </div>
        <button type="button" className="btn btn--line btn--sm" onClick={onBack}><span aria-hidden="true">←</span> {G.back}</button>
      </div>
      <div className="bol__bar bol__score">
        <div><span className="label">{G.time}</span><b data-low={hud.phase === 'play' && hud.left < 5}>{hud.left.toFixed(1)}</b></div>
        <div><span className="label">{G.collected}</span><b className="bol__money">{soles(hud.money)}</b></div>
        <div><span className="label">{G.tickets}</span><b>{hud.count}</b></div>
        <button type="button" className="btn btn--signal btn--sm" onClick={() => api.current?.start()}>{hud.phase === 'play' ? G.restart : hud.phase === 'over' ? G.again : G.start}</button>
      </div>
      <div ref={wrapRef} className="bol__wrap" style={{ height: BH * k }}>
        <canvas
          ref={cvRef} className="bol__game" width={BW * 2} height={BH * 2} role="img" aria-label={G.canvasLabel}
          onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); api.current?.hit((e.clientX - r.left) / r.width * BW, (e.clientY - r.top) / r.height * BH); }}
        />
      </div>
      <p className="label bol__note" aria-live="polite">{hud.phase === 'ready' ? G.ready : hud.note || (hud.phase === 'play' ? G.playing : '')}</p>
    </section>
  );
}
