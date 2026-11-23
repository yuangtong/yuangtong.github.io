import type { Metadata } from 'next';
import { getTravesiaPage } from '@/content';
import { localePath } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Travesia } from '@/components/Travesia';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getTravesiaPage(locale)).title }; }

export default async function TravesiaPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <Travesia page={await getTravesiaPage(locale)} backHref={localePath(locale, '/lab')} />
    </main>
  );
}
