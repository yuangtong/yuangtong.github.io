import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getNote, getNoteSlugs, getNotesPage, getSettings, localePath, locales } from '@/content';
import { routeLocale } from '@/app/[lang]/locale';
import type { NoteBlock } from '@/content/types';
import { CarcomaLink } from '@/components/Carcoma';

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = new Set<string>();
  // a note that is not published yet has no page (owner, 2026-11-27)
  for (const l of locales) { const off = new Set((await getNotesPage(l)).items.filter((n) => n.soon).map((n) => n.id)); for (const s of await getNoteSlugs(l)) if (!off.has(s)) slugs.add(s); }
  return [...slugs].map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const note = await getNote(await routeLocale(params), (await params).slug);
  return note ? { title: note.title, description: note.lead } : {};
}

/** Reading time from the words in the note, at about 200 a minute. */
const minutes = (blocks: NoteBlock[]) => Math.max(1, Math.ceil(blocks.reduce((n, b) => n + (b.type === 'figure' ? 0 : b.text.split(/\s+/).length), 0) / 200));

/** A note (design G, "notas: una nota"): the text runs in a column, figures go full width. */
export default async function NotePiece({ params }: Params) {
  const locale = await routeLocale(params);
  const [note, settings] = await Promise.all([getNote(locale, (await params).slug), getSettings(locale)]);
  const slug = (await params).slug;
  if (!note || (await getNotesPage(locale)).items.some((n) => n.id === slug && n.soon)) notFound();
  // consecutive text blocks share one column; figures break it
  const groups: (NoteBlock | NoteBlock[])[] = [];
  for (const b of note.blocks) {
    if (b.type === 'figure') groups.push(b);
    else if (Array.isArray(groups[groups.length - 1])) (groups[groups.length - 1] as NoteBlock[]).push(b);
    else groups.push([b]);
  }
  return (
    <main className="section nota">
      <div className="nota__row">
        <div className="nota__meta">
          <CarcomaLink href={localePath(locale, '/notes')} className="nota__back">{note.backLabel}</CarcomaLink>
          <span>{note.date}</span>
          <span>{minutes(note.blocks)} {settings.ui.readingTime}</span>
          <span>{note.about}</span>
        </div>
        <div className="nota__head">
          <h1 className="nota__title">{note.title}</h1>
          <p className="nota__lead">{note.lead}</p>
        </div>
      </div>
      {groups.map((g, i) =>
        Array.isArray(g) ? (
          <div key={i} className="nota__row">
            <span />
            <div className="nota__body">
              {g.map((b, j) => (b.type === 'code' ? <pre key={j} className="nota__code">{b.text}</pre> : b.type === 'p' ? <p key={j}>{b.text}</p> : null))}
            </div>
          </div>
        ) : g.type === 'figure' ? (
          <figure key={i} className="nota__figure">
            <Image src={g.src} alt={g.alt} width={g.width} height={g.height} className={g.paper ? 'is-paper' : undefined} sizes="(max-width: 760px) 100vw, 1376px" />
            <figcaption>{g.caption}</figcaption>
          </figure>
        ) : null,
      )}
      <div className="nota__row">
        <span />
        <nav className="nota__links">
          {note.links.map((l) => (
            <CarcomaLink key={l.href + l.title} href={l.href} className="nota__link"><span>{l.label}</span><span className="nota__link-title">{l.title}</span></CarcomaLink>
          ))}
        </nav>
      </div>
      <p className="label nota__credit">{note.credit}</p>
    </main>
  );
}
