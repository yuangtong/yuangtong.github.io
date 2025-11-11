/**
 * Componente UI: NavigationBar
 * Propósito: Grupo Back/Home fijo, similar al navbar
 * - Posicionado fijo en la parte superior con offset bajo el Header
 * - Contiene BackButton y link a Home, accesibles y con transición suave
 */
import React, { useEffect, useRef, useState } from 'react';
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
  const isFixed = useScrollActive(1);

  // Referencia para medir la altura del contenido y mantener un "spacer" en el flujo
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [spacerHeight, setSpacerHeight] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setSpacerHeight(contentRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <>
      {/* Spacer: mantiene el layout original cuando el overlay está fixed */}
      <div style={{ height: spacerHeight }} aria-hidden="true" />

      {/* Contenedor normal (no fixed) renderiza el contenido en el flujo */}
      {!isFixed && (
        <div
          className={'relative w-full bg-white dark:bg-gray-900 transform translate-y-2 md:translate-y-0 transition-transform duration-200'}
          aria-label="Detail navigation"
          role="navigation"
        >
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <NavigationBarContent className={className} />
            </motion.div>
          </div>
        </div>
      )}

      {/* Overlay fijo que duplica visualmente el contenido y ocupa todo el ancho */}
      {isFixed && (
        <div
          className={`fixed left-0 right-0 w-full z-40 ${topClass} bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pointer-events-none`}
          aria-label="Detail navigation fixed"
          role="navigation"
        >
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <NavigationBarContent className={className} />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;