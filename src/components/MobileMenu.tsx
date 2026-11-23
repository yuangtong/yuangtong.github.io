'use client';

import { useEffect, useRef } from 'react';
import type { Link, Settings } from '@/content/types';
import { LangSwitch } from './LangSwitch';
import { LimaClock } from './LimaClock';

type Props = {
  name: string; nameZh: string; availability: string; nav: Link[]; links: Link[]; closeLabel: string; navLabel: string; languages: Settings['languages']; home?: string; current?: string;
  onClose: () => void;
  /** Called when a section is chosen; the parent closes the menu and navigates. */
  onSelect: (href: string, e: React.MouseEvent) => void;
};

/** Full-screen menu for phones (design canvas, "movil, menu abierto"). */
export function MobileMenu({ name, nameZh, availability, nav, links, closeLabel, navLabel, languages, home = '/', current, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus(); };
  }, [onClose]);
  return (
    <div ref={ref} className="menu" role="dialog" aria-modal="true" aria-label={name}>
      <div className="menu__head">
        <a href={home} onClick={(e) => onSelect(home, e)} className="menu__name">{name} <span lang="zh-Hant" className="menu__zh">({nameZh})</span></a>
        <button type="button" className="menu__close" onClick={onClose}>{closeLabel}</button>
      </div>
      <nav aria-label={navLabel} className="menu__nav">
        {nav.map((l) => <a key={l.href} href={l.href} aria-current={current === l.href ? 'page' : undefined} onClick={(e) => onSelect(l.href, e)}>{l.label}</a>)}
      </nav>
      <LangSwitch languages={languages} inline className="menu__lang" />
      <div className="menu__foot">
        <div className="menu__links">{links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
        <span className="menu__status"><span aria-hidden="true" className="dot" />{availability} <LimaClock /></span>
      </div>
    </div>
  );
}
