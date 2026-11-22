import { getNotFoundPage } from '@/content';

export default async function NotFound() {
  const p = await getNotFoundPage();
  return (
    <main className="notfound">
      <h1 className="h2">{p.title}</h1>
      <p className="lead">{p.body}</p>
      <a href={p.back.href} className="btn btn--ink">{p.back.label}</a>
    </main>
  );
}
