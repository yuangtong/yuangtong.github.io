/**
 * Machine translates the English content into the languages the owner is
 * learning (Portuguese, Chinese, Japanese) with DeepL.
 *
 *   node scripts/translate.mts          translate new or changed strings
 *   node scripts/translate.mts --dry    list what would be translated, no API calls
 *   node scripts/translate.mts --force  translate every string again
 *   node scripts/translate.mts --fake   no API calls; wraps each string in [locale]
 *                                      to check the pipeline end to end
 *
 * Normally it runs in the "Translate with DeepL" GitHub Action, which reads
 * the key from the repository secret DEEPL_API_KEY and opens a pull request
 * with the result. The site never calls DeepL at request time.
 *
 * Source: the English fixtures (`src/content/fixtures/en`). Output, per
 * locale: `src/content/fixtures/<locale>/content.json` (same shapes as the
 * English modules) and `lock.json`; then `translated.ts` and `learning.ts`,
 * which turn those languages on in the site. `lock.json` is a hash of the English source of every
 * string. Only strings whose English source changed are sent again, so a
 * manual fix in content.json survives until that English string changes.
 *
 * Requires Node 22.6 or later (runs TypeScript by stripping types).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as home from '../src/content/fixtures/en/home.ts';
import { settings } from '../src/content/fixtures/en/settings.ts';

type Target = { deepl: string; formality?: 'prefer_less' | 'prefer_more'; ogLocale: string };

/** The languages the owner is learning, and how DeepL names them. */
const TARGETS: Record<string, Target> = {
  pt: { deepl: 'PT-BR', formality: 'prefer_less', ogLocale: 'pt_BR' },
  zh: { deepl: 'ZH-HANS', ogLocale: 'zh_CN' },
  ja: { deepl: 'JA', formality: 'prefer_less', ogLocale: 'ja_JP' },
};

/** Values under these keys are data (links, ids, names), never copy. */
const SKIP_KEYS = new Set([
  'href', 'src', 'image', 'id', 'slug', 'zone', 'code', 'type', 'visual', 'preview', 'group', 'palette', 'accent',
  'serie', 'series', 'name', 'nameZh', 'brand', 'host', 'email', 'locale', 'ogLocale', 'word',
]);

/**
 * Proper nouns that stay as they are in every language: piece titles (kept in
 * Spanish in the English site too), people, tools and the studio. Longest first.
 */
const PROTECTED = [
  'lalande, lágrimas de ángel', 'perto do coração selvagem', 'hola@yuangtong.dev', 'eadweard muybridge', 'clarice lispector',
  'boletos de lima', 'travesía ácida', 'ambiente efímero', 'dona de teselas', 'cámara tramada', 'creative coder', 'sísifo feliz',
  'FOMMO Studio', 'fommo.studio', 'archivo.exe', 'archivo 98', 'metro cards', 'medio tono', 'yuang tong', 'bitsplash', 'sketchbook',
  'Muybridge', 'strudel', 'lalande', 'pasaje', 'hydra', 'cámara', 'FOMMO', '唐源',
].sort((a, b) => b.length - a.length);

const CONTEXT =
  'Personal portfolio of a web designer and creative coder from Lima, Peru. Short, casual, lowercase interface copy and ' +
  'accessibility descriptions of pixel-art animations. Keep the tone informal and the lowercase style.';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'src/content/fixtures');
const args = new Set(process.argv.slice(2));
const dry = args.has('--dry');
const force = args.has('--force');
const fake = args.has('--fake');

type Flat = Record<string, string>;

/** Every translatable string in the content, by its path ("home.intro.line"). */
function collect(value: unknown, at: string, out: Flat, key?: string, parent?: Record<string, unknown>) {
  if (typeof value === 'string') {
    if (parent?.type === 'code') return; // code samples stay as written
    if (!/\p{L}/u.test(value) || value === '#') return;
    out[at] = value;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collect(v, `${at}.${i}`, out, key, parent));
  } else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) if (!SKIP_KEYS.has(k)) collect(v, `${at}.${JSON.stringify(k)}`, out, k, obj);
  }
}

/** Paths are dot separated; object keys are JSON strings so keys with dots or slashes survive. */
function splitPath(p: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const re = /\.(?:("(?:[^"\\]|\\.)*")|(\d+))/g;
  let m: RegExpExecArray | null;
  const rest = p.slice(p.indexOf('.'));
  while ((m = re.exec(rest))) parts.push(m[1] ? (JSON.parse(m[1]) as string) : Number(m[2]));
  return parts;
}

function setAt(root: Record<string, unknown>, p: string, text: string) {
  const parts = splitPath(p);
  let node = root as Record<string | number, unknown>;
  for (const part of parts.slice(0, -1)) node = node[part] as Record<string | number, unknown>;
  node[parts[parts.length - 1]] = text;
}

const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unescapeXml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const protectRe = new RegExp(`(\\{[a-zA-Z]+\\}|${PROTECTED.map(escapeRe).join('|')})`, 'gi');

