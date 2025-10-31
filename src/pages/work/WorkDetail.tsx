import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Award } from 'lucide-react';
import { client, queries, urlFor } from '../../lib/sanity';
import { Work } from '../../hooks/useWork';
import { featuredWorks } from './workData';

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWork = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await client.fetch(queries.workBySlug, { slug });
        
        if (!data) {
          // Try to find in static data as fallback
          const staticWork = featuredWorks.find(w => w.slug === slug);
          if (staticWork) {
            console.log('Work not found in Sanity, using static data as fallback');
            const transformedWork: Work = {
              _id: staticWork.slug,
              title: staticWork.title,
              slug: { current: staticWork.slug },
              category: staticWork.category,
              description: staticWork.description,
              image: { asset: { _ref: '' }, alt: staticWork.title },
              awards: staticWork.awards,
              tech: staticWork.tech,
              liveUrl: staticWork.liveUrl,
              githubUrl: staticWork.githubUrl,
              featured: true,
              order: 0
            };
            setWork(transformedWork);
          } else {
            setError('Work not found');
          }
        } else {
          setWork(data);
        }
      } catch (err) {
        console.warn('Sanity fetch failed, trying static data:', err);
        // Try to find in static data as fallback
        const staticWork = featuredWorks.find(w => w.slug === slug);
        if (staticWork) {
          const transformedWork: Work = {
            _id: staticWork.slug,
            title: staticWork.title,
            slug: { current: staticWork.slug },
            category: staticWork.category,
            description: staticWork.description,
            image: { asset: { _ref: '' }, alt: staticWork.title },
            awards: staticWork.awards,
            tech: staticWork.tech,
            liveUrl: staticWork.liveUrl,
            githubUrl: staticWork.githubUrl,
            featured: true,
            order: 0
          };
          setWork(transformedWork);
          setError(null);
        } else {
          setError('Work not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [slug]);

  const getImageUrl = (image: Work['image'], workTitle?: string) => {
    if (!image?.asset?._ref) {
      // For static data, find the original image URL by work title
      if (workTitle) {
        const staticWork = featuredWorks.find(w => w.title === workTitle);
        return staticWork?.image || '';
      }
      return '';
    }
    return urlFor(image).width(1200).height(600).url();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Work Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'The requested work could not be found.'}</p>
          <Link 
            to="/#work" 
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-mono hover:bg-pink-600 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-black dark:bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/#work" 
            className="inline-flex items-center text-pink-500 hover:text-pink-400 font-mono"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Work
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block px-4 py-2 bg-yellow-300 dark:bg-purple-600 border-2 border-black dark:border-white font-mono mb-4">
                {work.category}
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 dark:text-white">
                {work.title}
              </h1>
              <p className="text-xl mb-8 font-mono dark:text-gray-300">
                {work.description}
              </p>

              {/* Awards */}
              {work.awards && work.awards.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Awards & Recognition</h3>
                  {work.awards.map((award) => (
                    <div key={award} className="flex items-center mb-2 text-pink-500">
                      <Award size={20} className="mr-2" />
                      <span className="font-mono">{award}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {work.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black font-mono text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex space-x-6">
                {work.liveUrl && (
                  <a
                    href={work.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white font-mono hover:bg-pink-600 transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span>Live Demo</span>
                  </a>
                )}
                {work.githubUrl && (
                  <a
                    href={work.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white font-mono hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    <Github size={20} />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="relative z-10 border-4 border-black dark:border-white overflow-hidden">
                  <img
                    src={getImageUrl(work.image, work.title)}
                    alt={work.image.alt || work.title}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -z-10 top-4 left-4 w-full h-full bg-pink-500 border-4 border-black dark:border-white"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkDetail;