import type { AboutPage, ArchivePage, BitsplashPage, SketchbookPage, BoletosPage, CamaraPage, ContactPage, MetroCardsPage, HomePage, LabPage, NotesPage, NotFoundPage, LalandePage, NotePage, Settings, StoryPage, StudioPage, TravesiaPage } from './types';
import { defaultLocale, localize, type Locale } from './locale';
import * as en from './fixtures/en/home';
import * as es from './fixtures/es/home';
import { settings as enSettings } from './fixtures/en/settings';
import { settings as esSettings } from './fixtures/es/settings';
import { fetchArchivePhotos, fetchLab, fetchNotes } from '@/sanity/queries';

export { locales, defaultLocale, isLocale, localePath, splitPath, type Locale } from './locale';

/*
 * Loaders. Pages read content only through these functions, for a locale.
 * Content that lives in Sanity (the lab's pieces and order, archivo.exe's
 * photos, the notes) is
 * read from it and laid over the local content; when Sanity is not set up or
 * has nothing yet, the local content is used as it is. `localize` puts
 * internal links in the locale's paths.
 */
const pages = { en, es } as const;
const settingsBy = { en: enSettings, es: esSettings } as const;
const get = <T>(locale: Locale, pick: (p: typeof en) => T): T => localize(pick(pages[locale]), locale);

export async function getSettings(locale: Locale): Promise<Settings> {
  return localize(settingsBy[locale], locale);
}

export async function getHomePage(locale: Locale): Promise<HomePage> {
  return get(locale, (p) => p.home);
}

export async function getNotFoundPage(locale: Locale): Promise<NotFoundPage> {
  return get(locale, (p) => p.notFound);
}

export async function getLabPage(locale: Locale): Promise<LabPage> {
  const page = get(locale, (p) => p.labPage);
  const cms = await fetchLab(locale);
  if (!cms) return page;
  const doors = page.doors.flatMap((d) => {
    const o = cms.pieces.get(d.id);
    if (!o) return [d];
    if (o.hidden) return [];
    // a piece whose page is not built yet is always coming soon. A built piece
    // is held when it is "previews only" (open on previews, coming soon on
    // yuangtong.dev) or "coming soon" (coming soon everywhere: soon and held).
    const planned = d.soon === true;
    const held = !planned && (o.held === true || o.soon === true);
    const soon = planned || o.soon === true;
    return [{
      ...d,
      group: o.group ?? d.group, title: o.title ?? d.title, text: o.text ?? d.text, points: o.points ?? d.points,
      cta: { ...d.cta, label: o.ctaLabel ?? d.cta.label },
      soon: soon || undefined, held: held || undefined,
    }];
  });
  // pieces left out of the order keep their place after the ordered ones
  const rank = (id: string) => { const i = cms.order.indexOf(id); return i < 0 ? cms.order.length : i; };
  const sorted = doors.map((d, i) => ({ d, i })).sort((a, b) => rank(a.d.id) - rank(b.d.id) || a.i - b.i).map(({ d }) => d);
  return { ...page, doors: sorted };
}

/** The notes from the CMS in a language, or null to use the local ones. */
const cmsNotes = async (locale: Locale) => {
  const back = pages[locale].notes[0]?.backLabel ?? pages[defaultLocale].notes[0]?.backLabel ?? '';
  return fetchNotes(locale, back);
};

export async function getNotesPage(locale: Locale): Promise<NotesPage> {
  const page = get(locale, (p) => p.notesPage);
  const cms = await cmsNotes(locale);
  return cms ? { ...page, items: localize(cms.items, locale) } : page;
}

export async function getStudioPage(locale: Locale): Promise<StudioPage> {
  return get(locale, (p) => p.studioPage);
}

export async function getContactPage(locale: Locale): Promise<ContactPage> {
  return get(locale, (p) => p.contactPage);
}

export async function getArchivePage(locale: Locale): Promise<ArchivePage> {
  const page = get(locale, (p) => p.archivePage);
  const cms = await fetchArchivePhotos(locale);
  return cms ? { ...page, ...cms } : page;
}

export async function getSisyphusPage(locale: Locale): Promise<StoryPage> {
  return get(locale, (p) => p.sisyphusPage);
}

export async function getLalandePage(locale: Locale): Promise<LalandePage> {
  return get(locale, (p) => p.lalandePage);
}

export async function getTravesiaPage(locale: Locale): Promise<TravesiaPage> {
  return get(locale, (p) => p.travesiaPage);
}

export async function getNote(locale: Locale, slug: string): Promise<NotePage | null> {
  const cms = await cmsNotes(locale);
  if (cms) return localize(cms.pages.find((n) => n.slug === slug) ?? null, locale);
  return get(locale, (p) => p.notes.find((n) => n.slug === slug) ?? null);
}

export async function getNoteSlugs(locale: Locale): Promise<string[]> {
  const cms = await cmsNotes(locale);
  return cms ? cms.pages.map((n) => n.slug) : pages[locale].notes.map((n) => n.slug);
}

export async function getBoletosPage(locale: Locale): Promise<BoletosPage> {
  return get(locale, (p) => p.boletosPage);
}

export async function getMetroCardsPage(locale: Locale): Promise<MetroCardsPage> {
  return get(locale, (p) => p.metroCardsPage);
}

export async function getSketchbookPage(locale: Locale): Promise<SketchbookPage> {
  return get(locale, (p) => p.sketchbookPage);
}

export async function getAboutPage(locale: Locale): Promise<AboutPage> {
  return get(locale, (p) => p.aboutPage);
}

export async function getBitsplashPage(locale: Locale): Promise<BitsplashPage> {
  return get(locale, (p) => p.bitsplashPage);
}

export async function getCamaraPage(locale: Locale): Promise<CamaraPage> {
  return get(locale, (p) => p.camaraPage);
}
