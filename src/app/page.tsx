import { getHomePage, getSettings } from '@/content';
import { Landing } from '@/components/Landing';
import { geistMono } from './fonts';

export default async function Home() {
  const [page, settings] = await Promise.all([getHomePage(), getSettings()]);
  return (
    <main>
      <Landing page={page} nav={settings.nav} ui={settings.ui} glyphFamily={geistMono.style.fontFamily} />
    </main>
  );
}
