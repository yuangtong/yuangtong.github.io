import type { HomePage, NotFoundPage, Settings } from './types';
import { home, notFound } from './fixtures/home';
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
