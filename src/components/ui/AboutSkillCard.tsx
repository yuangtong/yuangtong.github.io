/**
 * Componente: AboutSkillCard
 * Propósito: Replica el diseño y comportamiento de SpringCards.jsx
 * para las tarjetas del bloque "About Me", omitiendo el botón
 * de acción. Mantiene tipografía existente y responsividad.
 */
import React from 'react';
import { MotionConfig, motion } from 'framer-motion';

export interface AboutSkillCardProps {
  title: string;
  subtitle: string;
  Icon: React.ComponentType<any>;
  className?: string;
}

const AboutSkillCard: React.FC<AboutSkillCardProps> = ({ title, subtitle, Icon, className = '' }) => {
  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.5 }}>
      <motion.div whileHover="hovered" className={`group w-full border-2 border-black bg-emerald-300 ${className}`}>
        <motion.div
          initial={{ x: 0, y: 0 }}
          variants={{ hovered: { x: -8, y: -8 } }}
          className={`-m-0.5 border-2 border-black bg-emerald-300 ${className}`}
        >
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -8, y: -8 } }}
            className={`relative -m-0.5 flex h-72 flex-col justify-between overflow-hidden border-2 border-black bg-emerald-300 p-8 ${className}`}
          >
            {/* Encabezado con icono y título */}
            <p className="flex items-center text-2xl font-medium">
              <Icon className="mr-2 w-6 h-6" />
              {title}
            </p>
            <div>
              <p className="transition-[margin] duration-300 ease-in-out group-hover:mb-10 font-mono">
                {subtitle}
              </p>
            </div>

            {/* Círculo rotatorio con texto decorativo */}
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
              style={{ top: '0', right: '0', x: '50%', y: '-50%', scale: 0.75 }}
              width="200"
              height="200"
              className="pointer-events-none absolute z-10 rounded-full"
            >
              <path id="circlePath" d="M100,100 m-100,0 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0" fill="none" />
              <text>
                <textPath href="#circlePath" fill="black" className="fill-black text-2xl font-black uppercase opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  LEARN MORE • LEARN MORE • LEARN MORE • LEARN MORE •
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

export default AboutSkillCard;