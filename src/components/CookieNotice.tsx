'use client';

import { useEffect, useState } from 'react';
import type { Settings } from '@/content/types';

const KEY = 'cookie-notice';

/**
 * The cookie notice (owner, 2026-11-27), the availability card's shape: paper,
 * a 1px ink rule and a hard ink shadow. The site sets no cookies; it counts
 * visits with Vercel Web Analytics (owner, 2026-11-28), which is cookieless and
 * keeps no data that identifies a visitor, so the notice informs and asks
 * nothing. Closing it is remembered on this device only (local storage, not a
 * cookie). If a tracker that sets cookies or follows visitors is ever added,
 * this becomes a choice with accept and reject, before the tracker loads.
 */
export function CookieNotice({ text }: { text: Settings['cookies'] }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch { /* private mode: show it */ }
    if (seen) return;
    const id = window.setTimeout(() => setShow(true), 1200);   // after the first paint, not over it
    return () => clearTimeout(id);
  }, []);

  if (!show) return null;
  const close = () => { setShow(false); try { localStorage.setItem(KEY, '1'); } catch { /* private mode */ } };
  return (
    <section className="cookies" role="region" aria-label={text.label}>
      <span className="cookies__top"><span className="cookies__title">{text.title}</span><span className="cookies__state">{text.state}</span></span>
      <p className="cookies__body">{text.body}</p>
      {text.rows.map((r) => (
        <span className="cookies__row" key={r.k}><span className="cookies__k">{r.k}</span><span className="cookies__v">{r.v}</span></span>
      ))}
      <button type="button" className="btn btn--sm btn--ink cookies__ok" onClick={close}>{text.ok}</button>
    </section>
  );
}
