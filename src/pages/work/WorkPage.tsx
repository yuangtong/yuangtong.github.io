import React from 'react';
import { motion } from 'framer-motion';
import { WorkItem } from './FeaturedWork';
import { featuredWorks } from './workData';

export const WorkPage = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">Featured Work</h1>
        <p className="text-lg font-mono">
          A selection of my best professional projects
        </p>
      </motion.div>

      <div className="space-y-20">
        {featuredWorks.map((work, index) => (
          <WorkItem key={work.title} work={work} index={index} />
        ))}
      </div>
    </div>
  </section>
);