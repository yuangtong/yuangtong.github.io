/**
 * Copies the content that now lives in the code into Sanity, once: the lab's
 * pieces and order, archivo.exe's photos and the notes (with their image
 * files from /public).
 * Two ways to run it:
 *  - in the cloud: the "Sanity seed" GitHub Action (.github/workflows/sanity-seed.yml),
 *    with a write token in the SANITY_AUTH_TOKEN secret;
 *  - on a machine, with the owner's own login: `npx sanity login`, then
 *    `npm run sanity:seed`.
 *
 * Documents get fixed ids, so running it again overwrites them with the
 * code's version instead of making copies. Needs NEXT_PUBLIC_SANITY_PROJECT_ID
 * (in .env.local or the shell).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');

// read .env.local like Next does, without overriding the shell
for (const f of ['.env.local', '.env']) {
  const p = join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID (in .env.local) first.');
  process.exit(1);
}
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// the fixtures are TypeScript; Node 22.18+ reads them by stripping the types
const en = await import(pathToFileURL(join(root, 'src/content/fixtures/en/home.ts')).href);
const es = await import(pathToFileURL(join(root, 'src/content/fixtures/es/home.ts')).href);

const docs = [];
const asset = (src) => {
  const file = join(root, 'public', src);
  return existsSync(file) ? { _type: 'image', _sanityAsset: `image@${pathToFileURL(file).href}` } : null;
};
const both = (en, es) => ({ en, es });

// the lab: one document per piece, and the order (owner, 2026-11-27)
const ORDER = ['sisifo', 'lalande', 'travesia', 'bitsplash', 'archivo', 'sketchbook', 'boletos', 'metro-cards', 'camara', 'dona', 'efimero'];
const doors = [...en.labPage.doors].sort((a, b) => (ORDER.indexOf(a.id) + 1 || 99) - (ORDER.indexOf(b.id) + 1 || 99));
for (const d of doors) {
  const e = es.labPage.doors.find((x) => x.id === d.id) ?? d;
  docs.push({
    _id: `labPiece-${d.id}`, _type: 'labPiece', pieceId: d.id,
    status: d.soon ? 'soon' : d.held ? 'held' : 'live', group: d.group,
    title: both(d.title, e.title), text: both(d.text, e.text), cta: both(d.cta.label, e.cta.label),
    ...(d.points ? { points: both(d.points, e.points ?? d.points) } : {}),
  });
}
docs.push({ _id: 'labIndex', _type: 'labIndex', pieces: doors.map((d) => ({ _key: d.id, _type: 'reference', _ref: `labPiece-${d.id}` })) });

// notes: the listed cards and the written pages, one document per language
for (const [lang, mod] of [['en', en], ['es', es]]) {
  const slugs = [...new Set([...mod.notesPage.items.map((n) => n.id), ...mod.notes.map((n) => n.slug)])];
  slugs.forEach((slug, i) => {
    const card = mod.notesPage.items.find((n) => n.id === slug);
    const page = mod.notes.find((n) => n.slug === slug);
    docs.push({
      _id: `note-${slug}-${lang}`, _type: 'note', language: lang, slug: { _type: 'slug', current: slug },
      title: page?.title ?? card?.title ?? slug, order: (i + 1) * 10,
      // listed and with a page: published; listed only: coming soon; written but not listed: hidden
      status: card ? (card.soon || !page ? 'soon' : 'live') : 'hidden',
      excerpt: card?.excerpt ?? '', meta: card?.meta ?? '', cardAlt: card?.alt ?? '', visual: card?.visual ?? 'foto', accent: card?.accent ?? 'azul',
      lead: page?.lead ?? '', date: page?.date ?? '', about: page?.about ?? '', credit: page?.credit ?? '',
      blocks: (page?.blocks ?? []).flatMap((b, k) => {
        const _key = `b${k}`;
        if (b.type === 'p') return [{ _key, _type: 'paragraph', text: b.text }];
        if (b.type === 'code') return [{ _key, _type: 'code', text: b.text }];
        const image = asset(b.src);
        return image ? [{ _key, _type: 'figure', image, alt: b.alt, caption: b.caption, paper: Boolean(b.paper) }] : [];
      }),
      links: (page?.links ?? []).map((l, k) => ({ _key: `l${k}`, ...l })),
    });
  });
}

en.archivePage.photos.forEach((p, i) => {
  const esp = es.archivePage.photos.find((x) => x.id === p.id) ?? p;
  const file = join(root, 'public', p.src);
  if (!existsSync(file)) { console.warn(`skipping ${p.id}: ${file} not found`); return; }
  docs.push({
    _id: `archivePhoto-${p.id.toLowerCase()}`,
    _type: 'archivePhoto',
    image: { _type: 'image', _sanityAsset: `image@${pathToFileURL(file).href}` },
    photoId: p.id,
    serie: { en: p.serie, es: esp.serie },
    date: p.date,
    alt: { en: p.alt, es: esp.alt },
    cell: p.cell,
    palette: p.palette,
    spotX: p.spot[0],
    spotY: p.spot[1],
    order: (i + 1) * 10,
  });
});

const out = join(mkdtempSync(join(tmpdir(), 'sanity-seed-')), 'seed.ndjson');
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`${docs.length} documents -> ${dataset}`);

// in CI there is no login: a write token (SANITY_AUTH_TOKEN) stands in for it
const token = process.env.SANITY_AUTH_TOKEN ? ['--token', process.env.SANITY_AUTH_TOKEN] : [];
const r = spawnSync('npx', ['sanity', 'dataset', 'import', out, '--dataset', dataset, '--replace', ...token], { cwd: root, stdio: 'inherit', env: process.env });
process.exit(r.status ?? 1);
