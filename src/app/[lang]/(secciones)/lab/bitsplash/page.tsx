import type { Metadata } from 'next';
import { getBitsplashPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Bitsplash } from '@/components/Bitsplash';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getBitsplashPage(locale)).title }; }

export default async function BitsplashPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <Bitsplash page={await getBitsplashPage(locale)} />
    </main>
  );
}
