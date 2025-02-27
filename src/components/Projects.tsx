import React from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from './shared/ContentCard';
import { projects } from '../data/projects';

const Projects = () => {
  return (
    <section id="projects" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold mb-12 border-b-4 border-black pb-4"
        >
          Selected Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ContentCard
              key={project.title}
              type="project"
              item={project}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;