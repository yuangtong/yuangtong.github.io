import type { Metadata } from 'next';
import { getLabPage, getSettings } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { LabGrid } from '@/components/LabGrid';
import { CarcomaLink } from '@/components/Carcoma';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getLabPage(locale)).title }; }

export default async function LabPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  const [page, settings] = await Promise.all([getLabPage(locale), getSettings(locale)]);
  return (
    <main className="section section--lab">
      <div className="section__head">
        <h1 className="h2">{page.title}</h1>
        <p className="lead">{page.lead}</p>
      </div>
      <ul className="doors">
        {page.doors.map((d, i) => (
          <li key={d.id} className={d.soon ? 'door door--soon' : 'door'}>
            <span className="label door__n">{String(i + 1).padStart(2, '0')}{d.soon && <span className="door__soon">{page.soon.label}</span>}</span>
            <h2 className="door__title">{d.title}</h2>
            <p className="door__text">{d.text}</p>
            <CarcomaLink href={d.cta.href} className={d.soon ? 'btn btn--line btn--sm door__cta' : 'btn btn--ink btn--sm door__cta'}>{d.cta.label} <span aria-hidden="true">→</span></CarcomaLink>
          </li>
        ))}
      </ul>
      <LabGrid experiments={page.experiments} ui={settings.ui} />
    </main>
  );
}
