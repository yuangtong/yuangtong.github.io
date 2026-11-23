import type { Metadata, Viewport } from 'next';
import { color } from '@/lib/tokens';
import { getSettings } from '@/content';
import { CarcomaProvider } from '@/components/Carcoma';
import { DitherCursor } from '@/components/DitherCursor';
import { geistMono, host, notoTc, script } from './fonts';
import './tokens.css';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return { metadataBase: site ? new URL(site) : undefined, title: { default: s.siteTitle, template: `%s | ${s.siteTitle.split('|')[0].trim()}` }, description: s.description, openGraph: { type: 'website', locale: 'en_US', siteName: 'yuang tong', url: '/', title: s.share.title, description: s.share.description, images: [{ url: s.share.image, width: s.share.width, height: s.share.height, alt: s.share.alt }] },
    twitter: { card: 'summary_large_image', title: s.share.title, description: s.share.description, images: [{ url: s.share.image, alt: s.share.alt }] } };
}

export const viewport: Viewport = { themeColor: color.paper };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={[host.variable, geistMono.variable, notoTc.variable, script.variable].join(' ')}>
      <body><CarcomaProvider>{children}<DitherCursor /></CarcomaProvider></body>
    </html>
  );
}
