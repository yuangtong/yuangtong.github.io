import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { projects } from '../../data/projects';
import { useTranslation } from '../../context/TranslationContext';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);
  const { language, translate } = useTranslation();
  
  const [translatedContent, setTranslatedContent] = useState({
    title: project?.title || '',
    description: project?.description || '',
    liveDemo: 'Live Demo',
    viewCode: 'View Code',
    backToProjects: 'Back to Projects',
    technologies: 'Technologies Used:'
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
          technologies: 'Technologies Used:'
        });
        return;
      }

      const [
        title, 
        description, 
        liveDemo, 
        viewCode, 
        backToProjects,
        technologies
      ] = await Promise.all([
        translate(project.title),
        translate(project.description),
        translate('Live Demo'),
        translate('View Code'),
        translate('Back to Projects'),
        translate('Technologies Used:')
      ]);

      setTranslatedContent({
        title,
        description,
        liveDemo,
        viewCode,
        backToProjects,
        technologies
      });
    };

    translateProjectContent();
  }, [project, language, translate]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-pink-500 hover:text-pink-600">
            {translatedContent.backToProjects}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/projects"
          className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-8"
        >
          <ArrowLeft className="mr-2" />
          {translatedContent.backToProjects}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-[400px] mb-8 border-4 border-black overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.category && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-300 px-3 py-1 font-mono text-sm border-2 border-black">
                  {project.category}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-6">{translatedContent.title}</h1>
          <div 
            className="text-lg mb-8 font-mono whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: translatedContent.description }}
          />

          <h3 className="text-xl font-bold mb-4">{translatedContent.technologies}</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="bg-black text-white px-3 py-1 text-sm font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex space-x-6">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-pink-500 transition-colors"
            >
              <ExternalLink size={20} />
              <span className="font-mono">{translatedContent.liveDemo}</span>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 border-2 border-black px-6 py-3 hover:bg-yellow-300 transition-colors"
            >
              <Github size={20} />
              <span className="font-mono">{translatedContent.viewCode}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};