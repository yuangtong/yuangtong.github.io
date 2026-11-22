import { getContactPage, getHomePage, getSettings } from '@/content';
import { Landing } from '@/components/Landing';
import { geistMono } from './fonts';

export default async function Home() {
  const [page, settings, contact] = await Promise.all([getHomePage(), getSettings(), getContactPage()]);
  return (
    <main>
      <Landing page={page} nav={settings.nav} links={contact.links} ui={settings.ui} glyphFamily={geistMono.style.fontFamily} />
    </main>
  );
}
