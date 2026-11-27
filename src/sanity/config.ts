'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './env';
import { schemaTypes, singletons } from './schemas';

/** The editing panel, served by the site at /admin. */
export default defineConfig({
  name: 'portfolio',
  title: 'yuangtong.dev',
  basePath: '/admin',
  projectId,
  dataset,
  apiVersion,
  schema: {
    types: schemaTypes,
    // singletons are opened from the menu, never created again
    templates: (all) => all.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType) ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items([
          S.listItem().title('Lab: order').id('labIndex').child(S.document().schemaType('labIndex').documentId('labIndex')),
          S.divider(),
          S.documentTypeListItem('archivePhoto').title('archivo.exe: photos'),
        ]),
    }),
  ],
});
