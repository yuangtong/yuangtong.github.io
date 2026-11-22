/**
 * Componente UI: HorizontalScrollControls
 * Botones izquierda/derecha para contenedores con scroll horizontal
 */
import React, { RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

interface HorizontalScrollControlsProps {
  targetRef: RefObject<HTMLElement>;
  className?: string; // Permite ajustar posición absoluta según el contenedor
  deps?: ReadonlyArray<any>; // fuerza recalculo cuando cambian datos
}

const HorizontalScrollControls: React.FC<HorizontalScrollControlsProps> = ({ targetRef, className = '', deps = [] }) => {
  const { canScrollLeft, canScrollRight, showControls, onScrollLeft, onScrollRight } = useHorizontalScroll(targetRef, deps);

  if (!showControls) return null;

  return (
    <div className={`pointer-events-none absolute top-1/2 left-0 right-0 -translate-y-1/2 z-30 ${className}`} role="group" aria-label="Horizontal navigation controls">
      {/* Botón izquierdo: pegado al borde, sin superponer tarjetas */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-10">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="hs-left"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.preventDefault(); onScrollLeft(); }}
              aria-label="Scroll left"
              className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black dark:border-white bg-yellow-300 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Indicador discreto eliminado */}
      </div>

      {/* Botón derecho: pegado al borde opuesto */}
      <div className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-10">
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="hs-right"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.preventDefault(); onScrollRight(); }}
              aria-label="Scroll right"
              className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black dark:border-white bg-yellow-300 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Indicador discreto eliminado */}
      </div>
    </div>
  );
};

export default HorizontalScrollControls;