/**
 * Componente UI: NavigationBar
 * Propósito: Grupo Back/Home fijo, similar al navbar
 * - Posicionado fijo en la parte superior con offset bajo el Header
 * - Contiene BackButton y link a Home, accesibles y con transición suave
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import BackButton from './BackButton';
import { useScrollActive } from '../../hooks/useScrollActive';
import NavigationBarContent from './NavigationBarContent';

interface NavigationBarProps {
  className?: string;
  topClass?: string; // Permite ajustar el offset superior (ej. 'top-20')
}

const NavigationBar: React.FC<NavigationBarProps> = ({ className = '', topClass = 'top-16' }) => {
  // Estado de scroll para posibles estilos (e.g., sombras); no se usa para layout
  useScrollActive(100);

  return (
    <div
      className={`sticky left-0 right-0 z-40 bg-white dark:bg-gray-900 ${topClass ? '' : ''}`}
      style={{ top: 'var(--header-height, 64px)' }}
      aria-label="Detail navigation"
      role="navigation"
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}> 
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <NavigationBarContent className={className} />
        </motion.div>
      </div>
    </div>
  );
};

export default NavigationBar;