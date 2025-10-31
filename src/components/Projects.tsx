import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from './shared/ContentCard';
import { projects as staticProjects } from '../data/projects';
import { useProjects } from '../hooks';
import type { Project } from '../hooks';
import { useTranslation } from '../context/TranslationContext';
import { urlFor } from '../lib/sanity';

// Type for unified project structure
type UnifiedProject = {
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  slug: string;
  category: string;
};

// Function to map Sanity projects to unified format
const mapSanityToUnified = (sanityProject: Project): UnifiedProject => ({
  title: sanityProject.title,
  description: sanityProject.shortDescription,
  fullDescription: sanityProject.longDescription || sanityProject.shortDescription,
  image: sanityProject.image ? urlFor(sanityProject.image).width(800).height(500).url() : '',
  tech: sanityProject.technologies,
  liveUrl: sanityProject.liveUrl || '#',
  githubUrl: sanityProject.githubUrl || '#',
  slug: sanityProject.slug.current,
  category: sanityProject.category
});

const Projects = () => {
  const { language, translate } = useTranslation();
  const { projects: sanityProjects, loading, error } = useProjects();
  const [translatedTitle, setTranslatedTitle] = useState('Selected Projects');
  const [key, setKey] = useState(0);

  // Use Sanity data if available, otherwise fallback to static data
  const projects: UnifiedProject[] = sanityProjects.length > 0 
    ? sanityProjects.map(mapSanityToUnified)
    : staticProjects;

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

  if (loading) {
    return (
      <section id="projects" className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error && projects.length === 0) {
    return (
      <section id="projects" className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>Error loading projects: {error}</p>
            <p className="text-sm mt-2">Falling back to static content...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Show data source indicator in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm">
            <span className="font-semibold">
              Data source: {sanityProjects.length > 0 ? 'Sanity CMS' : 'Static files'}
            </span>
            {error && (
              <span className="text-red-600 dark:text-red-400 ml-2">
                (Sanity error: {error})
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: UnifiedProject, index: number) => (
            <ContentCard
              key={`${project.title}-${language}-${key}`}
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