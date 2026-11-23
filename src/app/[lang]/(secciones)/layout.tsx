import { getContactPage, getHomePage, getSettings } from '@/content';
import { SiteHeader } from '@/components/SiteHeader';
import { CursorOn } from '@/components/CursorOn';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';

const pad = (n: number) => String(n).padStart(2, '0');

export default async function SectionsLayout({ children, params }: { children: React.ReactNode } & LangParams) {
  const locale = await routeLocale(params);
  const [settings, home, contact] = await Promise.all([getSettings(locale), getHomePage(locale), getContactPage(locale)]);
  const label = (href: string, fallback: string) => settings.nav.find((l) => l.href === href)?.label ?? fallback;
  // numbered as the landing's sheets, in the navigation's order: 01 about, 02 lab, 03 studio, 04 notes, 05 contact
  const { lab, notes, studio } = home.sheets;
  const strips = [
    { href: lab.href, title: lab.title },
    { href: studio.href, title: studio.title },
    { href: notes.href, title: notes.title },
    { href: home.sheets.contact.href, title: label(home.sheets.contact.href, contact.title) },
  ].map((s, i) => ({ ...s, n: pad(i + 2) }));
  return (
    <div className="section-shell">
      <CursorOn />
      <SiteHeader nav={settings.nav} links={contact.links} ui={settings.ui} languages={settings.languages} name={home.intro.name} nameZh={home.intro.nameZh} availability={home.intro.availability} crumbs={settings.crumbs} strips={strips} />
      {children}
    </div>
  );
}
