import type { Metadata } from 'next';
import { getSketchbookPage } from '@/content';
import { routeLocale, type LangParams } from '@/app/[lang]/locale';
import { Sketchbook } from '@/components/Sketchbook';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> { const locale = await routeLocale(params); return { title: (await getSketchbookPage(locale)).title }; }

export default async function SketchbookPiece({ params }: LangParams) {
  const locale = await routeLocale(params);
  return (
    <main className="section section--piece">
      <Sketchbook page={await getSketchbookPage(locale)} />
    </main>
  );
}
