import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { projects } from '../../data/projects';
import { useTranslation } from '../../context/TranslationContext';

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);
  const { language, translate } = useTranslation();
  
  const [translatedContent, setTranslatedContent] = useState({
    title: project?.title || '',
    description: project?.description || '',
    liveDemo: 'Live Demo',
    viewCode: 'View Code',
    backToProjects: 'Back to Projects',
    technologies: 'Technologies Used:',
    keyFeatures: 'Key Features:'
  });

  useEffect(() => {
    const translateProjectContent = async () => {
      if (!project) return;
      
      if (language === 'en') {
        setTranslatedContent({
          title: project.title,
          description: project.description,
          liveDemo: 'Live Demo',
          viewCode: 'View Code',
          backToProjects: 'Back to Projects',
          technologies: 'Technologies Used:',
          keyFeatures: 'Key Features:'
        });
        return;
      }

      // Translate all the content
      const [
        title, 
        description, 
        liveDemo, 
        viewCode, 
        backToProjects,
        technologies,
        keyFeatures
      ] = await Promise.all([
        translate(project.title),
        translate(project.description),
        translate('Live Demo'),
        translate('View Code'),
        translate('Back to Projects'),
        translate('Technologies Used:'),
        translate('Key Features:')
      ]);

      setTranslatedContent({
        title,
        description,
        liveDemo,
        viewCode,
        backToProjects,
        technologies,
        keyFeatures
      });
    };

    translateProjectContent();
  }, [project, language, translate]);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center text-pink-500 dark:text-purple-400 hover:text-pink-600 dark:hover:text-purple-300 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          {translatedContent.backToProjects}
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-6 dark:text-white"
        >
          {translatedContent.title}
        </motion.h1>

        <div className="mb-8 overflow-hidden rounded-lg border-4 border-black dark:border-gray-600">
          <img 
            src={project.image} 
            alt={translatedContent.title} 
            className="w-full h-auto"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">
          <p className="text-lg font-mono">{translatedContent.description}</p>
          
          {/* Key Features section */}
          <h3 className="text-xl font-bold mt-6 mb-4">{translatedContent.keyFeatures}</h3>
          <ul className="list-disc pl-5 space-y-2 font-mono">
            {project.features && project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-4">{translatedContent.technologies}</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="bg-black dark:bg-purple-800 text-white px-3 py-1 text-sm font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-pink-500 dark:bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-pink-600 dark:hover:bg-purple-700 transition-colors"
            >
              <ExternalLink size={20} className="mr-2" />
              {translatedContent.liveDemo}
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
            >
              <Github size={20} className="mr-2" />
              {translatedContent.viewCode}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};