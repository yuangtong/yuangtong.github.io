import type { Metadata } from 'next';
import { getLabPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { LabDoors } from '@/components/LabDoors';
import { released } from '@/lib/release';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getLabPage(locale)).title }; }

export default async function LabPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  const page = await getLabPage(locale);
  return (
    <main className="section section--lab">
      <div className="section__head">
        <h1 className="h2">{page.title}</h1>
        <p className="lead">{page.lead}</p>
      </div>
      <LabDoors page={{ ...page, doors: released(page.doors) }} />
    </main>
  );
}
