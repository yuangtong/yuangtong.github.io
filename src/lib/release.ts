/**
 * What production shows. Vercel sets VERCEL_ENV to "production" on the main
 * deploy and to "preview" on every pull request, so a piece held back
 * (`held`) is whole on the previews and "coming soon" on the live site (owner, 2026-11-27).
 */
export const isProduction = process.env.VERCEL_ENV === 'production';

/** In production a held piece shows as coming soon, with the coming-soon link label; elsewhere it shows as it is (owner, 2026-11-27). */
export const released = <T extends { held?: boolean; soon?: boolean; cta: { label: string; href: string } }>(items: T[], soonCta: string) =>
  isProduction ? items.map((x) => (x.held ? { ...x, soon: true, cta: { ...x.cta, label: soonCta } } : x)) : items;
