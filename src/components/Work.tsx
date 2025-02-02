import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Award } from 'lucide-react';

const works = [
  {
    title: 'AI-Powered Analytics Dashboard',
    category: 'Web Application',
    description: 'Enterprise analytics platform with AI-driven insights and real-time data visualization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
    awards: ['Best Enterprise Solution 2023'],
    tech: ['React', 'TypeScript', 'Python', 'TensorFlow'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Sustainable Fashion Marketplace',
    category: 'E-Commerce',
    description: 'Modern marketplace connecting eco-conscious fashion brands with consumers.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500',
    awards: ['Green Tech Award 2023'],
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#'
  }
];

const Work = () => {
  return (
    <section id="work" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Featured Work</h2>
          <p className="text-lg font-mono dark:text-gray-300">Showcasing some of my best professional projects</p>
        </motion.div>

        <div className="space-y-20">
          {works.map((work, index) => (
            <motion.div
              key={work.title}
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
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-[400px] object-cover"
                  />
                </motion.div>
                <div className="absolute -z-10 top-4 left-4 w-full h-full bg-pink-500 border-4 border-black dark:border-white"></div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="inline-block px-4 py-2 bg-yellow-300 dark:bg-purple-600 border-2 border-black dark:border-white font-mono mb-4">
                  {work.category}
                </span>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">{work.title}</h3>
                <p className="text-lg mb-6 font-mono dark:text-gray-300">{work.description}</p>

                {work.awards.map((award) => (
                  <div key={award} className="flex items-center mb-4 text-pink-500">
                    <Award size={20} className="mr-2" />
                    <span className="font-mono">{award}</span>
                  </div>
                ))}

                <div className="flex flex-wrap gap-2 mb-6">
                  {work.tech.map((tech) => (
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
                    <span className="font-mono">Live Demo</span>
                  </a>
                  <a
                    href={work.githubUrl}
                    className="flex items-center space-x-2 text-black dark:text-white hover:text-pink-500"
                  >
                    <Github size={20} />
                    <span className="font-mono">View Code</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;