/** Placeholders ({time}) and proper nouns go inside <x>, which DeepL leaves untouched. */
const protect = (s: string) => escapeXml(s).replace(protectRe, '<x>$1</x>');
const unprotect = (s: string) => unescapeXml(s.replace(/<\/?x>/g, ''));

function deeplEndpoint(key: string) {
  // free keys end in ":fx" and live on their own host
  return key.endsWith(':fx') ? 'https://api-free.deepl.com/v2' : 'https://api.deepl.com/v2';
}

async function translate(texts: string[], target: Target, locale: string): Promise<string[]> {
  if (fake) return texts.map((t) => unprotect(`[${locale}] ${t}`));
  const key = process.env.DEEPL_API_KEY ?? '';
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += 50) {
    const batch = texts.slice(i, i + 50);
    const res = await fetch(`${deeplEndpoint(key)}/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: batch,
        source_lang: 'EN',
        target_lang: target.deepl,
        ...(target.formality ? { formality: target.formality } : {}),
        context: CONTEXT,
        tag_handling: 'xml',
        ignore_tags: ['x'],
        preserve_formatting: true,
      }),
    });
    if (!res.ok) throw new Error(`DeepL answered ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { translations: { text: string }[] };
    out.push(...data.translations.map((t) => unprotect(t.text)));
  }
  return out;
}

async function usage() {
  const key = process.env.DEEPL_API_KEY ?? '';
  const res = await fetch(`${deeplEndpoint(key)}/usage`, { headers: { Authorization: `DeepL-Auth-Key ${key}` } });
  if (!res.ok) return;
  const { character_count: used, character_limit: limit } = (await res.json()) as { character_count: number; character_limit: number };
  console.log(`DeepL usage this period: ${used.toLocaleString('en')} of ${limit.toLocaleString('en')} characters`);
}

const readJson = <T>(file: string, fallback: T): T => (existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback);
const writeJson = (file: string, data: unknown) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

/**
 * The site serves a learning language once its content.json exists: write the
 * list (read by the routes and the language selector, so it stays small) and
 * the content module the loaders import.
 */
function writeIndex() {
  const ready = Object.keys(TARGETS).filter((l) => existsSync(path.join(OUT, l, 'content.json')));
  writeFileSync(path.join(OUT, 'translated.ts'),
    '// Generated by scripts/translate.mts: the learning languages whose translation exists. Do not edit.\n' +
    `export const translated = [${ready.map((l) => `'${l}'`).join(', ')}] as const satisfies readonly string[];\n`);
  writeFileSync(path.join(OUT, 'learning.ts'),
    '// Generated by scripts/translate.mts: the machine translated content, by language. Do not edit.\n' +
    "import type { LearningContent } from './learning-types';\n" +
    ready.map((l) => `import ${l} from './${l}/content.json';\n`).join('') +
    `\nexport const learning: Partial<Record<string, LearningContent>> = {${ready.map((l) => ` ${l}: ${l} as unknown as LearningContent`).join(',')}${ready.length ? ' ' : ''}};\n`);
}

async function main() {
  if (!dry && !fake && !process.env.DEEPL_API_KEY) {
    console.error('DEEPL_API_KEY is not set. In GitHub it is the repository secret DEEPL_API_KEY (see docs/TRANSLATION.md).');
    process.exit(1);
  }

  const source = { home: { ...home }, settings };
  const flat: Flat = {};
  collect(source, 'content', flat);

  for (const [locale, target] of Object.entries(TARGETS)) {
    const dir = path.join(OUT, locale);
    const contentFile = path.join(dir, 'content.json');
    const lockFile = path.join(dir, 'lock.json');
    const previous: Record<string, unknown> = readJson(contentFile, {});
    const prevFlat: Flat = {};
    collect(previous, 'content', prevFlat);
    const lock: Flat = force ? {} : readJson(lockFile, {});

    const todo = Object.keys(flat).filter((k) => lock[k] !== hash(flat[k]) || prevFlat[k] === undefined);
    const chars = todo.reduce((n, k) => n + flat[k].length, 0);
    console.log(`[${locale}] ${todo.length} to translate (${chars} characters), ${Object.keys(flat).length - todo.length} unchanged`);
    if (dry) { todo.forEach((k) => console.log(`  + ${k}`)); continue; }

    const fresh = todo.length ? await translate(todo.map((k) => protect(flat[k])), target, locale) : [];
    const done = new Map(todo.map((k, i) => [k, fresh[i]]));

    // rebuild from the English source so links, ids and numbers always follow it
    const next = structuredClone(source) as unknown as Record<string, unknown>;
    const nextLock: Flat = {};
    for (const k of Object.keys(flat)) {
      setAt(next, k, done.get(k) ?? prevFlat[k]);
      nextLock[k] = hash(flat[k]);
    }
    const s = next.settings as Record<string, unknown>;
    s.locale = locale;
    s.ogLocale = target.ogLocale;

    mkdirSync(dir, { recursive: true });
    writeJson(contentFile, next);
    writeJson(lockFile, nextLock);
    console.log(`[${locale}] wrote ${path.relative(ROOT, contentFile)}`);
  }

  if (!dry) writeIndex();
  if (!dry && !fake) await usage().catch(() => undefined);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
