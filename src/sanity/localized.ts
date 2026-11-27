import { defineArrayMember, defineField } from 'sanity';
import { writtenLocales as locales } from '@/content/locale';

type Kind = 'string' | 'text' | 'list';

/**
 * A field written once per language of the site: { en, es }. English is
 * required unless the field is optional; a missing translation falls back to
 * English in the loaders. `list` is a list of short lines per language.
 */
export const localized = (name: string, title: string, opts: { kind?: Kind; description?: string; optional?: boolean; hidden?: (ctx: { parent?: Record<string, unknown> }) => boolean } = {}) => {
  const kind = opts.kind ?? 'string';
  return defineField({
    name,
    title,
    description: opts.description,
    type: 'object',
    hidden: opts.hidden as never,
    options: kind === 'string' ? { columns: locales.length } : undefined,
    fields: locales.map((lang, i) =>
      defineField({
        name: lang,
        title: lang.toUpperCase(),
        ...(kind === 'list'
          ? { type: 'array', of: [defineArrayMember({ type: 'string' })] }
          : { type: kind, ...(kind === 'text' ? { rows: 3 } : {}) }),
        validation: i === 0 && !opts.optional ? (r: { required: () => unknown }) => r.required() : undefined,
      } as Parameters<typeof defineField>[0]),
    ),
  });
};

