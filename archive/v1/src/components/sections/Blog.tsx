// Archivo: Blog.tsx
// Propósito: Sección Home de Blog; muestra entradas limitadas desde content.json usando tarjetas reutilizables.
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentCard, Button } from '../ui';
import { useContent } from '../../hooks/useContent';
import { DISPLAY_CONFIG } from '../../utils/constants';
import HorizontalScrollControls from '../ui/HorizontalScrollControls';
import { useEqualHeights } from '../../hooks/useEqualHeights';

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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Igualar alturas al mayor contenido visible
  useEqualHeights(scrollRef, '[data-equalize="card"]', [visiblePosts.length]);

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

        {/* Carrusel horizontal 1 fila x 3 columnas visibles con scroll (1x6) */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch overflow-x-auto horizontal-scroll-touch pb-6 gap-8 pl-12 pr-12 sm:px-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollPaddingLeft: '3rem', scrollPaddingRight: '3rem' }}
          >
            {visiblePosts.map((post) => (
              <div key={post.id} className="flex-shrink-0 w-[76vw] sm:w-[68vw] md:w-[55vw] lg:w-[33.3333%] snap-start" data-equalize="card">
                <ContentCard type="blog" item={post} className="h-full" />
              </div>
            ))}
          </div>
          <HorizontalScrollControls targetRef={scrollRef} deps={[visiblePosts.length]} />
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