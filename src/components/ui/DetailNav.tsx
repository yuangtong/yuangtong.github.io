/**
 * Componente UI: DetailNav
 * Grupo de navegación para vistas de detalle (Back + Home)
 * - Visible solo en páginas de detalle (incluido explícitamente allí)
 * - Estilo diferenciado del navbar principal
 * - Transición suave al aparecer
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import BackButton from './BackButton';

interface DetailNavProps {
  className?: string;
}

const DetailNav: React.FC<DetailNavProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center justify-between gap-3 mb-6 ${className}`}
      aria-label="Detail navigation"
    >
      <BackButton label="Back" />
      <Link
        to="/"
        aria-label="Home"
        className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 border-black dark:border-white bg-yellow-300 dark:bg-purple-600 text-black dark:text-white font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-none"
      >
        <Home size={18} className="md:w-5 md:h-5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
    </motion.div>
  );
};

export default DetailNav;