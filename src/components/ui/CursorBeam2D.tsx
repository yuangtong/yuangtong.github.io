/**
 * Componente UI: CursorBeam2D
 * Propósito: Renderiza un haz de luz 2D que sigue el cursor
 * sobre el Hero, con mezcla de color y blur sutil.
 */
import React from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import { useCursorBeam } from '../../hooks/useCursorBeam';

interface CursorBeam2DProps {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

const CursorBeam2D: React.FC<CursorBeam2DProps> = ({ containerRef, enabled = true }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disabled = !enabled || prefersReducedMotion;
  const { x, y, intensity } = useCursorBeam({ container: containerRef, disabled });

  const opacity = intensity;
  const backdrop = useMotionTemplate`blur(8px)`;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none z-[5]"
      style={{
        left: x,
        top: y,
        opacity,
        filter: backdrop,
      }}
    >
      {/* halo principal */}
      <div className="-translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-full mix-blend-screen bg-[radial-gradient(circle_at_center,_rgba(253,224,71,0.5),_rgba(16,185,129,0.35)_60%,_rgba(14,165,233,0.2)_85%)]" />
    </motion.div>
  );
};

export default CursorBeam2D;