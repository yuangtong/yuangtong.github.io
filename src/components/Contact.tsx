'use client';

import { useEffect, useRef, useState } from 'react';
import type { ContactPage } from '@/content/types';
import { prefersReducedMotion } from '@/lib/dither';
import { clockIn, createGlobe, LIMA, visitorPlace, type Place } from '@/lib/globe';
import { LimaClock } from './LimaClock';

/** Contact (design G8, contacto v2): the ways to write, two clocks and a dot-grid globe. */
export function Contact({ page }: { page: ContactPage }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const downRef = useRef<((e: PointerEvent) => void) | null>(null);
  const [you, setYou] = useState<Place | null>(null);
  const [yourClock, setYourClock] = useState('--:--');
  const placeName = (p: Place) => page.places[p.tz] ?? p.tz.split('/').pop()!.replace(/_/g, ' ');
  const same = !you || you.tz === LIMA.tz;
  const fill = (s: string) => s.replace('{place}', you ? placeName(you) : '');

  useEffect(() => {
    const v = visitorPlace();
    setYou(v);
    const tick = () => setYourClock(clockIn(v.tz));
    tick();
    const id = setInterval(tick, 20000);
    const cv = cvRef.current;
    if (!cv) return () => clearInterval(id);
    const g = createGlobe(cv, {
      you: v, meLabel: page.globe.me, youLabel: page.globe.you.replace('{place}', placeName(v)),
      font: getComputedStyle(cv).fontFamily, reduce: prefersReducedMotion(),
    });
    downRef.current = g.down;
    return () => { clearInterval(id); g.destroy(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const links = page.links.filter((l) => l.href !== '#');
  return (
    <main className="section section--contact" aria-label={page.title}>
      <div className="contact__text">
        <h1 className="contact__title">{page.title}</h1>
        <p className="contact__lead">{page.lead}</p>
        <div className="contact__list">
          <a href={page.email.href}><span>{page.emailLabel}</span><span className="mono">{page.email.label}</span></a>
          {links.map((l) => <a key={l.label} href={l.href} rel="noopener"><span>{l.label}</span><span className="mono">{l.detail}</span></a>)}
        </div>
        <div className="contact__clocks">
          <div className="contact__clock"><span className="mono">{page.clocks.mine}</span><b><LimaClock /></b></div>
          {you && <div className="contact__clock"><span className="mono">{same ? page.clocks.youSame : fill(page.clocks.you)}</span><b suppressHydrationWarning>{yourClock}</b></div>}
        </div>
      </div>
      <div className="contact__globe">
        <canvas
          ref={cvRef} role="img" aria-label={same ? page.globe.labelSame : fill(page.globe.label)}
          onPointerDown={(e) => { downRef.current?.(e.nativeEvent); e.preventDefault(); }}
        />
        <p className="mono contact__hint">{page.globe.hint}</p>
      </div>
    </main>
  );
}
