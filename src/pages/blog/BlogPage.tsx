import React from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from '../../components/shared/ContentCard';
import { useContent } from '../../hooks/useContent';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const BlogPage = () => {
  const { items: posts, loading, error } = useContent<BlogPost>('blogs');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 dark:text-white">Blog</h1>
          <p className="text-lg font-mono dark:text-gray-300">
            Thoughts, tutorials, and insights about web development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ContentCard key={post.id} type="blog" item={post} />
          ))}
        </div>
      </div>
    </section>
  );
};