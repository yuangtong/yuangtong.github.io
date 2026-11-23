import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLabPage } from '@/content';
import { CarcomaLink } from '@/components/Carcoma';

/** The page of a planned lab piece (docs/LAB.md): what it will be, marked as coming soon. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getLabPage()).doors.filter((d) => d.soon).map((d) => ({ pieza: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ pieza: string }> }): Promise<Metadata> {
  const { pieza } = await params;
  const door = (await getLabPage()).doors.find((d) => d.id === pieza && d.soon);
  return { title: door?.title };
}

export default async function SoonPiece({ params }: { params: Promise<{ pieza: string }> }) {
  const { pieza } = await params;
  const page = await getLabPage();
  const door = page.doors.find((d) => d.id === pieza && d.soon);
  if (!door) notFound();
  return (
    <main className="section">
      <div className="soon">
        <p className="label soon__chip">{page.soon.label}</p>
        <h1 className="h2">{door.title}</h1>
        <p className="lead">{door.text}</p>
        {door.points && <ul className="soon__list">{door.points.map((p) => <li key={p}>{p}</li>)}</ul>}
        <CarcomaLink href={page.soon.back.href} className="btn btn--ink btn--sm soon__back"><span aria-hidden="true">←</span> {page.soon.back.label}</CarcomaLink>
      </div>
    </main>
  );
}
