import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Github, Award } from 'lucide-react';
import NavigationBar from './NavigationBar';

interface ContentDetailProps {
  type: 'blog' | 'project' | 'work';
  item: any;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ type, item }) => {
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Content not found</h1>
          <Link to={`/${type}s`} className="text-pink-500 hover:text-pink-600">
            Back to {type.charAt(0).toUpperCase() + type.slice(1)}s
          </Link>
        </div>
      </div>
    );
  }

  const renderMeta = () => {
    if (type === 'blog') {
      return (
        <div className="flex items-center space-x-4 mb-6 text-sm font-mono">
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

  const renderAwards = () => {
    if (item.awards) {
      return item.awards.map((award: string) => (
        <div key={award} className="flex items-center mb-6 text-pink-500">
          <Award size={20} className="mr-2" />
          <span className="font-mono">{award}</span>
        </div>
      ));
    }
    return null;
  };

  return (
    <article className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra de navegación para detalle con sticky/fixed en scroll */}
        <NavigationBar topClass="top-14 sm:top-16 md:top-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-[400px] mb-8 border-4 border-black overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.category && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-300 px-3 py-1 font-mono text-sm border-2 border-black">
                  {item.category}
                </span>
              </div>
            )}
          </div>

          {renderMeta()}
          <h1 className="text-4xl font-bold mb-6 dark:text-white">{item.title}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none font-mono mb-8">
            {item.content || item.fullDescription}
          </div>

          {renderAwards()}

          {item.tech && (
            <div className="flex flex-wrap gap-2 mb-8">
              {item.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="bg-black text-white px-3 py-1 text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {(type === 'project' || type === 'work') && (
            <div className="flex space-x-6">
              <a
                href={item.liveUrl}
                className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-pink-500 transition-colors"
              >
                <ExternalLink size={20} />
                <span className="font-mono">View Live Project</span>
              </a>
              <a
                href={item.githubUrl}
                className="flex items-center space-x-2 border-2 border-black px-6 py-3 hover:bg-yellow-300 transition-colors"
              >
                <Github size={20} />
                <span className="font-mono">View Source Code</span>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </article>
  );
};