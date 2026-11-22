import type { Metadata } from 'next';
import { getContactPage } from '@/content';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getContactPage()).title }; }

export default async function ContactPage() {
  const page = await getContactPage();
  return (
    <main className="section section--contact">
      <h1 className="contact__title">{page.title}</h1>
      <p className="contact__lead">{page.lead} <a href={page.email.href}>{page.email.label}</a></p>
      <div className="contact__links">{page.links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
    </main>
  );
}
