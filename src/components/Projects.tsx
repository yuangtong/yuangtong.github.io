import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from './shared/ContentCard';
import { projects } from '../data/projects';
import { useTranslation } from '../context/TranslationContext';

const Projects = () => {
  const { language, translate } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState('Selected Projects');

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedTitle('Selected Projects');
        return;
      }

      const title = await translate('Selected Projects');
      setTranslatedTitle(title);
    };

    translateContent();
  }, [language, translate]);

  return (
    <section id="projects" className="bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold mb-12 border-b-4 border-black dark:border-gray-600 dark:text-white pb-4"
        >
          {translatedTitle}
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