import type { Metadata } from 'next';
import { getTravesiaPage } from '@/content';
import { Travesia } from '@/components/Travesia';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getTravesiaPage()).title }; }

export default async function TravesiaPiece() {
  return (
    <main className="section section--piece">
      <Travesia page={await getTravesiaPage()} backHref="/lab" />
    </main>
  );
}
