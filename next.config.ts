import type { NextConfig } from 'next';

// the Spanish paths from before English became the primary language
const moved = [
  ['/notas', '/notes'], ['/notas/:slug', '/notes/:slug'], ['/contacto', '/contact'],
  ['/es/notas', '/es/notes'], ['/es/notas/:slug', '/es/notes/:slug'], ['/es/contacto', '/es/contact'],
];

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default config;
