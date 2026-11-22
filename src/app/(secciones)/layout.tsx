import { getContactPage, getHomePage, getSettings } from '@/content';
import { SiteHeader } from '@/components/SiteHeader';

export default async function SectionsLayout({ children }: { children: React.ReactNode }) {
  const [settings, home, contact] = await Promise.all([getSettings(), getHomePage(), getContactPage()]);
  return (
    <div className="section-shell">
      <SiteHeader nav={settings.nav} links={contact.links} ui={settings.ui} name={home.intro.name} nameZh={home.intro.nameZh} availability={home.intro.availability} crumbs={settings.crumbs} />
      {children}
    </div>
  );
}
