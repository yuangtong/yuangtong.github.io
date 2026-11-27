import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isProduction } from '@/lib/release';
import { getBoletosPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Boletos } from '@/components/Boletos';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getBoletosPage(locale)).title }; }

export default async function BoletosPiece({ params }: LangParams) {
  if (isProduction) notFound();   // held back from the live site for now (owner, 2026-11-27)
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <Boletos page={await getBoletosPage(locale)} />
    </main>
  );
}
