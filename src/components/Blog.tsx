import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'Building Scalable React Applications',
    excerpt: 'Learn the best practices for building large-scale React applications with modern tools and techniques.',
    date: '2024-03-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800&h=400',
    link: '#'
  },
  {
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies that will shape the future of web development.',
    date: '2024-03-10',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&q=80&w=800&h=400',
    link: '#'
  },
  {
    title: 'Mastering TypeScript',
    excerpt: 'A comprehensive guide to using TypeScript effectively in your projects.',
    date: '2024-03-05',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800&h=400',
    link: '#'
  }
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Latest Blog Posts</h2>
          <p className="text-lg font-mono dark:text-gray-300">Thoughts, tutorials, and insights about web development</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4 text-sm font-mono dark:text-gray-300">
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
                <a
                  href={post.link}
                  className="inline-flex items-center text-pink-500 hover:text-pink-600 font-bold"
                >
                  Read More
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;