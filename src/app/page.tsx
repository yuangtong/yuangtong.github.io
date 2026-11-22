import { getHomePage, getSettings } from '@/content';
import { IntroStory } from '@/components/IntroStory';
import { LabSection } from '@/components/LabSection';
import { StudioSection } from '@/components/StudioSection';
import { NotesSection } from '@/components/NotesSection';
import { ClosingSection } from '@/components/ClosingSection';
import { stitch } from './fonts';

export default async function Home() {
  const [page, settings] = await Promise.all([getHomePage(), getSettings()]);
  return (
    <main>
      <IntroStory intro={page.intro} nav={settings.nav} ui={settings.ui} />
      <LabSection lab={page.lab} ui={settings.ui} />
      <StudioSection studio={page.studio} />
      <NotesSection notes={page.notes} ui={settings.ui} />
      <ClosingSection contact={page.contact} footer={settings.footer} ui={settings.ui} stitchFamily={stitch.style.fontFamily} />
    </main>
  );
}
