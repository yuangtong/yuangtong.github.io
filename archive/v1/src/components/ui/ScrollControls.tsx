/**
 * Componente UI: ScrollControls
 * Propósito: Mostrar controles verticales (arriba/abajo) cuando hay scroll
 * - Aparecen suavemente al detectar scroll (fade/slide 300ms)
 * - Posición fija, no intrusiva y coherente con el esquema visual
 * - Ocultan cada dirección cuando no hay más contenido disponible
 * - Indicadores visuales con flechas y puntos animados
 */
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useScrollControls } from '../../hooks/useScrollControls';

interface ScrollControlsProps {
  className?: string;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({ className = '' }) => {
  const { canScrollUp, canScrollDown, showControls, hasScrolled, onScrollUp, onScrollDown } = useScrollControls();

  // Se renderiza el contenedor solo si hay overflow; botones aparecen tras detectar scroll
  if (!showControls) return null;

  return (
    <div
      className={`fixed right-4 bottom-8 md:right-6 md:bottom-6 z-40 ${className}`}
      role="region"
      aria-live="polite"
      aria-label="Scroll controls"
    >
      <AnimatePresence>
        {hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Botón arriba */}
            {canScrollUp && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onScrollUp}
                aria-label="Scroll up"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-black dark:border-white bg-yellow-300 text-black dark:bg-indigo-500 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
            )}

            {/* Indicador visual (puntos) cuando hay más contenido arriba/abajo */}
            <div className="flex flex-col items-center gap-1">
              {canScrollUp && <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-60" />}
              {canScrollDown && (
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-60 animate-bounce-slow" />
              )}
            </div>

            {/* Botón abajo */}
            {canScrollDown && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onScrollDown}
                aria-label="Scroll down"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-black dark:border-white bg-yellow-300 text-black dark:bg-indigo-500 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollControls;