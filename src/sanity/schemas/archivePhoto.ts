import { ImageIcon } from '@sanity/icons/Image';
import { defineField, defineType } from 'sanity';
import { localized } from '../localized';

/** A photo in archivo.exe (ArchivePhoto in src/content/types.ts). */
export const archivePhoto = defineType({
  name: 'archivePhoto',
  title: 'archivo.exe: photo',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'photoId', title: 'File name', description: 'Shown as the file name on the desk, e.g. IMG_4999.', type: 'string', validation: (r) => r.required() }),
    localized('serie', 'Series', { description: 'The folder it lives in, e.g. carretera / highway. Photos with the same series share a folder.' }),
    defineField({ name: 'date', title: 'Date', description: 'As it should read, e.g. 11 feb 2017, 13:30.', type: 'string' }),
    localized('alt', 'Description', { description: 'What the photo shows, for people who cannot see it.' }),
    defineField({
      name: 'cell', title: 'Cell size', description: 'Pixel size of the print on the desk; 0 is the original photo.', type: 'number',
      options: { list: [0, 2, 4, 8, 16], layout: 'radio', direction: 'horizontal' }, initialValue: 4, validation: (r) => r.required(),
    }),
    defineField({
      name: 'palette', title: 'Palette', type: 'string',
      options: { list: ['tinta', 'azul', 'rojo', 'acida', 'color'], layout: 'radio', direction: 'horizontal' }, initialValue: 'color', validation: (r) => r.required(),
    }),
    defineField({ name: 'spotX', title: 'Place on the desk, across', description: '0 is the left edge, 1 the right.', type: 'number', initialValue: 0.5, validation: (r) => r.min(0).max(1) }),
    defineField({ name: 'spotY', title: 'Place on the desk, down', description: '0 is the top, 1 the bottom.', type: 'number', initialValue: 0.5, validation: (r) => r.min(0).max(1) }),
    defineField({ name: 'order', description: 'Lower numbers come first.', type: 'number', initialValue: 100 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'photoId', subtitle: 'serie.es', media: 'image' } },
});
