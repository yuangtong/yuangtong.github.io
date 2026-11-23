import type { Metadata } from 'next';
import { getContactPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Contact } from '@/components/Contact';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getContactPage(locale)).title }; }

export default async function ContactPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  return <Contact page={await getContactPage(locale)} />;
}
