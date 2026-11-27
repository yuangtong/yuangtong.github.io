import type { Metadata } from 'next';
import { getAboutPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { About } from '@/components/About';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getAboutPage(locale)).title }; }

export default async function AboutRoute({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section--about">
      <About page={await getAboutPage(locale)} />
    </main>
  );
}
