import { SortIcon } from '@sanity/icons/Sort';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * The order of the doors in the lab. The pieces themselves (their pages and
 * texts) live in the code; this only says which comes first.
 */
export const LAB_PIECES = [
  { title: 'sísifo feliz', value: 'sisifo' },
  { title: 'lalande', value: 'lalande' },
  { title: 'travesía ácida', value: 'travesia' },
  { title: 'bitsplash', value: 'bitsplash' },
  { title: 'archivo.exe', value: 'archivo' },
  { title: 'boletos de lima', value: 'boletos' },
  { title: 'metro cards', value: 'metro-cards' },
  { title: 'sketchbook', value: 'sketchbook' },
  { title: 'cámara', value: 'camara' },
  { title: 'dona de teselas', value: 'dona' },
  { title: 'ambiente efímero', value: 'efimero' },
];

export const labIndex = defineType({
  name: 'labIndex',
  title: 'Lab: order',
  type: 'document',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'order', title: 'Order of the pieces', description: 'Drag to reorder. Pieces left out keep their place after these.',
      type: 'array', of: [defineArrayMember({ type: 'string', options: { list: LAB_PIECES } })],
      validation: (r) => r.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Lab: order' }) },
});
