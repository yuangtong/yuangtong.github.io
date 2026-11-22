import type { Metadata } from 'next';
import { getNotesPage, getSettings } from '@/content';
import { NotesGrid } from '@/components/NotesGrid';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getNotesPage()).title }; }

export default async function NotesPage() {
  const [page, settings] = await Promise.all([getNotesPage(), getSettings()]);
  return (
    <main className="section">
      <div className="section__head">
        <h1 className="h2">{page.title}</h1>
        <p className="lead">{page.lead}</p>
      </div>
      <NotesGrid items={page.items} ui={settings.ui} />
    </main>
  );
}
