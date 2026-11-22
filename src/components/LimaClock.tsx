'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/dither';

/** Live time in Lima. With `beat`, the colon pulses once per second. */
export function LimaClock({ beat = false }: { beat?: boolean }) {
  const [text, setText] = useState('--:--');
  useEffect(() => {
    let fmt: Intl.DateTimeFormat;
    try { fmt = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false }); } catch { return; }
    const still = prefersReducedMotion();
    const tick = () => {
      const now = new Date();
      let h = '', m = '';
      for (const p of fmt.formatToParts(now)) { if (p.type === 'hour') h = p.value; if (p.type === 'minute') m = p.value; }
      setText(h + (!beat || still || now.getSeconds() % 2 === 0 ? ':' : ' ') + m);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [beat]);
  return <time className="clock" suppressHydrationWarning>{text}</time>;
}
