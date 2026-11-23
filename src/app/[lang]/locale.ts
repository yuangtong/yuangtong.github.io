import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/content';

export type LangParams = { params: Promise<{ lang: string }> };

/** The route's locale; an unknown one is a 404. */
export async function routeLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
