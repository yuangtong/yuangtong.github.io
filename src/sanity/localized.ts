import { defineField } from 'sanity';
import { locales } from '@/content/locale';

/**
 * A text written once per language of the site: { en, es }. English is
 * required; a missing translation falls back to it in the loaders.
 */
export const localizedString = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'object',
    options: { columns: locales.length },
    fields: locales.map((lang, i) =>
      defineField({
        name: lang,
        title: lang.toUpperCase(),
        type: 'string',
        validation: i === 0 ? (r) => r.required() : undefined,
      }),
    ),
  });
