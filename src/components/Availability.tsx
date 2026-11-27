'use client';

import { useEffect, useRef, useState } from 'react';
import type { WorkingHours } from '@/content/types';

type Now = { on: boolean; mine: string; mineDay: string; yours: string; yoursDay: string; place: string; note: string; clock: string };
const pad = (n: number) => String(n).padStart(2, '0');

/** Wall-clock parts of `at` in a time zone: weekday (0 is Sunday), hour, minute. */
function partsIn(at: Date, zone: string) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(at);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), h: +get('hour') % 24, m: +get('minute') };
}

/** Where the owner stands now, and the visitor's time, from the browser's own time zone (no location asked). */
function read(H: WorkingHours, lang: string): Now {
  const at = new Date(), L = partsIn(at, H.zone), on = H.days.includes(L.d) && L.h >= H.start && L.h < H.end;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || H.zone, V = partsIn(at, zone);
  const day = (z: string, t: Date) => new Intl.DateTimeFormat(lang, { timeZone: z, weekday: 'short' }).format(t).toLowerCase();   // the site is lowercase
  const hm = (z: string, t: Date) => { const q = partsIn(t, z); return `${pad(q.h)}:${pad(q.m)}`; };
  const place = zone === H.zone ? H.city : (zone.split('/').pop() ?? zone).replace(/_/g, ' ').toLowerCase();
  let note: string;
  if (on) note = V.h >= 8 && V.h < 21 ? H.working : H.workingLate.replace('{time}', hm(zone, at));
  else {
    // the next opening, in Lima's wall time, then the same moment in the visitor's
    let ahead = 0, d = L.d;
    if (H.days.includes(d) && L.h < H.start) ahead = (H.start - L.h) * 60 - L.m;
    else { ahead = (24 - L.h) * 60 - L.m + H.start * 60; d = (d + 1) % 7; while (!H.days.includes(d)) { ahead += 24 * 60; d = (d + 1) % 7; } }
    const next = new Date(at.getTime() + ahead * 60000);
    note = H.away.replace('{day}', day(H.zone, next)).replace('{time}', `${H.start}:00`).replace('{yours}', `${day(zone, next)} ${hm(zone, next)}`);
  }
  return { on, mine: `${pad(L.h)}:${pad(L.m)}`, mineDay: day(H.zone, at), yours: `${pad(V.h)}:${pad(V.m)}`, yoursDay: day(zone, at), place, note, clock: `${pad(L.h)}:${pad(L.m)}` };
}

/**
 * The header's availability (canvas "disponibilidad: horario laboral", approved
 * 2026-11-27). It follows the owner's working hours in Lima: available with a
 * blue dot inside them, unavailable with an orange one outside. Hovering it
 * (a computer) or tapping it opens "working hours": the schedule, my time in
 * Lima, the visitor's time and place from the browser's time zone, and a line
 * on when I answer, with the email.
 */
export function Availability({ hours, className, ref, ...rest }: { hours: WorkingHours; className: string; ref?: React.Ref<HTMLSpanElement> } & React.HTMLAttributes<HTMLSpanElement> & { 'data-fall'?: string }) {
  const [now, setNow] = useState<Now | null>(null);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement | null>(null);
  const shut = useRef(0);

  useEffect(() => {
    const lang = document.documentElement.lang || 'en';
    const tick = () => setNow(read(hours, lang));
    tick(); const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [hours]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const away = (e: PointerEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', away);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', away); };
  }, [open]);

  const on = now?.on ?? true;
  const setRefs = (el: HTMLSpanElement | null) => { wrap.current = el; if (typeof ref === 'function') ref(el); else if (ref) (ref as React.RefObject<HTMLSpanElement | null>).current = el; };
  return (
    <span
      ref={setRefs} className={`avail ${className}`} data-on={on} {...rest}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') { clearTimeout(shut.current); setOpen(true); } }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') shut.current = window.setTimeout(() => setOpen(false), 260); }}
    >
      <button type="button" className="avail__pill" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((v) => !v)}>
        <span aria-hidden="true" className="avail__dot" />
        <span suppressHydrationWarning>{on ? hours.on : hours.off}, {hours.city} <time className="clock" suppressHydrationWarning>{now?.clock ?? '--:--'}</time></span>
        <span aria-hidden="true" className="cursor" />
      </button>
      {open && now && (
        <span className="avail__dlg" role="dialog" aria-label={hours.title}>
          <span className="avail__top"><span className="avail__title">{hours.title}</span><span className="avail__state">{on ? hours.on : hours.off}</span></span>
          <span className="avail__schedule">{hours.schedule}</span>
          <span className="avail__row"><span className="avail__k">{hours.mine} · {hours.city}</span><span className="avail__t">{now.mineDay} {now.mine}</span></span>
          <span className="avail__row"><span className="avail__k">{hours.yours} · {now.place}</span><span className="avail__t">{now.yoursDay} {now.yours}</span></span>
          <span className="avail__note">{now.note} <a href={hours.email.href}>{hours.email.label}</a></span>
        </span>
      )}
    </span>
  );
}
