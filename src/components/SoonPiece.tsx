import type { LabDoor, LabPage } from '@/content/types';
import { CarcomaLink } from './Carcoma';

/** A lab piece that is not shown yet: what it is, marked as coming soon, and the way back to the lab. */
export function SoonPiece({ page, door }: { page: LabPage; door: LabDoor }) {
  return (
    <main className="section">
      <div className="soon">
        <p className="label soon__chip">{page.soon.label}</p>
        <h1 className="h2">{door.title}</h1>
        <p className="lead">{door.text}</p>
        {door.points && <ul className="soon__list">{door.points.map((p) => <li key={p}>{p}</li>)}</ul>}
        <CarcomaLink href={page.soon.back.href} className="btn btn--ink btn--sm soon__back"><span aria-hidden="true">←</span> {page.soon.back.label}</CarcomaLink>
      </div>
    </main>
  );
}
