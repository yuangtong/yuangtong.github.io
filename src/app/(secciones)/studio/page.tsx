import type { Metadata } from 'next';
import { getStudioPage } from '@/content';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getStudioPage()).title }; }

export default async function StudioPage() {
  const page = await getStudioPage();
  return (
    <main className="section section--studio">
      <h1 className="vh">{page.title}</h1>
      <p className="studio__lead">{page.lead}</p>
      <p className="studio__sub">{page.sub}</p>
      <a href={page.cta.href} className="btn btn--paper-signal">{page.cta.label} <span aria-hidden="true">-&gt;</span></a>
    </main>
  );
}
