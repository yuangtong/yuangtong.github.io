import type { Metadata } from 'next';
import { getArchivePage } from '@/content';
import { Archivo } from '@/components/Archivo';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getArchivePage()).title }; }

export default async function ArchivoPage() {
  const page = await getArchivePage();
  return (
    <main className="section section--archivo">
      <h1 className="vh">{page.title}</h1>
      <Archivo page={page} backHref="/lab" />
    </main>
  );
}
