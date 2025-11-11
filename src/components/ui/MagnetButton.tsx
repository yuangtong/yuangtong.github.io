/**
 * Componente: MagnetButton
 * Propósito: Replica el comportamiento del ejemplo MagnetButton.jsx
 * usando FontAwesome (phone / phone-volume) y texto circular con
 * "Schedule a Free Consultation".
 */
import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition, IconLookup } from '@fortawesome/fontawesome-svg-core';

export interface MagnetButtonProps {
  href?: string; // opcional para compatibilidad
  onClick?: () => void; // abre modal
}

const getSolidIcon = (name: string) => {
  const lookup: IconLookup = { prefix: 'fas', iconName: name as any };
  return findIconDefinition(lookup);
};

const MagnetButton: React.FC<MagnetButtonProps> = ({ href, onClick }) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { mass: 3, stiffness: 400, damping: 50 });
  const ySpring = useSpring(y, { mass: 3, stiffness: 400, damping: 50 });

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set(e.clientX - (left + width / 2));
    y.set(e.clientY - (top + height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const phone = getSolidIcon('phone');
  const phoneVolume = getSolidIcon('phone-volume');

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (onClick) {
        onClick();
      } else if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
      e.preventDefault();
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label="Schedule a Free Consultation"
      style={{ transform, willChange: 'transform' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="group relative grid h-[clamp(64px,20vw,144px)] w-[clamp(64px,20vw,144px)] place-content-center rounded-full border-2 border-black transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
    >
      {/* Icono centrado en todas las resoluciones móviles */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 transition-all duration-300 ease-out group-hover:rotate-0">
        <FontAwesomeIcon icon={phone} className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl group-hover:hidden" />
        <FontAwesomeIcon icon={phoneVolume} className="hidden text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl group-hover:inline" />
      </span>

      {/* Burbuja de fondo */}
      <div className="pointer-events-none absolute inset-0 z-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-out group-hover:scale-100" />

      {/* Texto circular */}
      {/* SVG con viewBox estable para escalar proporcionalmente con CSS */}
      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        className="pointer-events-none absolute z-10 w-[85%] h-[85%]"
        viewBox="0 0 100 100"
      >
        {/* Radio proporcional al viewBox (100x100) para legibilidad en todos los tamaños */}
        <path id="circlePathMagnet" d="M50,50 m-46,0 a46,46 0 1,0 92,0 a46,46 0 1,0 -92,0" fill="none" />
        <text>
          <textPath
            href="#circlePathMagnet"
            fill="black"
            className="fill-black text-[10px] sm:text-xs md:text-sm font-mono uppercase opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            startOffset="25%"
            style={{ letterSpacing: '0.5px' }}
          >
            Schedule a Free Consultation • Schedule a Free Consultation • Schedule a Free Consultation •
          </textPath>
        </text>
      </motion.svg>
    </motion.button>
  );
};

export default MagnetButton;