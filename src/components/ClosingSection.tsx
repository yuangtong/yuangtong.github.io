'use client';

import { useEffect, useRef } from 'react';
import type { HomePage, Settings } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { ramp } from '@/lib/tokens';
import { LimaClock } from './LimaClock';

const COLS = 160, ROWS = 40, K = 14;
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];

/** Turns a word into a grid of cross stitches, with a stitched heart after it. */
function stitchCells(word: string, family: string): [number, number][] {
  const S = 4, o = document.createElement('canvas');
  o.width = COLS * S; o.height = ROWS * S;
  const x = o.getContext('2d', { willReadFrequently: true })!;
  x.fillStyle = '#000';
  x.font = `400 ${36 * S}px ${family}, cursive`;
  x.fillText(word, 2 * S, ROWS * S * 0.74);
  const d = x.getImageData(0, 0, o.width, o.height).data, out: [number, number][] = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    let sum = 0;
    for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) sum += d[((r * S + a) * o.width + c * S + b) * 4 + 3];
    if (sum / (S * S * 255) > 0.34) out.push([c, r]);
  }
  const hx = Math.ceil(x.measureText(word).width / S + 2) + 2, hy = 7;
  HEART.forEach((row, j) => { for (let i = 0; i < 7; i++) if (row[i] === 'X') for (let p = 0; p < 4; p++) out.push([hx + i * 2 + (p & 1), hy + j * 2 + (p >> 1)]); });
  return out;
}

export function ClosingSection({ contact, footer, ui, stitchFamily }: { contact: HomePage['contact']; footer: Settings['footer']; ui: Settings['ui']; stitchFamily: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let raf = 0, dead = false, started = -1, cells: [number, number][] = [];
    const reduce = prefersReducedMotion(), [top, under] = ramp.rosado;
    const draw = (n: number) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineCap = 'round'; ctx.lineWidth = 2.8;
      const m = K * 0.2;
      for (let i = 0; i < Math.min(n, cells.length); i++) {
        const px = cells[i][0] * K, py = cells[i][1] * K;
        ctx.strokeStyle = under; ctx.beginPath(); ctx.moveTo(px + m, py + K - m); ctx.lineTo(px + K - m, py + m); ctx.stroke();
        ctx.strokeStyle = top; ctx.beginPath(); ctx.moveTo(px + m, py + m); ctx.lineTo(px + K - m, py + K - m); ctx.stroke();
      }
    };
    // stitches start when the section comes into view, about 170 per second
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started >= 0 || !cells.length) return;
      if (reduce) { draw(cells.length); started = 0; return; }
      started = performance.now();
      const loop = (now: number) => { if (dead) return; const n = Math.floor(((now - started) / 1000) * 12) * 14; draw(n); if (n < cells.length) raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }, { threshold: 0.3 });
    document.fonts.load(`400 80px ${stitchFamily}`).catch(() => null).then(() => { if (dead) return; cells = stitchCells(contact.title, stitchFamily); io.observe(cv); });
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); };
  }, [contact.title, stitchFamily]);

  return (
    <section id="contacto" className="closing">
      <div className="closing__main">
        <h2 className="closing__title">
          <canvas ref={ref} width={COLS * K} height={ROWS * K} role="img" aria-label={contact.title} />
        </h2>
        <dl aria-label={ui.contactListLabel} className="facts">
          {contact.facts.map((f) => (
            <div key={f.label} className="facts__row">
              <dt className="label">{f.label}</dt>
              <dd>{f.kind === 'clock' ? <><LimaClock beat /> <span className="label">{f.note}</span></> : f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="closing__actions">
          <a href={contact.primary.href} className="btn btn--paper">{contact.primary.label}</a>
          {contact.links.map((l) => <a key={l.label} href={l.href} className="closing__link">{l.label}</a>)}
        </div>
      </div>
      <footer className="closing__footer">
        <span>{footer.left}</span>
        <span>{footer.right}</span>
      </footer>
    </section>
  );
}
