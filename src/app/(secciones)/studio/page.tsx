import type { Metadata } from 'next';
import { getStudioPage } from '@/content';
import { Studio } from '@/components/Studio';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getStudioPage()).title }; }

export default async function StudioPage() {
  return <Studio page={await getStudioPage()} />;
}
