import type { Metadata } from 'next';
import { isProduction } from '@/lib/release';
import { SoonPiece } from '@/components/SoonPiece';
import { getLabPage, getMetroCardsPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { MetroCards } from '@/components/MetroCards';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getMetroCardsPage(locale)).title }; }

export default async function MetroCardsPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  // held back from the live site for now: there it shows as coming soon (owner, 2026-11-27)
  if (isProduction) { const lab = await getLabPage(locale); const door = lab.doors.find((d) => d.id === 'metro-cards')!; return <SoonPiece page={lab} door={door} />; }
  return (
    <main className="section section--piece">
      <MetroCards page={await getMetroCardsPage(locale)} />
    </main>
  );
}
