import type { Metadata } from 'next';
import { getCamaraPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Camara } from '@/components/Camara';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getCamaraPage(locale)).title }; }

export default async function CamaraPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <Camara page={await getCamaraPage(locale)} />
    </main>
  );
}
