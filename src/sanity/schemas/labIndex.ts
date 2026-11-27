import { SortIcon } from '@sanity/icons/Sort';
import { defineArrayMember, defineField, defineType } from 'sanity';

/** The order of the lab's doors: drag the pieces. */
export const labIndex = defineType({
  name: 'labIndex',
  title: 'Lab: order',
  type: 'document',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'pieces', title: 'Order of the pieces', description: 'Drag to reorder. Pieces left out keep their place after these.',
      type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'labPiece' }] })],
      validation: (r) => r.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Lab: order' }) },
});
