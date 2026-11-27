/**
 * Sanity settings, from the environment (see .env.example). Without a project
 * id the site runs on its local content and the panel at /admin says so.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-01';
export const sanityEnabled = projectId !== '';
