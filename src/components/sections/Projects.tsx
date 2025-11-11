import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ContentCard, Button } from '../ui';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { useTranslation } from '../../context/TranslationContext';
import { DISPLAY_CONFIG } from '../../utils/constants';

const Projects = () => {
  const { language, translate } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState('Selected Projects');
  const [key, setKey] = useState(0);

  // Obtener proyectos desde content.json
  const { items: projects, loading, error } = useContent<any>('projects');

  // Limitar la cantidad de proyectos mostrados en Home
  const visibleProjects = projects.slice(0, DISPLAY_CONFIG.HOME_PROJECTS_LIMIT);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedTitle('Selected Projects');
      } else {
        const title = await translate('Selected Projects');
        setTranslatedTitle(title);
      }
      // Update key to force re-render of child components
      setKey(prev => prev + 1);
    };

    translateContent();
  }, [language, translate]);

  return (
    <section id="projects" className="bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Estados de carga/errores mínimos para Home */}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}

        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold mb-12 border-b-4 border-black dark:border-gray-600 dark:text-white pb-4"
        >
          {translatedTitle}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project) => (
            <ContentCard
              key={`${project.title}-${language}-${key}`}
              type="project"
              item={project}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects" aria-label="View all projects">
            <Button variant="secondary" size="md" className="min-w-[220px]">
              View all projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}; 

export default Projects;