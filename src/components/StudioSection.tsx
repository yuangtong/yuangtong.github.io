import type { HomePage } from '@/content/types';
import { AcidSticker } from './AcidSticker';

export function StudioSection({ studio }: { studio: HomePage['studio'] }) {
  return (
    <section id="studio" className="studio">
      <h2 className="h2">{studio.title}</h2>
      <div className="studio__body">
        <p className="studio__lead">{studio.body}</p>
        <a href={studio.cta.href} className="btn btn--electric">{studio.cta.label}</a>
      </div>
      <AcidSticker shape="f22" accent="azul" outline="paper" className="acid--studio" />
    </section>
  );
}
