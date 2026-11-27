import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { locales } from '@/content/locale';

/**
 * A note: how a piece was made (Note and NotePage in src/content/types.ts).
 * One document per language; the versions of a note share its slug.
 */
export const note = defineType({
  name: 'note',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [{ name: 'card', title: 'Card', default: true }, { name: 'body', title: 'Note' }],
  fields: [
    defineField({ name: 'language', type: 'string', options: { list: locales.map((l) => ({ title: l.toUpperCase(), value: l })), layout: 'radio', direction: 'horizontal' }, initialValue: 'es', validation: (r) => r.required() }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', description: 'The address, the same in every language: /notes/<slug>.', type: 'slug', options: { source: 'title', maxLength: 64 }, validation: (r) => r.required() }),
    defineField({
      name: 'status', description: 'Published: listed and readable. Coming soon: the card is listed, switched off, and the note has no page. Hidden: neither.',
      type: 'string', options: { list: [{ title: 'Published', value: 'live' }, { title: 'Coming soon', value: 'soon' }, { title: 'Hidden', value: 'hidden' }], layout: 'radio' },
      initialValue: 'soon', validation: (r) => r.required(),
    }),
    defineField({ name: 'order', description: 'Lower numbers come first in the list.', type: 'number', initialValue: 100 }),
    // the card in the list of notes
    defineField({ name: 'excerpt', type: 'text', rows: 2, group: 'card' }),
    defineField({ name: 'meta', description: 'The small line on the card, e.g. "código, nov 2026".', type: 'string', group: 'card' }),
    defineField({ name: 'cardAlt', title: 'Card image description', type: 'string', group: 'card' }),
    defineField({ name: 'visual', title: 'Card image', type: 'string', options: { list: [{ title: 'Photo', value: 'foto' }, { title: 'Echoes', value: 'ecos' }, { title: 'Donut', value: 'dona' }], layout: 'radio', direction: 'horizontal' }, initialValue: 'foto', group: 'card' }),
    defineField({ name: 'accent', type: 'string', options: { list: ['azul', 'rosado', 'lima'], layout: 'radio', direction: 'horizontal' }, initialValue: 'azul', group: 'card' }),
    // the note itself
    defineField({ name: 'lead', type: 'text', rows: 3, group: 'body' }),
    defineField({ name: 'date', description: 'As it should read, e.g. noviembre 2026.', type: 'string', group: 'body' }),
    defineField({ name: 'about', description: 'e.g. sobre: medio tono.', type: 'string', group: 'body' }),
    defineField({
      name: 'blocks', title: 'Body', type: 'array', group: 'body',
      of: [
        defineArrayMember({ name: 'paragraph', type: 'object', fields: [defineField({ name: 'text', type: 'text', rows: 4 })], preview: { select: { title: 'text' } } }),
        defineArrayMember({ name: 'code', type: 'object', fields: [defineField({ name: 'text', type: 'text', rows: 8 })], preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'code' }) } }),
        defineArrayMember({
          name: 'figure', type: 'object',
          fields: [
            defineField({ name: 'image', type: 'image', validation: (r) => r.required() }),
            defineField({ name: 'alt', title: 'Description', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'caption', type: 'string' }),
            defineField({ name: 'paper', description: 'Sit the image on the paper colour (for drawings on white).', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'caption', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'links', type: 'array', group: 'body',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'title', type: 'string' }), defineField({ name: 'href', type: 'string' })], preview: { select: { title: 'title', subtitle: 'label' } } })],
    }),
    defineField({ name: 'credit', type: 'string', group: 'body' }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'language', status: 'status' }, prepare: ({ title, subtitle, status }) => ({ title, subtitle: `${subtitle?.toUpperCase()} · ${status}` }) },
});
