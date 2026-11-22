'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ArchivePage, ArchivePalette, ArchivePhoto } from '@/content/types';
import { drawTrama, getImage } from '@/lib/archivo-trama';
import { BAYER, prefersReducedMotion } from '@/lib/dither';
import { color } from '@/lib/tokens';
import { useCarcoma } from './Carcoma';
import { LimaClock } from './LimaClock';
import { PixelIcon } from './PixelIcon';

type Look = { cell: number; palette: ArchivePalette };
type Win = { id: string; kind: 'photo' | 'folder' | 'txt'; ph?: string; serie?: string; x: number; y: number; min: boolean; max: boolean };
type State = {
  big: boolean; dw: number; dh: number;
  look: Record<string, Look>; spot: Record<string, [number, number]>;
  stack: string[]; wins: Win[]; order: string[];
  sel: string | null; start: boolean; msg: string | null; msgFor: string | null;
};

const CELLS = [2, 4, 8, 16, 0] as const;
const PAL_ORDER: ArchivePalette[] = ['tinta', 'azul', 'rojo', 'acida', 'color'];
const TASK_H = 40, CHROME = 128;

/**
 * archivo.exe (design G8, Archivo-v2): a 1998 desktop over teal for photos of
 * 2017, opened inside the lab without taking the whole screen. Prints can be
 * dragged; each photo opens in its window with its cell and palette.
 */
