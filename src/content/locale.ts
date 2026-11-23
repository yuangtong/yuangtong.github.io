/**
 * The site's languages. English is primary and lives at the root; Spanish
 * lives under /es. Content keeps canonical paths ("/lab"); the loaders add
 * the prefix for the locale they serve.
 */
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** "/lab" in a locale: "/lab" in English, "/es/lab" in Spanish. External links and anchors pass through. */
export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale || !path.startsWith('/') || path.startsWith('//')) return path;
  return path === '/' ? `/${locale}` : path.startsWith('/#') ? `/${locale}${path.slice(1)}` : `/${locale}${path}`;
}

/** A visible path without its locale prefix, and the locale it was in. */
export function splitPath(pathname: string): { locale: Locale; path: string } {
  const m = pathname.match(/^\/([a-z]{2})(?=[/#?]|$)/);
  if (m && isLocale(m[1]) && m[1] !== defaultLocale) { const rest = pathname.slice(3); return { locale: m[1], path: rest.startsWith('/') ? rest : `/${rest}` }; }
  return { locale: defaultLocale, path: pathname };
}

/** Every `href` (and every key of a crumb record) in a content object, in the given locale. */
export function localize<T>(value: T, locale: Locale): T {
  if (locale === defaultLocale) return value;
  const walk = (v: unknown, key?: string): unknown => {
    if (typeof v === 'string') return key === 'href' ? localePath(locale, v) : v;
    if (Array.isArray(v)) return v.map((x) => walk(x));
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) out[key === 'crumbs' ? localePath(locale, k) : k] = walk(x, k);
      return out;
    }
    return v;
  };
  return walk(value) as T;
}
