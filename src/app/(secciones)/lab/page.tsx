import type { Metadata } from 'next';
import { getLabPage, getSettings } from '@/content';
import { LabGrid } from '@/components/LabGrid';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getLabPage()).title }; }

export default async function LabPage() {
  const [page, settings] = await Promise.all([getLabPage(), getSettings()]);
  return (
    <main className="section section--lab">
      <div className="section__head">
        <h1 className="h2">{page.title}</h1>
        <p className="lead">{page.lead}</p>
      </div>
      <LabGrid experiments={page.experiments} ui={settings.ui} />
    </main>
  );
}
