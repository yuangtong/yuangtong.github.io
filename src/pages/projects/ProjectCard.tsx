import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { optimizeImageUrl } from '../../utils/performance';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ amount: 0.2 }}
    whileHover={{ y: -5 }}
    className="group border-4 border-black dark:border-gray-600 bg-white dark:bg-gray-800 p-4 hover:bg-yellow-300 dark:hover:bg-purple-700 transition-colors"
  >
    <div className="relative h-48 mb-4 overflow-hidden border-2 border-black dark:border-gray-600">
      <img
        src={optimizeImageUrl(project.image, 400, 80)}
        alt={project.title}
        loading="lazy"
        width="400"
        height="300"
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
    </div>

    <h3 className="text-2xl font-bold mb-2 dark:text-white">{project.title}</h3>
    <p className="font-mono mb-4 dark:text-gray-300">{project.description}</p>

    <div className="flex flex-wrap gap-2 mb-4">
      {project.tech.map((tech) => (
        <span
          key={tech}
          className="bg-black dark:bg-purple-800 text-white px-2 py-1 text-sm font-mono"
        >
          {tech}
        </span>
      ))}
    </div>

    <div className="flex space-x-4">
      <a
        href={project.liveUrl}
        aria-label={`Open live demo for ${project.title}`}
        className="flex items-center space-x-2 hover:text-pink-500 dark:text-white dark:hover:text-purple-400"
      >
        <ExternalLink size={20} />
        <span>Live Demo</span>
      </a>
      <a
        href={project.githubUrl}
        aria-label={`Open source code for ${project.title}`}
        className="flex items-center space-x-2 hover:text-pink-500 dark:text-white dark:hover:text-purple-400"
      >
        <Github size={20} />
        <span>Code</span>
      </a>
    </div>
  </motion.div>
);