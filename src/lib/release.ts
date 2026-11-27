/**
 * What production shows. Vercel sets VERCEL_ENV to "production" on the main
 * deploy and to "preview" on every pull request, so a piece held back
 * (`held`) stays on the previews and out of the live site (owner, 2026-11-27).
 */
export const isProduction = process.env.VERCEL_ENV === 'production';

/** Drop what is held back from production; keep everything elsewhere. */
export const released = <T extends { held?: boolean }>(items: T[]) => (isProduction ? items.filter((x) => !x.held) : items);
