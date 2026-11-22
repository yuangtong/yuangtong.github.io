import type { Metadata } from 'next';
import { getContactPage, getHomePage, getSettings, getSisyphusPage } from '@/content';
import { Landing } from '@/components/Landing';
import { geistMono } from '../../../fonts';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getSisyphusPage()).title }; }

/** Sísifo in the lab: the landing's story on its own page, with the narration on. */
export default async function SisyphusPiece() {
  const [story, page, settings, contact] = await Promise.all([getSisyphusPage(), getHomePage(), getSettings(), getContactPage()]);
  return (
    <main className="section section--piece">
      <h1 className="vh">{story.title}</h1>
      <Landing page={page} nav={settings.nav} links={contact.links} ui={settings.ui} glyphFamily={geistMono.style.fontFamily} piece={{ label: story.label, hint: story.hint, replay: story.replay }} />
    </main>
  );
}
