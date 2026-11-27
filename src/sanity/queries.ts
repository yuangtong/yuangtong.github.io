import { defineQuery } from 'next-sanity';
import type { ArchivePalette, ArchivePhoto, LabDoor, NoteBlock, NotePage, Note, Accent, NoteVisual } from '@/content/types';
import { defaultLocale, type Locale } from '@/content/locale';
import { sanityFetch } from './fetch';

type Localized<T = string> = Partial<Record<Locale, T>> | null;
const pick = <T>(v: Localized<T>, locale: Locale): T | undefined => {
  const own = v?.[locale];
  return (Array.isArray(own) ? own.length : own) ? own : v?.[defaultLocale] ?? undefined;
};

/* ---------- archivo.exe ---------- */

export const ARCHIVE_PHOTOS_QUERY = defineQuery(`*[_type == "archivePhoto" && defined(image.asset)] | order(order asc, _createdAt asc) {
  photoId, "url": image.asset->url, serie, date, alt, cell, palette, spotX, spotY
}`);

type SanityArchivePhoto = {
  photoId: string; url: string | null; serie: Localized; date: string | null; alt: Localized;
  cell: number | null; palette: string | null; spotX: number | null; spotY: number | null;
};

const CELLS = [0, 2, 4, 8, 16] as const;
const PALETTES: ArchivePalette[] = ['tinta', 'azul', 'rojo', 'acida', 'color'];

/** archivo.exe's photos, in their order, with their series in order of first appearance. Null when the CMS has none. */
export async function fetchArchivePhotos(locale: Locale): Promise<{ photos: ArchivePhoto[]; series: string[] } | null> {
  const rows = await sanityFetch<SanityArchivePhoto[]>(ARCHIVE_PHOTOS_QUERY);
  if (!rows?.length) return null;
  const photos = rows.filter((r) => r.url).map((r): ArchivePhoto => ({
    id: r.photoId,
    // a print on the desk is a few hundred cells wide: the CDN sends a light copy
    src: `${r.url}?w=1600&fit=max&auto=format&q=80`,
    serie: pick(r.serie, locale) ?? '',
    date: r.date ?? '',
    alt: pick(r.alt, locale) ?? '',
    cell: (CELLS as readonly number[]).includes(r.cell ?? -1) ? (r.cell as ArchivePhoto['cell']) : 4,
    palette: PALETTES.includes(r.palette as ArchivePalette) ? (r.palette as ArchivePalette) : 'color',
    spot: [r.spotX ?? 0.5, r.spotY ?? 0.5],
  }));
  if (!photos.length) return null;
  return { photos, series: [...new Set(photos.map((p) => p.serie))] };
}

/* ---------- lab ---------- */

export const LAB_QUERY = defineQuery(`{
  "order": *[_id == "labIndex"][0].pieces[]->pieceId,
  "pieces": *[_type == "labPiece" && defined(pieceId)]{ pieceId, status, group, title, text, cta, points }
}`);

type SanityLabPiece = {
  pieceId: string; status: 'live' | 'held' | 'soon' | 'hidden' | null; group: LabDoor['group'] | null;
  title: Localized; text: Localized; cta: Localized; points: Localized<string[]>;
};

/** A door's words and status from the CMS, laid over the door in the code. */
export type LabOverride = Partial<Pick<LabDoor, 'group' | 'title' | 'text' | 'points' | 'held' | 'soon'>> & { ctaLabel?: string; hidden?: boolean };

/** What the CMS says about the lab's doors: their order, and per piece its words and status. Null when nothing is set. */
export async function fetchLab(locale: Locale): Promise<{ order: string[]; pieces: Map<string, LabOverride> } | null> {
  const data = await sanityFetch<{ order: (string | null)[] | null; pieces: SanityLabPiece[] | null }>(LAB_QUERY);
  if (!data) return null;
  const order = (data.order ?? []).filter((x): x is string => Boolean(x));
  const pieces = new Map<string, LabOverride>();
  for (const p of data.pieces ?? []) {
    const status = p.status ?? 'live';
    pieces.set(p.pieceId, {
      ...(p.group ? { group: p.group } : {}),
      ...(pick(p.title, locale) ? { title: pick(p.title, locale) } : {}),
      ...(pick(p.text, locale) ? { text: pick(p.text, locale) } : {}),
      ...(pick(p.cta, locale) ? { ctaLabel: pick(p.cta, locale) } : {}),
      ...(pick(p.points, locale)?.length ? { points: pick(p.points, locale) } : {}),
      held: status === 'held', soon: status === 'soon', hidden: status === 'hidden',
    });
  }
  if (!order.length && !pieces.size) return null;
  return { order, pieces };
}

/* ---------- notes ---------- */

const NOTE_FIELDS = `
  "slug": slug.current, title, status, excerpt, meta, cardAlt, visual, accent, lead, date, about, credit,
  blocks[]{ _type, text, alt, caption, paper, "url": image.asset->url, "w": image.asset->metadata.dimensions.width, "h": image.asset->metadata.dimensions.height },
  links[]{ label, title, href }`;

export const NOTES_QUERY = defineQuery(`*[_type == "note" && language == $locale && defined(slug.current) && status != "hidden"] | order(order asc, _createdAt desc) {${NOTE_FIELDS}}`);

type SanityNote = {
  slug: string; title: string; status: 'live' | 'soon'; excerpt: string | null; meta: string | null; cardAlt: string | null;
  visual: NoteVisual | null; accent: Accent | null; lead: string | null; date: string | null; about: string | null; credit: string | null;
  blocks: { _type: string; text?: string; alt?: string; caption?: string; paper?: boolean; url?: string; w?: number; h?: number }[] | null;
  links: { label: string; title: string; href: string }[] | null;
};

/** The notes in a language: the cards of the list and the pages. Null when the CMS has none in that language. */
export async function fetchNotes(locale: Locale, backLabel: string): Promise<{ items: Note[]; pages: NotePage[] } | null> {
  const rows = await sanityFetch<SanityNote[]>(NOTES_QUERY, { locale });
  if (!rows?.length) return null;
  const items = rows.map((n): Note => ({
    id: n.slug, title: n.title, excerpt: n.excerpt ?? '', meta: n.meta ?? '', href: `/notes/${n.slug}`, alt: n.cardAlt ?? '',
    visual: n.visual ?? 'foto', accent: n.accent ?? 'azul', ...(n.status === 'soon' ? { soon: true } : {}),
  }));
  const pages = rows.map((n): NotePage => ({
    slug: n.slug, title: n.title, lead: n.lead ?? '', date: n.date ?? '', about: n.about ?? '', backLabel, credit: n.credit ?? '',
    blocks: (n.blocks ?? []).flatMap((b): NoteBlock[] =>
      b._type === 'paragraph' && b.text ? [{ type: 'p', text: b.text }]
        : b._type === 'code' && b.text ? [{ type: 'code', text: b.text }]
          : b._type === 'figure' && b.url ? [{ type: 'figure', src: `${b.url}?w=2400&fit=max&auto=format`, alt: b.alt ?? '', caption: b.caption ?? '', width: b.w ?? 1600, height: b.h ?? 900, ...(b.paper ? { paper: true } : {}) }]
            : []),
    links: n.links ?? [],
  }));
  return { items, pages };
}
