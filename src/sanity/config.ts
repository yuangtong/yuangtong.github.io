'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { SortIcon } from '@sanity/icons/Sort';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { writtenLocales as locales } from '@/content/locale';
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
    templates: (all) => [
      ...all.filter(({ schemaType }) => !singletons.has(schemaType)),
      { id: 'note-lang', title: 'Note in a language', schemaType: 'note', parameters: [{ name: 'language', type: 'string' }], value: (p: { language: string }) => ({ language: p.language }) },
    ],
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType) ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items([
          S.listItem().title('Lab: order').id('labIndex').icon(SortIcon).child(S.document().schemaType('labIndex').documentId('labIndex')),
          S.documentTypeListItem('labPiece').title('Lab: pieces'),
          S.divider(),
          S.documentTypeListItem('archivePhoto').title('archivo.exe: photos'),
          S.divider(),
          S.listItem().title('Notes').icon(DocumentTextIcon).child(
            S.list().title('Notes').items(locales.map((l) =>
              S.listItem().title(`Notes (${l.toUpperCase()})`).child(
                S.documentTypeList('note').title(`Notes (${l.toUpperCase()})`).filter('_type == "note" && language == $l').params({ l })
                  .initialValueTemplates([S.initialValueTemplateItem('note-lang', { language: l })]),
              ),
            )),
          ),
        ]),
    }),
  ],
});