export function Archivo({ page, backHref }: { page: ArchivePage; backHref: string }) {
  const go = useCarcoma();
  const ui = page.ui, PH = page.photos;
  const ph = useCallback((id: string) => PH.find((p) => p.id === id) as ArchivePhoto, [PH]);
  const [st, setSt] = useState<State>(() => ({
    big: false, dw: 1200, dh: 700,
    look: Object.fromEntries(PH.map((p) => [p.id, { cell: p.cell, palette: p.palette }])),
    spot: Object.fromEntries(PH.map((p) => [p.id, p.spot])),
    stack: PH.map((p) => p.id),
    wins: PH.length ? [{ id: 'w-' + PH[Math.min(5, PH.length - 1)].id, kind: 'photo', ph: PH[Math.min(5, PH.length - 1)].id, x: 300, y: 70, min: false, max: false }] : [],
    order: PH.length ? ['w-' + PH[Math.min(5, PH.length - 1)].id] : [],
    sel: null, start: false, msg: null, msgFor: null,
  }));
  const stRef = useRef(st);
  stRef.current = st;
  const patch = (o: Partial<State>) => setSt((s) => ({ ...s, ...o }));

  const deskRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const keys = useRef(new WeakMap<HTMLElement, string>());
  const anim = useRef(new Map<string, number>());
  const msgT = useRef(0);
  const reg = (k: string) => (el: HTMLElement | null) => { if (el) els.current.set(k, el); else els.current.delete(k); };

  const mobile = st.dw < 640;

  /* ---------- geometry ---------- */
  const printSize = (s = stRef.current) => {
    if (s.dw < 640) { const pw = Math.floor((s.dw - 24 - 2 * 10 - 36) / 3); return { w: pw, h: Math.round(pw / 1.5) }; }
    const w = Math.round(Math.max(128, Math.min(220, s.dw * 0.15)));
    return { w, h: Math.round(w / 1.5) };
  };
  const printPos = (id: string, s = stRef.current) => {
    const ps = printSize(s);
    if (s.dw < 640) { const i = PH.findIndex((p) => p.id === id); return { x: 12 + (i % 3) * (ps.w + 22), y: 104 + Math.floor(i / 3) * (ps.h + 44) }; }
    const f = s.spot[id] || [0.5, 0.5], x0 = 118, y0 = 14;
    const aw = Math.max(0, s.dw - x0 - 14 - ps.w - 12), ah = Math.max(0, s.dh - TASK_H - y0 - 14 - ps.h - 34);
    return { x: Math.round(x0 + f[0] * aw), y: Math.round(y0 + f[1] * ah) };
  };
  const winDims = (w: Win, s = stRef.current) => {
    const m = s.dw < 640;
    if (w.kind === 'folder') return { width: Math.min(452, s.dw - 24), cw: 0, ch: 0, bw: 0, bh: 0 };
    if (w.kind === 'txt') return { width: Math.min(400, s.dw - 24), cw: 0, ch: 0, bw: 0, bh: 0 };
    const room = s.dh - TASK_H - CHROME - (m ? 44 : 0) - (w.max ? 0 : 8);
    const boxW = w.max || m ? s.dw - 10 : Math.min(640, s.dw - 150);
    // the whole photo always fits: 3:2, contained in the room the desk has
    let cw = Math.min(boxW, Math.floor(room * 1.5)), ch = Math.round(cw / 1.5);
    if (ch < 120) { ch = 120; cw = 180; }
    return { width: boxW + 10, cw, ch, bw: boxW, bh: w.max ? room : ch };
  };
  const winPos = (w: Win, s = stRef.current) => {
    const d = winDims(w, s);
    if (w.max || (s.dw < 640 && w.kind === 'photo')) return { x: 0, y: 0 };
    return { x: Math.max(0, Math.min(w.x, s.dw - Math.min(d.width, 160))), y: Math.max(0, Math.min(w.y, s.dh - TASK_H - 40)) };
  };
  const winOf = (id: string, s = stRef.current) => s.wins.find((w) => w.id === id) ?? null;
  const active = (s = stRef.current) => { for (let i = s.order.length - 1; i >= 0; i--) { const w = winOf(s.order[i], s); if (w && !w.min) return w.id; } return null; };

  /* ---------- drawing ---------- */
  const paintWin = (id: string, cell: number) => {
    const s = stRef.current, w = winOf(id, s), el = els.current.get('win:' + id) as HTMLCanvasElement | undefined;
    if (!w || !el || !w.ph) return;
    const d = winDims(w, s), pal = s.look[w.ph].palette;
    getImage(ph(w.ph).src, (img) => drawTrama(el, img, d.cw, d.ch, cell, pal));
  };
  const paintAll = () => {
    const s = stRef.current, ps = printSize(s);
    els.current.forEach((el, k) => {
      const [kind, key] = k.split(':');
      if (kind === 'print') {
        const lk = s.look[key], pk = [lk.cell, lk.palette, ps.w, ps.h].join('|');
        if (keys.current.get(el) !== pk) { keys.current.set(el, pk); getImage(ph(key).src, (img) => drawTrama(el as HTMLCanvasElement, img, ps.w, ps.h, lk.cell ? Math.max(2, Math.round(lk.cell * 0.75)) : 0, lk.palette)); }
      } else if (kind === 'thumb') {
        if (!keys.current.get(el)) { keys.current.set(el, '1'); getImage(ph(key).src, (img) => drawTrama(el as HTMLCanvasElement, img, 72, 48, 2, 'color')); }
      } else if (kind === 'win') {
        const w = winOf(key, s); if (!w || w.kind !== 'photo' || anim.current.get(key) || !w.ph) return;
        const d = winDims(w, s), l = s.look[w.ph], wk = [l.cell, l.palette, d.cw, d.ch].join('|');
        if (keys.current.get(el) !== wk) { keys.current.set(el, wk); paintWin(key, l.cell); }
      }
    });
  };
  // the trama arrives coarse and sharpens down to the chosen cell, at 12 steps a second
  const refine = (id: string) => {
    const s = stRef.current, w = winOf(id, s); if (!w || w.kind !== 'photo' || !w.ph) return;
    const target = s.look[w.ph].cell;
    const seq: number[] = prefersReducedMotion() ? [] : [32, 24, 16, 12, 8, 6, 4, 3, 2].filter((c) => !target || c > target);
    seq.push(target);
    const token = (anim.current.get(id) || 0) + 1;
    anim.current.set(id, token);
    let i = 0;
    const step = () => {
      if (anim.current.get(id) !== token) return;
      paintWin(id, seq[i]); i++;
      if (i < seq.length) { setTimeout(step, 70); return; }
      anim.current.set(id, 0);
      const el = els.current.get('win:' + id); if (el) keys.current.delete(el);
      paintAll();
    };
    step();
  };
  // the teal desk dissolves in through an ordered dither, like the carcoma
  const dissolve = () => {
    const cv = fxRef.current, s = stRef.current; if (!cv || prefersReducedMotion()) return;
    const W = Math.ceil(s.dw / 8), H = Math.ceil(s.dh / 8);
    cv.width = W; cv.height = H; cv.style.display = 'block';
    const ctx = cv.getContext('2d')!, N = 9;
    let t = 0;
    const step = () => {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = color.paper;
      const cover = 1 - t / N;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < cover) ctx.fillRect(x, y, 1, 1);
      t++;
      if (t <= N) setTimeout(step, 83); else cv.style.display = 'none';
    };
    step();
  };

  // measure the desk and keep measuring
  useLayoutEffect(() => {
    const d = deskRef.current; if (!d) return;
    const measure = () => {
      const w = Math.round(d.clientWidth), h = Math.round(d.clientHeight);
      if (w > 0 && h > 0) setSt((s) => (w === s.dw && h === s.dh ? s : { ...s, dw: w, dh: h, ...(w < 640 && s.wins.length === 1 && s.order.length === 1 && !s.sel ? { wins: [], order: [] } : {}) }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(d);
    // a shared link opens its photo with the cell and palette it was shared with
    const q = new URLSearchParams(location.search), shared = PH.find((p) => p.id.toLowerCase() === (q.get('foto') || '').toLowerCase());
    if (shared) {
      const c = q.get('celda'), cell = c === 'original' ? 0 : Number(c), pal = q.get('paleta') as ArchivePalette;
      setSt((s) => ({
        ...s,
        look: { ...s.look, [shared.id]: { cell: (CELLS as readonly number[]).includes(cell) ? cell : s.look[shared.id].cell, palette: PAL_ORDER.includes(pal) ? pal : s.look[shared.id].palette } },
        wins: [{ id: 'w-' + shared.id, kind: 'photo', ph: shared.id, x: 300, y: 70, min: false, max: false }], order: ['w-' + shared.id], sel: shared.id,
      }));
    }
    const t = setTimeout(() => { dissolve(); stRef.current.wins.forEach((w) => refine(w.id)); }, 60);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { paintAll(); });
  useEffect(() => () => clearTimeout(msgT.current), []);

  /* ---------- state changes ---------- */
  const patchWin = (id: string, o: Partial<Win>) => setSt((s) => ({ ...s, wins: s.wins.map((w) => (w.id === id ? { ...w, ...o } : w)) }));
  const focus = (id: string) => setSt((s) => ({ ...s, order: [...s.order.filter((x) => x !== id), id] }));
  const setLook = (id: string, o: Partial<Look>) => {
    setSt((s) => ({ ...s, look: { ...s.look, [id]: { ...s.look[id], ...o } } }));
    setTimeout(() => stRef.current.wins.forEach((w) => { if (w.ph === id) refine(w.id); }), 30);
  };
  const openWin = (nw: Omit<Win, 'x' | 'y' | 'min' | 'max'> & Partial<Win>) => {
    const s = stRef.current, ex = winOf(nw.id, s);
    if (ex) { setSt((x) => ({ ...x, start: false, sel: nw.ph || nw.id, wins: x.wins.map((w) => (w.id === nw.id ? { ...w, min: false } : w)), order: [...x.order.filter((o) => o !== nw.id), nw.id] })); return; }
    const n = s.wins.length % 6;
    const w: Win = { x: 150 + n * 30, y: 20 + n * 28, min: false, max: false, ...nw };
    setSt((x) => ({ ...x, start: false, sel: nw.ph || nw.id, wins: [...x.wins, w], order: [...x.order.filter((o) => o !== w.id), w.id] }));
    if (w.kind === 'photo') setTimeout(() => refine(w.id), 40);
  };
  const openPhoto = (id: string) => openWin({ id: 'w-' + id, kind: 'photo', ph: id });
  const openFolder = (serie: string) => openWin({ id: 'f-' + serie, kind: 'folder', serie, x: 130, y: 40 });
  const openTxt = () => openWin({ id: 'leeme', kind: 'txt', x: Math.max(130, stRef.current.dw - 460), y: 24 });
  const closeWin = (id: string) => setSt((s) => ({ ...s, wins: s.wins.filter((w) => w.id !== id), order: s.order.filter((x) => x !== id) }));
  const copyLink = (id: string, wid: string) => {
    const l = stRef.current.look[id];
    const path = `${location.pathname}?foto=${id.toLowerCase()}&celda=${l.cell || 'original'}&paleta=${l.palette}`;
    const done = (ok: boolean) => {
      patch({ msg: ok ? ui.copied : path, msgFor: wid });
      clearTimeout(msgT.current);
      msgT.current = window.setTimeout(() => patch({ msg: null, msgFor: null }), 2400);
    };
    try { navigator.clipboard.writeText(location.origin + path).then(() => done(true), () => done(false)); } catch { done(false); }
  };
  const tidy = () => patch({ spot: Object.fromEntries(PH.map((p, i) => [p.id, [(i % 4) / 3, Math.floor(i / 4)] as [number, number]])), start: false });
  const bigBefore = useRef<boolean | null>(null);
  const maxPhoto = (w: Win) => {
    const going = !w.max;
    setSt((s) => {
      const o: Partial<State> = { wins: s.wins.map((x) => (x.id === w.id ? { ...x, max: going } : x)), order: [...s.order.filter((x) => x !== w.id), w.id] };
      if (going) { bigBefore.current = s.big; o.big = true; } else if (bigBefore.current === false) o.big = false;
      return { ...s, ...o };
    });
    setTimeout(() => refine(w.id), 80);
  };
  const closeArchivo = () => go(backHref);

  /* ---------- dragging: windows by the title, prints by themselves ---------- */
  const drag = (e: React.PointerEvent, el: HTMLElement, onMove: (dx: number, dy: number) => void, onEnd: (moved: boolean) => void) => {
    if (e.button !== 0) return;
    const k = el.getBoundingClientRect().width / el.offsetWidth || 1, sx = e.clientX, sy = e.clientY;
    let moved = false;
    const mv = (ev: PointerEvent) => { const dx = (ev.clientX - sx) / k, dy = (ev.clientY - sy) / k; if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return; moved = true; onMove(dx, dy); };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); onEnd(moved); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  const dragWin = (id: string, e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const s = stRef.current, w = winOf(id, s), el = els.current.get('root:' + id);
    if (!w || w.max || !el || (s.dw < 640 && w.kind === 'photo')) return;
    const p = winPos(w, s);
    let nx = p.x, ny = p.y;
    drag(e, el, (dx, dy) => {
      nx = Math.round(Math.max(-el.offsetWidth + 80, Math.min(s.dw - 80, p.x + dx)));
      ny = Math.round(Math.max(0, Math.min(s.dh - TASK_H - 30, p.y + dy)));
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
    }, (moved) => { if (moved) patchWin(id, { x: nx, y: ny }); });
    e.preventDefault();
  };
  const dragPrint = (id: string, e: React.PointerEvent) => {
    const s = stRef.current, el = els.current.get('proot:' + id);
    if (!el || s.dw < 640) return;
    setSt((x) => ({ ...x, stack: [...x.stack.filter((i) => i !== id), id] }));
    const p = printPos(id, s), ps = printSize(s);
    let nx = p.x, ny = p.y;
    drag(e, el, (dx, dy) => {
      nx = Math.round(Math.max(0, Math.min(s.dw - ps.w - 12, p.x + dx)));
      ny = Math.round(Math.max(0, Math.min(s.dh - TASK_H - ps.h - 30, p.y + dy)));
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
    }, (moved) => {
      if (!moved) { patch({ sel: id }); return; }
      const x0 = 118, y0 = 14, aw = Math.max(1, s.dw - x0 - 14 - ps.w - 12), ah = Math.max(1, s.dh - TASK_H - y0 - 14 - ps.h - 34);
      setSt((x) => ({ ...x, sel: id, spot: { ...x.spot, [id]: [Math.max(0, Math.min(1, (nx - x0) / aw)), Math.max(0, Math.min(1, (ny - y0) / ah))] } }));
    });
    e.preventDefault();
  };

  /* ---------- render ---------- */
  const act = active(st), ps = printSize(st);
  const icons = [
    ...page.series.map((s) => ({ id: 'f-' + s, label: s, icon: 'folder' as const, run: () => openFolder(s) })),
    { id: 'leeme', label: ui.readmeName, icon: 'note' as const, run: openTxt },
    ...(mobile ? [] : [{ id: 'porta', label: ui.backToLab, icon: 'computer' as const, run: closeArchivo }]),
  ];
  const lookOf = (id: string) => st.look[id];
  const cellLabel = (c: number) => (c ? `${c} px` : ui.original);

  return (
    <section className="exe bv-out" aria-label={page.title} data-big={st.big} onKeyDown={(e) => { if (e.key === 'Escape') patch({ start: false }); }}>
      <div className="tb tb-on tb-exe">
        <PixelIcon name="folder" size={16} />
        <span className="tb-t">{page.windowTitle}</span>
        <button className="bt tbb" aria-label={st.big ? ui.unfill : ui.fill} onClick={() => patch({ big: !st.big })}><MaxGlyph /></button>
        <button className="bt tbb tbb-close" aria-label={ui.closeExe} onClick={closeArchivo}><CloseGlyph /></button>
      </div>
      <div ref={deskRef} className="desk dk-teal" onPointerDown={(e) => { if (e.target === e.currentTarget) patch({ sel: null, start: false }); }}>
        {icons.map((ic, i) => (
          <button
            key={ic.id} className="ic"
            style={mobile ? { left: 6 + i * Math.floor((st.dw - 12) / 5), top: 8, width: Math.floor((st.dw - 12) / 5) } : { left: 10, top: 10 + i * 86, width: 92 }}
            onClick={(e) => { e.stopPropagation(); if (mobile) ic.run(); else patch({ sel: ic.id, start: false }); }}
            onDoubleClick={ic.run}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ic.run(); } }}
          >
            <PixelIcon name={ic.icon} size={32} />
            <span className={'ic-l' + (st.sel === ic.id ? ' ic-sel' : '')}>{ic.label}</span>
          </button>
        ))}

        {PH.map((p) => {
          const pos = printPos(p.id, st), z = st.stack.indexOf(p.id);
          return (
            <button
              key={p.id} ref={reg('proot:' + p.id)} className="pr" aria-label={`${p.id}, ${p.alt}. ${ui.openHint}`}
              style={{ left: pos.x, top: pos.y, width: ps.w + 12, zIndex: z + 1 }}
              onPointerDown={(e) => dragPrint(p.id, e)} onClick={() => { if (mobile) openPhoto(p.id); }} onDoubleClick={() => openPhoto(p.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); openPhoto(p.id); } }}
            >
              <span className="pr-card"><canvas ref={reg('print:' + p.id)} style={{ width: ps.w, height: ps.h }} aria-hidden="true" /></span>
              <span className={'pr-l' + (st.sel === p.id ? ' ic-sel' : '')}>{p.id}.JPG</span>
            </button>
          );
        })}

        {st.wins.map((w) => {
          const d = winDims(w, st), pos = winPos(w, st), on = act === w.id, z = 100 + st.order.indexOf(w.id);
          const p = w.ph ? ph(w.ph) : null, l = w.ph ? lookOf(w.ph) : null;
          const title = w.kind === 'photo' ? `${w.ph}.JPG` : w.kind === 'folder' ? `C:\\fotos\\${w.serie}` : ui.readmeTitle;
          return (
            <section
              key={w.id} ref={reg('root:' + w.id)} className={'win bv-out' + (w.min ? ' win-min' : '')} aria-label={title}
              style={{ left: pos.x, top: pos.y, width: d.width, zIndex: z }}
              onPointerDown={() => { if (st.start) patch({ start: false }); if (act !== w.id) focus(w.id); }}
            >
              <div className={'tb' + (on ? ' tb-on' : '')} onPointerDown={(e) => dragWin(w.id, e)} onDoubleClick={(e) => { if (w.kind === 'photo' && !mobile && !(e.target as HTMLElement).closest('button')) maxPhoto(w); }}>
                <PixelIcon name={w.kind === 'photo' ? 'photo' : w.kind === 'folder' ? 'folder' : 'note'} size={16} />
                <span className="tb-t">{title}</span>
                <button className="bt tbb" aria-label={ui.minimize} onClick={() => patchWin(w.id, { min: true })}><MinGlyph /></button>
                {w.kind === 'photo' && !mobile && <button className="bt tbb" aria-label={w.max ? ui.restore : ui.maximize} onClick={() => maxPhoto(w)}><MaxGlyph /></button>}
                <button className="bt tbb tbb-close" aria-label={ui.close} onClick={() => closeWin(w.id)}><CloseGlyph /></button>
              </div>

              {w.kind === 'photo' && p && l && (
                <>
                  <div className="tbar">
                    {CELLS.map((c) => <button key={c} className={'bt bt-c' + (l.cell === c ? ' on' : '')} aria-pressed={l.cell === c} aria-label={`${ui.cell} ${cellLabel(c)}`} onClick={() => setLook(p.id, { cell: c })}>{c ? String(c) : 'orig'}</button>)}
                    <span className="sep" aria-hidden="true" />
                    {PAL_ORDER.map((k) => <button key={k} className={'bt bt-p' + (l.palette === k ? ' on' : '')} aria-pressed={l.palette === k} aria-label={`${ui.palette} ${ui.paletteNames[k]}`} onClick={() => setLook(p.id, { palette: k })}><span className={'sw sw-' + k} /></button>)}
                    <button className="bt link" onClick={() => copyLink(p.id, w.id)}>{ui.copyLink}</button>
                  </div>
                  <div className="sunk" style={{ width: d.bw + 4, height: d.bh + 4 }} data-max={w.max}>
                    <canvas ref={reg('win:' + w.id)} role="img" aria-label={`${p.alt}, ${l.cell ? `${ui.cell} ${l.cell} px` : ui.original}, ${ui.palette} ${ui.paletteNames[l.palette]}`} style={{ width: d.cw, height: d.ch }} />
                  </div>
                  <div className="sbar">
                    <span className="sp sp-1">{l.cell ? `${ui.cell} ${l.cell} px` : ui.original}</span>
                    <span className="sp sp-2">{ui.palette} {ui.paletteNames[l.palette]}</span>
                    <span className="sp sp-3" role="status">{st.msgFor === w.id && st.msg ? st.msg : p.date}</span>
                  </div>
                </>
              )}

              {w.kind === 'folder' && (
                <>
                  <div className="sunk">
                    <div className="files">
                      {PH.filter((q) => q.serie === w.serie).map((q) => (
                        <button key={q.id} className="file" aria-label={`${ui.open} ${q.id}`} onClick={() => openPhoto(q.id)}>
                          <canvas ref={reg('thumb:' + q.id)} width={144} height={96} aria-hidden="true" /><span>{q.id}.JPG</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sbar"><span className="sp sp-3">{PH.filter((q) => q.serie === w.serie).length} {ui.objects}</span></div>
                </>
              )}

              {w.kind === 'txt' && <div className="sunk"><div className="note">{page.readme}</div></div>}
            </section>
          );
        })}

        <canvas ref={fxRef} className="exe-fx" aria-hidden="true" />

        {st.start && (
          <nav className="sm bv-out" aria-label={ui.start}>
            <div className="sm-band" aria-hidden="true"><span>{ui.band}</span></div>
            <div className="sm-list">
              {page.series.map((s) => {
                const n = PH.filter((q) => q.serie === s).length;
                return <button key={s} className="sm-it" onClick={() => openFolder(s)}><PixelIcon name="folder" size={16} />{s}<span className="sm-n">{n} {n === 1 ? ui.photo : ui.photos}</span></button>;
              })}
              <div className="sm-hr" aria-hidden="true" />
              <button className="sm-it" onClick={openTxt}><PixelIcon name="note" size={16} />{ui.readmeName}</button>
              <button className="sm-it" onClick={tidy}><span className="sm-dot" aria-hidden="true" />{ui.tidy}</button>
              <button className="sm-it" onClick={() => patch({ wins: [], order: [], start: false })}><span className="sm-dot" aria-hidden="true" />{ui.closeAll}</button>
              <div className="sm-hr" aria-hidden="true" />
              <button className="sm-it" onClick={closeArchivo}><PixelIcon name="computer" size={16} />{ui.backToLab}</button>
            </div>
          </nav>
        )}

        <div className="taskbar">
          <button className={'bt start' + (st.start ? ' on' : '')} aria-pressed={st.start} aria-label={ui.startLabel} onClick={() => patch({ start: !st.start })}><span className="sm-dot sm-dot--signal" aria-hidden="true" />{ui.start}</button>
          <span className="sep sep--tall" aria-hidden="true" />
          <div className="tasks">
            {st.order.map((id) => {
              const w = winOf(id, st); if (!w) return null;
              const on = act === id && !w.min;
              return (
                <button key={id} className={'bt task' + (on ? ' on' : '')} aria-pressed={on} onClick={() => { if (on) patchWin(id, { min: true }); else { patchWin(id, { min: false }); focus(id); } }}>
                  <span>{w.kind === 'photo' ? `${w.ph}.JPG` : w.kind === 'folder' ? w.serie : ui.readmeName}</span>
                </button>
              );
            })}
          </div>
          <div className="tray"><span>{ui.tray}</span><LimaClock /></div>
        </div>
      </div>
    </section>
  );
}

const MinGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 8.5h6" className="glyph" strokeWidth="2" /></svg>;
const MaxGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" fill="none" className="glyph" strokeWidth="1" /><path d="M1 1.5h8" className="glyph" strokeWidth="2" /></svg>;
const CloseGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" className="glyph" strokeWidth="1.6" /></svg>;
