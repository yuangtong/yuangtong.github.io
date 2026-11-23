import { notFound } from 'next/navigation';

/** Any path the site does not have, in either language, lands on the 404. */
export default function Rest() { notFound(); }
