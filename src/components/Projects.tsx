import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution built with React and Node.js',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800&h=600',
    tech: ['React', 'Node.js', 'MongoDB'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Portfolio Generator',
    description: 'Generate stunning portfolios with a few clicks',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800&h=600',
    tech: ['Vue.js', 'Firebase'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'AI Chat Interface',
    description: 'Modern chat interface with AI integration',
    image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800&h=600',
    tech: ['React', 'OpenAI', 'TailwindCSS'],
    liveUrl: '#',
    githubUrl: '#'
  }
];

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
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative border-4 border-black bg-white p-4 hover:bg-yellow-300 transition-colors"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;