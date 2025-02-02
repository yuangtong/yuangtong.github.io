import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Award } from 'lucide-react';

interface WorkItemProps {
  work: {
    title: string;
    category: string;
    description: string;
    image: string;
    awards: string[];
    tech: string[];
    liveUrl: string;
    githubUrl: string;
  };
  index: number;
}

export const WorkItem: React.FC<WorkItemProps> = ({ work, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
  >
    <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative z-10 border-4 border-black overflow-hidden"
      >
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-[400px] object-cover"
        />
      </motion.div>
      <div className="absolute -z-10 top-4 left-4 w-full h-full bg-pink-500 border-4 border-black"></div>
    </div>

    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
      <span className="inline-block px-4 py-2 bg-yellow-300 border-2 border-black font-mono mb-4">
        {work.category}
      </span>
      <h3 className="text-3xl font-bold mb-4">{work.title}</h3>
      <p className="text-lg mb-6 font-mono">{work.description}</p>

      {work.awards.map((award) => (
        <div key={award} className="flex items-center mb-4 text-pink-500">
          <Award size={20} className="mr-2" />
          <span className="font-mono">{award}</span>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mb-6">
        {work.tech.map((tech) => (
          <span key={tech} className="px-3 py-1 bg-black text-white font-mono text-sm">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex space-x-6">
        <a href={work.liveUrl} className="flex items-center space-x-2 hover:text-pink-500">
          <ExternalLink size={20} />
          <span className="font-mono">Live Demo</span>
        </a>
        <a href={work.githubUrl} className="flex items-center space-x-2 hover:text-pink-500">
          <Github size={20} />
          <span className="font-mono">View Code</span>
        </a>
      </div>
    </div>
  </motion.div>
);