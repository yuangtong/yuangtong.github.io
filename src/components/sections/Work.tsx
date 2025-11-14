// Archivo: Work.tsx
// Propósito: Sección Home de "Work" con grilla limitada e interacción para ver todo.
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Award } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import { Button } from '../ui';
import { Link } from 'react-router-dom';
import { DISPLAY_CONFIG } from '../../utils/constants';
import { useTranslation } from '../../context/TranslationContext';

const Work = () => {
  const { items: works, loading, error } = useContent<any>('works');
  const { language, translate } = useTranslation();

  const [texts, setTexts] = React.useState({
    title: 'Featured Work',
    subtitle: 'Showcasing some of my best professional projects',
    liveDemo: 'Live Demo',
    viewCode: 'View Code',
    viewAllWorks: 'View all works',
  });

  React.useEffect(() => {
    (async () => {
      if (language === 'en') {
        setTexts({
          title: 'Featured Work',
          subtitle: 'Showcasing some of my best professional projects',
          liveDemo: 'Live Demo',
          viewCode: 'View Code',
          viewAllWorks: 'View all works',
        });
        return;
      }
      const [title, subtitle, liveDemo, viewCode, viewAllWorks] = await Promise.all([
        translate('Featured Work'),
        translate('Showcasing some of my best professional projects'),
        translate('Live Demo'),
        translate('View Code'),
        translate('View all works'),
      ]);
      setTexts({ title, subtitle, liveDemo, viewCode, viewAllWorks });
    })();
  }, [language, translate]);
  return (
    <section id="work" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold dark:text-white my-4">{texts.title}</h2>
          <p className="text-lg font-mono dark:text-gray-300">{texts.subtitle}</p>
        </motion.div>

        {/* Limitar elementos visibles en Home para replicar Projects */}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <div className="space-y-20">
          {works
            .slice(0, DISPLAY_CONFIG.HOME_WORKS_LIMIT)
            .map((work, index) => (
            <motion.div
              key={work.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative z-10 border-4 border-black dark:border-white overflow-hidden"
                >
                  <Link 
                    to={`/work/${work.slug}`} 
                    aria-label={`View details for ${work.title}`}
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      loading="lazy"
                      className="w-full h-[400px] object-cover"
                    />
                  </Link>
                </motion.div>
                <div className="absolute -z-10 top-4 left-4 w-full h-full bg-pink-500 border-4 border-black dark:border-white"></div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="inline-block px-4 py-2 bg-yellow-300 dark:bg-purple-600 border-2 border-black dark:border-white font-mono mb-4">
                  {work.category}
                </span>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">
                  <Link 
                    to={`/work/${work.slug}`}
                    className="hover:text-pink-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                    aria-label={`Open details for ${work.title}`}
                  >
                    {work.title}
                  </Link>
                </h3>
                <p className="text-lg mb-6 font-mono dark:text-gray-300">{work.description}</p>

                {work.awards && work.awards.map((award: string) => (
                  <div key={award} className="flex items-center mb-4 text-pink-500">
                    <Award size={20} className="mr-2" />
                    <span className="font-mono">{award}</span>
                  </div>
                ))}

                <div className="flex flex-wrap gap-2 mb-6">
                  {work.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black font-mono text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-6">
                  <a
                    href={work.liveUrl}
                    className="flex items-center space-x-2 text-black dark:text-white hover:text-pink-500"
                  >
                    <ExternalLink size={20} />
                    <span className="font-mono">{texts.liveDemo}</span>
                  </a>
                  <a
                    href={work.githubUrl}
                    className="flex items-center space-x-2 text-black dark:text-white hover:text-pink-500"
                  >
                    <Github size={20} />
                    <span className="font-mono">{texts.viewCode}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/work" aria-label="View all works">
            <Button variant="primary" size="md" className="min-w-[220px]">
              {texts.viewAllWorks}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Work;