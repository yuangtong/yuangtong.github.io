import { getContactPage, getHomePage, getNotFoundPage, getSettings, locales } from '@/content';
import { NotFoundView, type NotFoundCopy } from '@/components/NotFoundView';

/**
 * 404: the number in dots, the horse crashes into it (design G "404", reworked).
 * A not-found page gets no route params, so it carries both languages and the
 * browser picks the one in the path; the pages around it stay static.
 */
export default async function NotFound() {
  const copy = Object.fromEntries(await Promise.all(locales.map(async (l) => {
    const [page, settings, home, contact] = await Promise.all([getNotFoundPage(l), getSettings(l), getHomePage(l), getContactPage(l)]);
    return [l, { page, settings, intro: home.intro, links: contact.links }] as const;
  }))) as unknown as Record<(typeof locales)[number], NotFoundCopy>;
  return <NotFoundView copy={copy} />;
}
