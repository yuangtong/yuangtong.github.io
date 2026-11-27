import type { Metadata } from 'next';
import { getNotesPage, getSettings } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { NotesGrid } from '@/components/NotesGrid';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getNotesPage(locale)).title }; }

export default async function NotesPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  const [page, settings] = await Promise.all([getNotesPage(locale), getSettings(locale)]);
  return (
    <main className="section">
      <div className="section__head">
        <h1 className="h2">{page.title}</h1>
        <p className="lead">{page.lead}</p>
      </div>
      <NotesGrid items={page.items} ui={settings.ui} soon={page.soon} />
    </main>
  );
}
