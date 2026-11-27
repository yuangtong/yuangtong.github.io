import type { ArchivePalette, ArchivePhoto } from '@/content/types';
import type { Locale } from '@/content/locale';
import { sanityFetch } from './fetch';

type Localized = Partial<Record<Locale, string>> | null;
const pick = (v: Localized, locale: Locale) => v?.[locale] || v?.en || '';

type SanityArchivePhoto = {
  photoId: string; url: string | null; serie: Localized; date: string | null; alt: Localized;
  cell: number | null; palette: string | null; spotX: number | null; spotY: number | null;
};

const CELLS = [0, 2, 4, 8, 16] as const;
const PALETTES: ArchivePalette[] = ['tinta', 'azul', 'rojo', 'acida', 'color'];

/** archivo.exe's photos, in their order, with their series in order of first appearance. Null when the CMS has none. */
export async function fetchArchivePhotos(locale: Locale): Promise<{ photos: ArchivePhoto[]; series: string[] } | null> {
  const rows = await sanityFetch<SanityArchivePhoto[]>(
    `*[_type == "archivePhoto" && defined(image.asset)] | order(order asc, _createdAt asc) {
      photoId, "url": image.asset->url, serie, date, alt, cell, palette, spotX, spotY
    }`,
  );
  if (!rows?.length) return null;
  const photos = rows.filter((r) => r.url).map((r): ArchivePhoto => ({
    id: r.photoId,
    // a print on the desk is a few hundred cells wide: the CDN sends a light copy
    src: `${r.url}?w=1600&fit=max&auto=format&q=80`,
    serie: pick(r.serie, locale),
    date: r.date ?? '',
    alt: pick(r.alt, locale),
    cell: (CELLS as readonly number[]).includes(r.cell ?? -1) ? (r.cell as ArchivePhoto['cell']) : 4,
    palette: PALETTES.includes(r.palette as ArchivePalette) ? (r.palette as ArchivePalette) : 'color',
    spot: [r.spotX ?? 0.5, r.spotY ?? 0.5],
  }));
  if (!photos.length) return null;
  return { photos, series: [...new Set(photos.map((p) => p.serie))] };
}

/** The ids of the lab's pieces in the order the owner set. Null when not set. */
export async function fetchLabOrder(): Promise<string[] | null> {
  const doc = await sanityFetch<{ order: string[] | null } | null>(`*[_type == "labIndex" && _id == "labIndex"][0]{ order }`);
  return doc?.order?.length ? doc.order : null;
}
