import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'admin | yuangtong.dev', robots: { index: false, follow: false } };

/** The editing panel has its own document: none of the site's canvas, cursor or fonts. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
