import type { Metadata } from 'next';
import { getStudioPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Studio } from '@/components/Studio';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getStudioPage(locale)).title }; }

export default async function StudioPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  return <Studio page={await getStudioPage(locale)} />;
}
