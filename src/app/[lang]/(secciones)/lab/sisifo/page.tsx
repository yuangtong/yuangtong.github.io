import type { Metadata } from 'next';
import { getContactPage, getHomePage, getSettings, getSisyphusPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Landing } from '@/components/Landing';
import { geistMono } from '../../../../fonts';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getSisyphusPage(locale)).title }; }

/** Sísifo in the lab: the landing's story on its own page, with the narration on. */
export default async function SisyphusPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  const [story, page, settings, contact] = await Promise.all([getSisyphusPage(locale), getHomePage(locale), getSettings(locale), getContactPage(locale)]);
  return (
    <main className="section section--piece">
      <h1 className="vh">{story.title}</h1>
      <Landing page={page} nav={settings.nav} links={contact.links} ui={settings.ui} languages={settings.languages} glyphFamily={geistMono.style.fontFamily} piece={{ label: story.label, hint: story.hint, replay: story.replay }} />
    </main>
  );
}
