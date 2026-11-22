import type { Metadata } from 'next';
import { getContactPage } from '@/content';
import { Contact } from '@/components/Contact';

export async function generateMetadata(): Promise<Metadata> { return { title: (await getContactPage()).title }; }

export default async function ContactPage() {
  return <Contact page={await getContactPage()} />;
}
