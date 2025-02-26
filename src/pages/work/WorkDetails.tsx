import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Award } from 'lucide-react';
import { featuredWorks } from './workData';

export const WorkDetails = () => {
  const { slug } = useParams();
  const work = featuredWorks.find(w => w.slug === slug);

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Work not found</h1>
          <Link to="/work" className="text-pink-500 hover:text-pink-600">
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/work"
          className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Work
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-[400px] mb-8 border-4 border-black overflow-hidden">
            <img
              src={work.image}
              alt={work.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-300 px-3 py-1 font-mono text-sm border-2 border-black">
                {work.category}
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6">{work.title}</h1>
          <p className="text-lg mb-8 font-mono">{work.fullDescription}</p>

          {work.awards.map((award) => (
            <div key={award} className="flex items-center mb-6 text-pink-500">
              <Award size={20} className="mr-2" />
              <span className="font-mono">{award}</span>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mb-8">
            {work.tech.map((tech) => (
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
              href={work.liveUrl}
              className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-pink-500 transition-colors"
            >
              <ExternalLink size={20} />
              <span className="font-mono">View Live Project</span>
            </a>
            <a
              href={work.githubUrl}
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