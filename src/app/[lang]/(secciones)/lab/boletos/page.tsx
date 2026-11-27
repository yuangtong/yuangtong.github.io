import type { Metadata } from 'next';
import { isProduction } from '@/lib/release';
import { SoonPiece } from '@/components/SoonPiece';
import { getLabPage, getBoletosPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Boletos } from '@/components/Boletos';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getBoletosPage(locale)).title }; }

export default async function BoletosPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  // held back from the live site for now: there it shows as coming soon (owner, 2026-11-27)
  if (isProduction) { const lab = await getLabPage(locale); const door = lab.doors.find((d) => d.id === 'boletos')!; return <SoonPiece page={lab} door={door} />; }
  return (
    <main className="section section--piece">
      <Boletos page={await getBoletosPage(locale)} />
    </main>
  );
}
