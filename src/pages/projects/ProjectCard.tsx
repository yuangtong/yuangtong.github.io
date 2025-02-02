import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

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
    whileHover={{ y: -5 }}
    className="group border-4 border-black bg-white p-4 hover:bg-yellow-300 transition-colors"
  >
    <div className="relative h-48 mb-4 overflow-hidden border-2 border-black">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
    </div>

    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
    <p className="font-mono mb-4">{project.description}</p>

    <div className="flex flex-wrap gap-2 mb-4">
      {project.tech.map((tech) => (
        <span
          key={tech}
          className="bg-black text-white px-2 py-1 text-sm font-mono"
        >
          {tech}
        </span>
      ))}
    </div>

    <div className="flex space-x-4">
      <a
        href={project.liveUrl}
        className="flex items-center space-x-2 hover:text-pink-500"
      >
        <ExternalLink size={20} />
        <span>Live Demo</span>
      </a>
      <a
        href={project.githubUrl}
        className="flex items-center space-x-2 hover:text-pink-500"
      >
        <Github size={20} />
        <span>Code</span>
      </a>
    </div>
  </motion.div>
);