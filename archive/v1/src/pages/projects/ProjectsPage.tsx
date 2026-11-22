// Archivo: ProjectsPage.tsx
// Propósito: Página de archivo de proyectos; lista usando useContent y agrega navegación DetailNav.
import React from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from '../../components/ui/ContentCard';
import NavigationBar from '../../components/ui/NavigationBar';
import { useContent } from '../../hooks/useContent';

export const ProjectsPage = () => {
  const { items: projects, loading, error } = useContent<any>('projects');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegación contextual para listados con sticky/fixed en scroll */}
        <NavigationBar topClass="top-14 sm:top-16 md:top-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg font-mono">A selection of my best professional projects</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <ContentCard key={project.slug} type="project" item={project} />
          ))}
        </div>
      </div>
    </section>
  );
};