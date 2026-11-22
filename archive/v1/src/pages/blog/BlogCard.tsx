import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
  };
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-900 border-4 border-black overflow-hidden group"
  >
    <Link to={`/blog/${post.slug}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-yellow-300 px-3 py-1 font-mono text-sm border-2 border-black">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4 text-sm font-mono">
          <span className="flex items-center">
            <Calendar size={16} className="mr-2" />
            {post.date}
          </span>
          <span className="flex items-center">
            <Clock size={16} className="mr-2" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 dark:text-white">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-mono">{post.excerpt}</p>
        <span className="inline-block bg-black text-white dark:bg-white dark:text-black px-4 py-2 font-mono hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white transition-colors">
          Read More
        </span>
      </div>
    </Link>
  </motion.article>
);