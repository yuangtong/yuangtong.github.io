'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Link, Settings, WorkingHours } from '@/content/types';
import { CarcomaLink, useCarcoma } from './Carcoma';
import { Availability } from './Availability';
import { MobileMenu } from './MobileMenu';
import { LangSwitch } from './LangSwitch';
import { localePath, splitPath } from '@/content/locale';

type Props = {
  nav: Link[]; links: Link[]; ui: Settings['ui']; languages: Settings['languages'];
  name: string; nameZh: string; hours: WorkingHours;
  /** Crumbs for sub-levels, keyed by path, for example "lab / archivo.exe". */
  crumbs?: Settings['crumbs'];
  /** The folded strip of each section, numbered as on the landing ("02 el lab"). */
  strips: { href: string; n: string; title: string }[];
};

/**
 * Header for the section pages, the same as the landing's (G7.4): the status
 * and the navigation sit on the rule, and below it the section's folded strip,
 * numbered as on the landing, with the crumb for a sub-level.
 */
export function SiteHeader({ nav, links, ui, languages, name, nameZh, hours, crumbs, strips }: Props) {
  const pathname = usePathname();
  const home = localePath(splitPath(pathname).locale, '/');
  const crumb = crumbs?.[pathname];
  const go = useCarcoma();
  const [open, setOpen] = useState(false);
  // the home link ("/", "/es") is current only on the landing itself, not on every page under it
  const active = (href: string) => !href.includes('#') && (pathname === href || (splitPath(href).path !== '/' && pathname.startsWith(href + '/')));
  const strip = strips.find((s) => active(s.href));
  const sub = crumb && crumb.length > 1 ? crumb.slice(1) : [];
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Availability hours={hours} className="site-header__status" />
        <nav aria-label={ui.navLabel} className="site-header__nav">
          {nav.map((l) => <CarcomaLink key={l.href} href={l.href} className="site-header__link" aria-current={active(l.href) ? 'page' : undefined}>{l.label}</CarcomaLink>)}
        </nav>
        <LangSwitch languages={languages} className="site-header__lang" />
        <button type="button" className="site-header__menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => go(() => setOpen(true))}>{ui.menuLabel}</button>
      </div>
      {strip && (
        <nav aria-label={ui.crumbLabel} className="site-header__strip">
          <span className="label">{strip.n}</span>
          {sub.length ? <CarcomaLink href={strip.href}>{strip.title}</CarcomaLink> : <span aria-current="page">{strip.title}</span>}
          {sub.map((c, i) => (
            <span key={c.href} className="site-header__sub"><span aria-hidden="true">/</span>{i < sub.length - 1 ? <CarcomaLink href={c.href}>{c.label}</CarcomaLink> : <span aria-current="page">{c.label}</span>}</span>
          ))}
        </nav>
      )}
      {open && (
        <MobileMenu
          name={name} nameZh={nameZh} hours={hours} nav={nav} links={links} closeLabel={ui.closeLabel} navLabel={ui.navLabel} languages={languages} home={home}
          current={nav.find((l) => active(l.href))?.href}
          onClose={() => setOpen(false)}
          onSelect={(href, e) => { e.preventDefault(); setOpen(false); requestAnimationFrame(() => go(href)); }}
        />
      )}
    </header>
  );
}
