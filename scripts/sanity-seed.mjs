/**
 * Copies the content that now lives in the code into Sanity, once: the lab's
 * order and archivo.exe's photos (with their image files from /public).
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

docs.push({ _id: 'labIndex', _type: 'labIndex', order: en.labPage.doors.map((d) => d.id) });

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
