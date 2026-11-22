import type { Metadata } from 'next';
import { getLalandePage } from '@/content';
import { Lalande } from '@/components/Lalande';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getLalandePage()).title }; }

export default async function LalandePiece() {
  const page = await getLalandePage();
  return (
    <main className="section section--piece">
      <h1 className="vh">{page.title}</h1>
      <Lalande page={page} coverSrc="/media/perto-do-coracao-selvagem.jpg" />
    </main>
  );
}
