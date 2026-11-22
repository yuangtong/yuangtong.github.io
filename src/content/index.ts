import type { ArchivePage, ContactPage, HomePage, LabPage, NotesPage, NotFoundPage, LalandePage, Settings, StoryPage, StudioPage, TravesiaPage } from './types';
import { archivePage, contactPage, home, labPage, lalandePage, notesPage, notFound, sisyphusPage, studioPage, travesiaPage } from './fixtures/home';
import { settings } from './fixtures/settings';

/*
 * Loaders. Pages read content only through these functions. The CMS agent
 * replaces their bodies with Sanity queries that return the same shapes.
 */

export async function getSettings(): Promise<Settings> {
  return settings;
}

export async function getHomePage(): Promise<HomePage> {
  return home;
}

export async function getNotFoundPage(): Promise<NotFoundPage> {
  return notFound;
}

export async function getLabPage(): Promise<LabPage> {
  return labPage;
}

export async function getNotesPage(): Promise<NotesPage> {
  return notesPage;
}

export async function getStudioPage(): Promise<StudioPage> {
  return studioPage;
}

export async function getContactPage(): Promise<ContactPage> {
  return contactPage;
}

export async function getArchivePage(): Promise<ArchivePage> {
  return archivePage;
}

export async function getSisyphusPage(): Promise<StoryPage> {
  return sisyphusPage;
}

export async function getLalandePage(): Promise<LalandePage> {
  return lalandePage;
}

export async function getTravesiaPage(): Promise<TravesiaPage> {
  return travesiaPage;
}
