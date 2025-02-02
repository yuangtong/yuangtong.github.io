import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Github } from 'lucide-react';

interface ContentCardProps {
  type: 'blog' | 'project' | 'work';
  item: any;
}

export const ContentCard: React.FC<ContentCardProps> = ({ type, item }) => {
  const renderMeta = () => {
    if (type === 'blog') {
      return (
        <div className="flex items-center space-x-4 mb-4 text-sm font-mono">
          <span className="flex items-center">
            <Calendar size={16} className="mr-2" />
            {item.date}
          </span>
          <span className="flex items-center">
            <Clock size={16} className="mr-2" />
            {item.readTime}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderLinks = () => {
    if (type === 'project' || type === 'work') {
      return (
        <div className="flex space-x-4 mt-4">
          <a href={item.liveUrl} className="flex items-center space-x-2 hover:text-pink-500">
            <ExternalLink size={20} />
            <span>Live Demo</span>
          </a>
          <a href={item.githubUrl} className="flex items-center space-x-2 hover:text-pink-500">
            <Github size={20} />
            <span>Code</span>
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-900 border-4 border-black overflow-hidden group"
    >
      <Link to={`/${type}/${item.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          {item.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-300 px-3 py-1 font-mono text-sm border-2 border-black">
                {item.category}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          {renderMeta()}
          <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-mono">
            {item.description || item.excerpt}
          </p>
          {item.tech && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="bg-black text-white px-2 py-1 text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          {renderLinks()}
          <span className="inline-block mt-4 text-pink-500 hover:text-pink-600 font-bold">
            Read More →
          </span>
        </div>
      </Link>
    </motion.article>
  );
};