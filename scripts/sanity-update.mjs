/**
 * Applies small edits to documents that already live in Sanity, without
 * touching anything else: each entry of scripts/sanity-updates.json sets the
 * given fields on one document (dotted paths, e.g. "text.es"). Used when copy
 * decided in a conversation has to reach the panel and the owner's other
 * edits must stay. Runs in the "Sanity seed" GitHub Action (label
 * `sanity-update`) or locally with SANITY_AUTH_TOKEN set.
 */
import { createClient } from '@sanity/client';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
for (const f of ['.env.local', '.env']) {
  const p = join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, SANITY_AUTH_TOKEN: token } = process.env;
if (!projectId || !token) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_AUTH_TOKEN first.');
  process.exit(1);
}
const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-11-01', token, useCdn: false });

/** @type {{ id: string, set: Record<string, unknown>, why?: string }[]} */
const updates = JSON.parse(readFileSync(join(root, 'scripts/sanity-updates.json'), 'utf8'));
// an unpublished edit in the panel is a draft; patch it too, or publishing it would undo this
const ids = updates.flatMap((u) => [u.id, `drafts.${u.id}`]);
const existing = new Set(await client.fetch('*[_id in $ids]._id', { ids }));
const tx = client.transaction();
for (const u of updates) {
  const targets = [u.id, `drafts.${u.id}`].filter((id) => existing.has(id));
  if (!targets.length) { console.warn(`${u.id}: not found, skipped`); continue; }
  console.log(`${targets.join(' + ')}: ${Object.keys(u.set).join(', ')}${u.why ? ` (${u.why})` : ''}`);
  for (const id of targets) tx.patch(id, (p) => p.set(u.set));
}
const res = await tx.commit();
console.log(`updated ${res.results.length} documents`);
