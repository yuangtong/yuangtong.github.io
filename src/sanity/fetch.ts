import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, sanityEnabled } from './env';

const client = sanityEnabled ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' }) : null;

/** Seconds a page keeps what it read before asking Sanity again. */
const REVALIDATE = 60;

/**
 * Reads published content. Returns null when Sanity is not configured or
 * cannot be reached, so the loaders fall back to the local content and the
 * site never breaks because of the CMS.
 */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } });
  } catch (err) {
    console.error('[sanity] fetch failed, using local content:', err instanceof Error ? err.message : err);
    return null;
  }
}
