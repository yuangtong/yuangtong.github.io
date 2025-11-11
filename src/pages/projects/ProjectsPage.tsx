// Archivo: ProjectsPage.tsx
// Propósito: Página de archivo de proyectos; muestra tarjetas reutilizables con navegación al detalle.
// Archivo: ProjectsPage.tsx
// Propósito: Página de archivo de proyectos; muestra tarjetas y navegación contextual (Back/Home).
import React from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from '../../components/ui/ContentCard';
import { projects } from '../../data/projects';

export const ProjectsPage = () => (
  <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="text-5xl font-bold mb-12 border-b-4 border-black pb-4"
      >
        Projects
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ContentCard key={project.slug} type="project" item={project} />
        ))}
      </div>
    </div>
  </section>
);