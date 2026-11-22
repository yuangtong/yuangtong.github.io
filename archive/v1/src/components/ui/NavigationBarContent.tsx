/**
 * Componente UI: NavigationBarContent
 * Propósito: Contenido interno (botones Back/Home) del NavigationBar
 * Usado tanto en el contenedor normal como en la superposición fija,
 * garantizando que el layout sea idéntico en ambos estados.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import BackButton from './BackButton';

interface NavigationBarContentProps {
  className?: string;
}

const NavigationBarContent: React.FC<NavigationBarContentProps> = ({ className = '' }) => (
  <div
    className={
      `flex items-center justify-between gap-3 py-2 ` +
      `bg-transparent dark:bg-transparent border-0 shadow-none ` +
      `${className}`
    }
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
  </div>
);

export default NavigationBarContent;