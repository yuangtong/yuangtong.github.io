import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Github } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

interface ContentCardProps {
  type: 'blog' | 'project' | 'work';
  item: any;
}

export const ContentCard: React.FC<ContentCardProps> = ({ type, item }) => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState({
    title: item.title,
    description: item.description || item.excerpt,
    category: item.category || '',
    readMore: 'Read More →',
    liveDemo: 'Live Demo',
    code: 'Code'
  });

  useEffect(() => {
    const translateCardContent = async () => {
      console.log(`Translating card content for ${item.title}, language: ${language}`);
      
      if (language === 'en') {
        // English content handling...
        return;
      }

      try {
        const [title, description, category, readMore, liveDemo, code] = await Promise.all([
          translate(item.title),
          translate(item.description || item.excerpt),
          item.category ? translate(item.category) : '',
          translate('Read More →'),
          translate('Live Demo'),
          translate('Code')
        ]);

        console.log(`Translation complete for ${item.title}:`, { title, description });
        
        setTranslatedContent({
          title,
          description,
          category,
          readMore,
          liveDemo,
          code
        });
      } catch (error) {
        console.error(`Translation error for ${item.title}:`, error);
      }
    };

    translateCardContent();
  }, [language, translate, item.title, item.description, item.excerpt, item.category]);

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
          <a 
            href={item.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-pink-500 dark:text-white dark:hover:text-purple-400"
          >
            <ExternalLink size={20} />
            <span>{translatedContent.liveDemo}</span>
          </a>
          <a 
            href={item.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-pink-500 dark:text-white dark:hover:text-purple-400"
          >
            <Github size={20} />
            <span>{translatedContent.code}</span>
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
      className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-600 overflow-hidden group hover:bg-yellow-300 dark:hover:bg-purple-700 transition-colors"
    >
      <Link to={`/${type}/${item.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={translatedContent.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          {item.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-300 dark:bg-purple-600 px-3 py-1 font-mono text-sm border-2 border-black dark:border-gray-600">
                {translatedContent.category}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          {renderMeta()}
          <h3 className="text-xl font-bold mb-2 dark:text-white">{translatedContent.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 font-mono">
            {translatedContent.description}
          </p>
          {item.tech && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="bg-black dark:bg-purple-800 text-white px-2 py-1 text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          {renderLinks()}
          <span className="inline-block mt-4 text-pink-500 dark:text-purple-400 hover:text-pink-600 dark:hover:text-purple-300 font-bold">
            {translatedContent.readMore}
          </span>
        </div>
      </Link>
    </motion.article>
  );
};