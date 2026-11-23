import { getContactPage, getHomePage, getSettings } from '@/content';
import { Landing } from '@/components/Landing';
import { geistMono } from '../fonts';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';

export default async function Home({ params }: LangParams) {
  const locale = await routeLocale(params);
  const [page, settings, contact] = await Promise.all([getHomePage(locale), getSettings(locale), getContactPage(locale)]);
  return (
    <main>
      <Landing page={page} nav={settings.nav} links={contact.links} ui={settings.ui} languages={settings.languages} glyphFamily={geistMono.style.fontFamily} />
    </main>
  );
}
