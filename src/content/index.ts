import type { ArchivePage, BitsplashPage, SketchbookPage, BoletosPage, ContactPage, MetroCardsPage, HomePage, LabPage, NotesPage, NotFoundPage, LalandePage, NotePage, Settings, StoryPage, StudioPage, TravesiaPage } from './types';
import { localize, type Locale } from './locale';
import * as en from './fixtures/en/home';
import * as es from './fixtures/es/home';
import { settings as enSettings } from './fixtures/en/settings';
import { settings as esSettings } from './fixtures/es/settings';

export { locales, defaultLocale, isLocale, localePath, splitPath, type Locale } from './locale';

/*
 * Loaders. Pages read content only through these functions, for a locale.
 * The CMS agent replaces their bodies with Sanity queries that return the
 * same shapes; `localize` puts internal links in the locale's paths.
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
  return get(locale, (p) => p.labPage);
}

export async function getNotesPage(locale: Locale): Promise<NotesPage> {
  return get(locale, (p) => p.notesPage);
}

export async function getStudioPage(locale: Locale): Promise<StudioPage> {
  return get(locale, (p) => p.studioPage);
}

export async function getContactPage(locale: Locale): Promise<ContactPage> {
  return get(locale, (p) => p.contactPage);
}

export async function getArchivePage(locale: Locale): Promise<ArchivePage> {
  return get(locale, (p) => p.archivePage);
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
  return get(locale, (p) => p.notes.find((n) => n.slug === slug) ?? null);
}

export async function getNoteSlugs(locale: Locale): Promise<string[]> {
  return pages[locale].notes.map((n) => n.slug);
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

export async function getBitsplashPage(locale: Locale): Promise<BitsplashPage> {
  return get(locale, (p) => p.bitsplashPage);
}
