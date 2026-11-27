import { defineCliConfig } from 'sanity/cli';

/** For `npx sanity ...` (dataset, CORS, schema deploy). Reads the same variables as the site. */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});
