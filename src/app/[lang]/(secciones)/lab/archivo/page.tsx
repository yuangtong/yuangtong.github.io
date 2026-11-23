import type { Metadata } from 'next';
import { getArchivePage } from '@/content';
import { localePath } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Archivo } from '@/components/Archivo';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getArchivePage(locale)).title }; }

export default async function ArchivoPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  const page = await getArchivePage(locale);
  return (
    <main className="section section--archivo">
      <h1 className="vh">{page.title}</h1>
      <Archivo page={page} backHref={localePath(locale, '/lab')} />
    </main>
  );
}
