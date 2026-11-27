'use client';

import { usePathname } from 'next/navigation';
import type { HomePage, Link, NotFoundPage, Settings } from '@/content/types';
import { splitPath, type Locale } from '@/content/locale';
import { NotFoundCrash } from './NotFoundCrash';
import { SiteHeader } from './SiteHeader';

export type NotFoundCopy = { page: NotFoundPage; settings: Settings; intro: HomePage['intro']; links: Link[] };

/** The 404 in the language of the path it was asked for. */
export function NotFoundView({ copy }: { copy: Record<Locale, NotFoundCopy> }) {
  const { locale } = splitPath(usePathname() ?? '/');
  const { page: p, settings, intro, links } = copy[locale];
  return (
    <div className="section-shell">
      <SiteHeader nav={settings.nav} links={links} ui={settings.ui} languages={settings.languages} name={intro.name} nameZh={intro.nameZh} hours={intro.hours} strips={[]} />
      <main className="notfound" lang={locale}>
        <div className="notfound__stage"><NotFoundCrash label={p.canvasLabel} /></div>
        <section className="notfound__text">
          <div className="notfound__copy">
            <h1 className="notfound__title">{p.title}</h1>
            <p className="notfound__body">{p.body}</p>
          </div>
          <div className="notfound__ctas">
            <a href={p.back.href} className="btn btn--ink">{p.back.label}</a>
            <a href={p.lab.href} className="btn btn--signal">{p.lab.label}</a>
          </div>
        </section>
      </main>
    </div>
  );
}
