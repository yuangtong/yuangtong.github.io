'use client';

import { useEffect, useRef, useState } from 'react';
import type { MetroCardsPage } from '@/content/types';
import { METRO_CITIES } from '@/content/collections';
import { prefersReducedMotion } from '@/lib/dither';
import { createCityGlobe } from '@/lib/city-globe';

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

/**
 * Metro cards (canvas "lab: tarjetas de transporte", 2026-11-26). One card per
 * city, in the manner of a credit-card component: it tilts with the pointer, a
 * glare follows it, a click turns it over. Beside it, the contact globe turns
 * the chosen city to the middle and marks it in blue.
 */
export function MetroCards({ page }: { page: MetroCardsPage }) {
  const [ci, setCi] = useState(0);
  const [vi, setVi] = useState(0);
  const [back, setBack] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const globe = useRef<ReturnType<typeof createCityGlobe> | null>(null);
  const c = METRO_CITIES[ci], v = c.variants[Math.min(vi, c.variants.length - 1)];
  const cards = METRO_CITIES.reduce((n, x) => n + x.variants.length, 0);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const g = createCityGlobe(cv, { cities: METRO_CITIES, font: getComputedStyle(cv).fontFamily, reduce: prefersReducedMotion() });
    globe.current = g; g.aim(0);
    return () => g.destroy();
  }, []);

  const pick = (i: number) => { setCi(i); setVi(0); setBack(false); globe.current?.aim(i); };
  const tilt = (e: React.PointerEvent) => {
    const el = tiltRef.current; if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 14).toFixed(2)}deg)`;
    if (glareRef.current) { glareRef.current.style.opacity = '1'; glareRef.current.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); glareRef.current.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`); }
  };
  const untilt = () => { if (tiltRef.current) tiltRef.current.style.transform = ''; if (glareRef.current) glareRef.current.style.opacity = '0'; };
  const country = page.countries[c.country] ?? c.country;

  return (
    <section className="metro" aria-label={page.title}>
      <div className="metro__side">
        <div className="metro__head">
          <h1 className="h2">{page.title}</h1>
          <p className="lead">{page.lead}</p>
        </div>
        <div
          ref={tiltRef} className="metro__tilt" role="button" tabIndex={0}
          aria-label={fill(page.cardLabel, { system: c.system, city: c.city + (v.name ? `, ${v.name}` : ''), side: back ? page.back : page.front })}
          onPointerMove={tilt} onPointerLeave={untilt} onClick={() => setBack((b) => !b)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBack((b) => !b); } }}
        >
          <div className="metro__card" data-back={back}>
            <img className="metro__face" src={v.front} alt="" draggable={false} />
            <img className="metro__face metro__face--back" src={v.back} alt="" draggable={false} />
          </div>
          <div ref={glareRef} className="metro__glare" aria-hidden="true" />
        </div>
        <div className="metro__info">
          <div>
            <p className="metro__city">{c.city}</p>
            <p className="label">{country} / {c.system}</p>
          </div>
          <p className="label">{back ? page.back : page.front} / {page.turn}</p>
        </div>
        {c.variants.length > 1 && (
          <div className="metro__variants" role="group" aria-label={page.variants}>
            <span className="label">{page.variants}</span>
            {c.variants.map((x, i) => (
              <button key={x.name} type="button" className="metro__variant" aria-pressed={i === vi} onClick={() => { setVi(i); setBack(false); }}>{String(i + 1).padStart(2, '0')} {x.name}</button>
            ))}
          </div>
        )}
        <div className="metro__cities">
          {METRO_CITIES.map((x, i) => (
            <button key={x.id} type="button" className="metro__chip" aria-pressed={i === ci} onClick={() => pick(i)}>
              <img src={x.variants[0].front} alt="" /><span>{x.city}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="metro__globe">
        <p className="label metro__count">{fill(page.count, { cities: METRO_CITIES.length, cards })}</p>
        <canvas
          ref={cvRef} role="img"
          aria-label={fill(page.globeLabel, { city: c.city, country, others: METRO_CITIES.filter((_, i) => i !== ci).map((x) => x.city).join(', ') })}
          onPointerDown={(e) => { globe.current?.down(e.nativeEvent); e.preventDefault(); }}
        />
      </div>
    </section>
  );
}
