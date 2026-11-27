import type { Metadata, Viewport } from 'next';
import { color } from '@/lib/tokens';
import { getSettings, locales, localePath } from '@/content';
import { CarcomaProvider } from '@/components/Carcoma';
import { AsciiCursor } from '@/components/AsciiCursor';
import { geistMono, host, notoTc, script } from '../fonts';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import '../tokens.css';
import '../globals.css';

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const s = await getSettings(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: site ? new URL(site) : undefined,
    title: { default: s.siteTitle, template: `%s | ${s.siteTitle.split('|')[0].trim()}` },
    description: s.description,
    // favicon "yt" (canvas "favicon v3", approved 2026-11-23): Host Grotesk outlined, y and t joined, on a soft tile
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico', sizes: '16x16 32x32 48x48' }], apple: '/apple-touch-icon.png' },
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, localePath(l, '/')])) },
    openGraph: { type: 'website', locale: s.ogLocale, siteName: 'yuang tong', url: localePath(locale, '/'), title: s.share.title, description: s.share.description, images: [{ url: s.share.image, width: s.share.width, height: s.share.height, alt: s.share.alt }] },
    twitter: { card: 'summary_large_image', title: s.share.title, description: s.share.description, images: [{ url: s.share.image, alt: s.share.alt }] },
  };
}

export const viewport: Viewport = { themeColor: color.paper };

export default async function RootLayout({ children, params }: { children: React.ReactNode } & LangParams) {
  const locale = await routeLocale(params);
  return (
    <html lang={locale} className={[host.variable, geistMono.variable, notoTc.variable, script.variable].join(' ')}>
      <body><CarcomaProvider>{children}<AsciiCursor /></CarcomaProvider></body>
    </html>
  );
}
