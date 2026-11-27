import type { Metadata } from 'next';
import { getMetroCardsPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { MetroCards } from '@/components/MetroCards';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getMetroCardsPage(locale)).title }; }

export default async function MetroCardsPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <MetroCards page={await getMetroCardsPage(locale)} />
    </main>
  );
}
