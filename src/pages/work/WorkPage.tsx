// Archivo: WorkPage.tsx
// Propósito: Página de archivo de trabajos; usa useContent('works') y añade navegación.
import React from 'react';
import { motion } from 'framer-motion';
import { WorkItem } from './FeaturedWork';
import { useContent } from '../../hooks/useContent';
import NavigationBar from '../../components/ui/NavigationBar';

export const WorkPage = () => {
  const { items: works, loading, error } = useContent<any>('works');
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegación contextual para listados con sticky/fixed en scroll */}
        <NavigationBar topClass="top-14 sm:top-16 md:top-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Featured Work</h1>
          <p className="text-lg font-mono">
            A selection of my best professional projects
          </p>
        </motion.div>

        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <div className="space-y-20">
          {works.map((work, index) => (
            <WorkItem key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};