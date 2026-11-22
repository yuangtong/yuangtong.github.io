import type { ContactPage, HomePage, LabPage, NotesPage, NotFoundPage, Settings, StudioPage } from './types';
import { contactPage, home, labPage, notesPage, notFound, studioPage } from './fixtures/home';
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
