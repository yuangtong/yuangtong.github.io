// Archivo: BlogPage.tsx
// Propósito: Página de archivo de blogs; muestra tarjetas y navegación contextual (Back/Home).
import React from 'react';
import { motion } from 'framer-motion';
// UI components
import { ContentCard } from '../../components/ui/ContentCard';
import { Button } from '../../components/ui';
import NavigationBar from '../../components/ui/NavigationBar';
import { useSearchParams } from 'react-router-dom';
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

export const BlogPage = () => {
  const { items: posts, loading, error } = useContent<BlogPost>('blogs');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = DISPLAY_CONFIG.HOME_BLOGS_LIMIT;
  const pageParam = Number(searchParams.get('page')) || 1;
  const currentPage = Math.max(1, pageParam);
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePosts = posts.slice(startIndex, startIndex + pageSize);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegación contextual para listados con sticky/fixed en scroll */}
        <NavigationBar topClass="top-14 sm:top-16 md:top-20" />
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
          {visiblePosts.map((post) => (
            <ContentCard key={post.id} type="blog" item={post} />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="md"
              disabled={currentPage <= 1}
              aria-label="Previous page"
              onClick={() => setSearchParams({ page: String(currentPage - 1) })}
            >
              Prev
            </Button>
            <span className="font-mono text-sm dark:text-white">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="md"
              disabled={currentPage >= pageCount}
              aria-label="Next page"
              onClick={() => setSearchParams({ page: String(currentPage + 1) })}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};