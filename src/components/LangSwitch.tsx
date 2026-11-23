'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Settings } from '@/content/types';
import { isLocale, localePath, splitPath } from '@/content/locale';

type Props = { languages: Settings['languages']; className?: string; /** Inline list for the phone menu, no button. */ inline?: boolean };

/**
 * The language selector (canvas "nav: idiomas"). The button shows the current
 * code; the panel lists the languages the site speaks, which link to this same
 * page in that language, and the ones the owner is learning, machine
 * translated and marked as such. Those wait for DeepL and say "soon" until
 * their content is ready.
 */
export function LangSwitch({ languages, className, inline }: Props) {
  const pathname = usePathname() ?? '/';
  const { locale, path } = splitPath(pathname);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => { setHash(window.location.hash); }, [pathname, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const spoken = languages.list.filter((l) => !l.learning);
  const learning = languages.list.filter((l) => l.learning);
  const panel = (
    <div id={id} className={inline ? 'lang__panel lang__panel--inline' : 'lang__panel'}>
      <p className="lang__head">{languages.spoken}</p>
      <ul className="lang__list">
        {spoken.map((l) => {
          const on = l.code === locale;
          const href = isLocale(l.code) ? localePath(l.code, path) + hash : '#';
          return (
            <li key={l.code}>
              <a className="lang__opt" href={href} hrefLang={l.code} lang={l.code} aria-current={on ? 'true' : undefined}>
                <span className="lang__name">{l.name}</span><span className="lang__code">{l.code}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="lang__head lang__head--learn">{languages.learning}</p>
      <ul className="lang__list">
        {learning.map((l) => (
          <li key={l.code}>
            <span className="lang__opt lang__opt--learn" lang={l.code} aria-disabled="true">
              <span className="lang__name">{l.name}</span><span className="lang__code">{l.code}, {languages.learningNote}{l.ready ? '' : `, ${languages.soon}`}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="lang__promise">{languages.promise}</p>
    </div>
  );

  if (inline) return <div className={['lang', className].filter(Boolean).join(' ')}>{panel}</div>;
  return (
    <div ref={ref} className={['lang', className].filter(Boolean).join(' ')}>
      <button type="button" className="lang__btn" aria-expanded={open} aria-controls={id} aria-label={languages.label} onClick={() => setOpen((o) => !o)}>
        {locale} <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && panel}
    </div>
  );
}
