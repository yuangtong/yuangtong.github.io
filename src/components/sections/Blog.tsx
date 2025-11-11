// Archivo: Blog.tsx
// Propósito: Sección Home de Blog; muestra entradas limitadas desde content.json usando tarjetas reutilizables.
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentCard, Button } from '../ui';
import { useContent } from '../../hooks/useContent';
import { DISPLAY_CONFIG } from '../../utils/constants';

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

const Blog = () => {
  const { items: posts, loading, error } = useContent<BlogPost>('blogs');
  const visiblePosts = posts.slice(0, DISPLAY_CONFIG.HOME_BLOGS_LIMIT);

  if (loading) return null;
  if (error) return null;

  return (
    <section id="blog" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold mb-12 border-b-4 border-black dark:border-gray-600 dark:text-white pb-4"
        >
          Latest Blog Posts
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post) => (
            <ContentCard key={post.id} type="blog" item={post} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/blog" aria-label="View all blog posts">
            <Button variant="secondary" size="md" className="min-w-[220px]">
              View all blog posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;