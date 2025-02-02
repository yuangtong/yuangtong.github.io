import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { projects } from './projectsData';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-pink-500 hover:text-pink-600">
            Back to Projects
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
          Back to Projects
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
          </div>

          <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
          <p className="text-lg mb-8 font-mono">{project.fullDescription}</p>

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
              className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-pink-500 transition-colors"
            >
              <ExternalLink size={20} />
              <span className="font-mono">View Live Demo</span>
            </a>
            <a
              href={project.githubUrl}
              className="flex items-center space-x-2 border-2 border-black px-6 py-3 hover:bg-yellow-300 transition-colors"
            >
              <Github size={20} />
              <span className="font-mono">View Source Code</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};