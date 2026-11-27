import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLabPage, locales } from '@/content';
import { routeLocale } from '@/app/[lang]/locale';
import { SoonPiece } from '@/components/SoonPiece';

/** The page of a planned lab piece (docs/LAB.md): what it will be, marked as coming soon. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = new Set<string>();
  for (const l of locales) for (const d of (await getLabPage(l)).doors) if (d.soon && !d.held) ids.add(d.id); // a held piece has its own page
  return [...ids].map((pieza) => ({ pieza }));
}

type Params = { params: Promise<{ lang: string; pieza: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { pieza } = await params;
  const door = (await getLabPage(await routeLocale(params))).doors.find((d) => d.id === pieza && d.soon && !d.held);
  return { title: door?.title };
}

export default async function SoonRoute({ params }: Params) {
  const { pieza } = await params;
  const page = await getLabPage(await routeLocale(params));
  const door = page.doors.find((d) => d.id === pieza && d.soon && !d.held);
  if (!door) notFound();
  return <SoonPiece page={page} door={door} />;
}
