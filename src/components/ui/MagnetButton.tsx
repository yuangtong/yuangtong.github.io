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
  href: string;
}

const getSolidIcon = (name: string) => {
  const lookup: IconLookup = { prefix: 'fas', iconName: name as any };
  return findIconDefinition(lookup);
};

const MagnetButton: React.FC<MagnetButtonProps> = ({ href }) => {
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
      window.open(href, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
      aria-label="Schedule a Free Consultation"
      style={{ transform }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="group relative grid h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 place-content-center rounded-full border-2 border-black transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
    >
      {/* Icono FontAwesome: cambia en hover */}
      <span className="pointer-events-none absolute bottom-3 right-3 md:relative md:bottom-auto md:right-auto z-10 text-black transition-all duration-300 ease-out group-hover:rotate-0">
        <FontAwesomeIcon icon={phone} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl group-hover:hidden" />
        <FontAwesomeIcon icon={phoneVolume} className="hidden text-2xl sm:text-3xl md:text-4xl lg:text-5xl group-hover:inline" />
      </span>

      {/* Burbuja de fondo */}
      <div className="pointer-events-none absolute inset-0 z-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-out group-hover:scale-100" />

      {/* Texto circular */}
      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        className="pointer-events-none absolute z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
        className="pointer-events-none absolute z-10"
      >
        {/* Radio reducido para dejar margen dentro del botón y mejorar legibilidad */}
        <path id="circlePathMagnet" d="M100,100 m-85,0 a85,85 0 1,0 170,0 a85,85 0 1,0 -170,0" fill="none" />
        <text>
          <textPath
            href="#circlePathMagnet"
            fill="black"
            className="fill-black text-xs sm:text-sm font-mono uppercase opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            startOffset="0%"
            style={{ letterSpacing: '1px' }}
          >
            Schedule a Free Consultation • Schedule a Free Consultation • Schedule a Free Consultation •
          </textPath>
        </text>
      </motion.svg>
    </motion.button>
  );
};

export default MagnetButton;