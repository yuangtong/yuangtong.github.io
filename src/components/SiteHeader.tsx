'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Link, Settings } from '@/content/types';
import { CarcomaLink, useCarcoma } from './Carcoma';
import { LimaClock } from './LimaClock';
import { MobileMenu } from './MobileMenu';

type Props = {
  nav: Link[]; links: Link[]; ui: Settings['ui'];
  name: string; nameZh: string; availability: string;
  /** Sub-level crumb, for example "lab / archivo.exe". */
  crumb?: Link[];
};

/**
 * Header for the section pages: the navigation from the design canvas, with
 * one active tab. Tabs do not pile up; a crumb appears only for a sub-level.
 */
export function SiteHeader({ nav, links, ui, name, nameZh, availability, crumb }: Props) {
  const pathname = usePathname();
  const go = useCarcoma();
  const [open, setOpen] = useState(false);
  const active = (href: string) => href !== '/#jugar' && (pathname === href || pathname.startsWith(href + '/'));
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <CarcomaLink href="/" className="site-header__status">
          <span aria-hidden="true" className="dot" />
          {availability} <LimaClock />
          <span aria-hidden="true" className="cursor" />
        </CarcomaLink>
        <nav aria-label="Principal" className="site-header__nav">
          {nav.map((l) => <CarcomaLink key={l.href} href={l.href} className="tab" aria-current={active(l.href) ? 'page' : undefined}>{l.label}</CarcomaLink>)}
        </nav>
        <button type="button" className="site-header__menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>{ui.menuLabel}</button>
      </div>
      {crumb && crumb.length > 1 && (
        <nav aria-label="Miga" className="crumb">
          {crumb.map((c, i) => (
            <span key={c.href}>{i > 0 && <span aria-hidden="true"> / </span>}{i < crumb.length - 1 ? <CarcomaLink href={c.href}>{c.label}</CarcomaLink> : <span aria-current="page">{c.label}</span>}</span>
          ))}
        </nav>
      )}
      {open && (
        <MobileMenu
          name={name} nameZh={nameZh} availability={availability} nav={nav} links={links} closeLabel={ui.closeLabel}
          current={nav.find((l) => active(l.href))?.href}
          onClose={() => setOpen(false)}
          onSelect={(href, e) => { e.preventDefault(); setOpen(false); requestAnimationFrame(() => go(href)); }}
        />
      )}
    </header>
  );
}
