import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale } from '@/content/locale';

/**
 * English is served at the root and Spanish under /es. A path without a
 * locale is rewritten to the English route; "/en/..." redirects to the root
 * so each page has one address.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1] ?? '';
  // the editing panel (Sanity Studio) is not a page of the site
  if (first === 'admin') return NextResponse.next();
  if (first === defaultLocale) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/';
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // pages only: not Next's own files, not files with an extension (media, images, icons)
  matcher: ['/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)'],
};
