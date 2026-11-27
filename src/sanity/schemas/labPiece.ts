import { DocumentIcon } from '@sanity/icons/Document';
import { defineField, defineType } from 'sanity';
import { localized } from '../localized';

/**
 * The pieces of the lab (their pages and canvases live in the code), with the
 * id that ties each one to its code.
 */
export const LAB_PIECES = [
  { title: 'sísifo feliz', value: 'sisifo' },
  { title: 'lalande', value: 'lalande' },
  { title: 'travesía ácida', value: 'travesia' },
  { title: 'bitsplash', value: 'bitsplash' },
  { title: 'archivo.exe', value: 'archivo' },
  { title: 'sketchbook', value: 'sketchbook' },
  { title: 'boletos de lima', value: 'boletos' },
  { title: 'metro cards', value: 'metro-cards' },
  { title: 'cámara', value: 'camara' },
  { title: 'dona de teselas', value: 'dona' },
  { title: 'ambiente efímero', value: 'efimero' },
];

export const LAB_STATUS = [
  { title: 'Shown', value: 'live' },
  { title: 'Previews only (production says coming soon)', value: 'held' },
  { title: 'Coming soon', value: 'soon' },
  { title: 'Hidden', value: 'hidden' },
];

/** A door of the lab (LabDoor in src/content/types.ts). */
export const labPiece = defineType({
  name: 'labPiece',
  title: 'Lab piece',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'pieceId', title: 'Piece', description: 'Which piece of the code this is. Pieces whose page is not built yet can only be coming soon or hidden.',
      type: 'string', options: { list: LAB_PIECES }, validation: (r) => r.required(), readOnly: ({ value }) => Boolean(value),
    }),
    defineField({
      name: 'status', description: 'Shown: visible and open. Previews only: open on previews, "coming soon" on yuangtong.dev. Coming soon: the door leads to a page that says what it will be. Hidden: not in the lab.',
      type: 'string', options: { list: LAB_STATUS, layout: 'radio' }, initialValue: 'live', validation: (r) => r.required(),
    }),
    defineField({
      name: 'group', description: 'The shelf it sits on.',
      type: 'string', options: { list: [{ title: 'Story', value: 'story' }, { title: 'To play', value: 'play' }, { title: 'Archive', value: 'archive' }], layout: 'radio', direction: 'horizontal' },
      validation: (r) => r.required(),
    }),
    localized('title', 'Title'),
    localized('text', 'Text', { kind: 'text', description: 'The line on the door.' }),
    localized('cta', 'Button', { description: 'The label of the door\'s button.' }),
    localized('points', 'What it will be', {
      kind: 'list', optional: true, description: 'Lines on the coming soon page.',
      hidden: ({ parent }) => parent?.status !== 'soon' && parent?.status !== 'held',
    }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'status' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: LAB_STATUS.find((s) => s.value === subtitle)?.title }),
  },
});
