import { getContactPage, getHomePage, getSettings } from '@/content';
import { SiteHeader } from '@/components/SiteHeader';
import { CursorOn } from '@/components/CursorOn';

const pad = (n: number) => String(n).padStart(2, '0');

export default async function SectionsLayout({ children }: { children: React.ReactNode }) {
  const [settings, home, contact] = await Promise.all([getSettings(), getHomePage(), getContactPage()]);
  const label = (href: string, fallback: string) => settings.nav.find((l) => l.href === href)?.label ?? fallback;
  // numbered as the landing's sheets: 01 jugar, 02 lab, 03 notas, 04 studio, 05 contacto
  const { lab, notes, studio } = home.sheets;
  const strips = [
    { href: lab.href, title: lab.title },
    { href: notes.href, title: notes.title },
    { href: studio.href, title: studio.title },
    { href: home.sheets.contact.href, title: label(home.sheets.contact.href, contact.title) },
  ].map((s, i) => ({ ...s, n: pad(i + 2) }));
  return (
    <div className="section-shell">
      <CursorOn />
      <SiteHeader nav={settings.nav} links={contact.links} ui={settings.ui} name={home.intro.name} nameZh={home.intro.nameZh} availability={home.intro.availability} crumbs={settings.crumbs} strips={strips} />
      {children}
    </div>
  );
}
