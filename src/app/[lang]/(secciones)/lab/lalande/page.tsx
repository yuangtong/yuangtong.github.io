import type { Metadata } from 'next';
import { getLalandePage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Lalande } from '@/components/Lalande';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getLalandePage(locale)).title }; }

export default async function LalandePiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  const page = await getLalandePage(locale);
  return (
    <main className="section section--piece">
      <h1 className="vh">{page.title}</h1>
      <Lalande page={page} coverSrc="/media/perto-do-coracao-selvagem.jpg" />
    </main>
  );
}
