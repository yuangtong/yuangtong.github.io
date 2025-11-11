/**
 * Componente UI: AuroraBackground
 * Propósito: Renderiza un fondo "techy" tipo mesh gradient animado
 * combinado con estrellas usando @react-three/fiber y @react-three/drei.
 * - No intercepta eventos (pointer-events: none)
 * - Se posiciona absolutamente y detrás del contenido (-z-10)
 * - Respeta el modo oscuro/claro del contenedor superior
 */
import React, { useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

// Paleta inspirada en el gradiente original (verdes/amarillos)
// Tailwind approx: yellow-300/400, green-500, emerald-500
const COLORS = ['#FDE047', '#FACC15', '#22C55E', '#10B981'];

export interface AuroraBackgroundProps {
  className?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ className = '' }) => {
  const color = useMotionValue(COLORS[0]);
  // Animar el centro del gradiente para dar sensación de movimiento
  const cx = useMotionValue(50); // porcentaje X
  const cy = useMotionValue(8);  // porcentaje Y (ligeramente por debajo del borde superior)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Animación del color principal que alimenta el radial-gradient
    const controlsColor = animate(color, COLORS, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });

    // Movimiento del centro del gradiente (si no se prefiere reducir el motion)
    const controlsCx = prefersReducedMotion
      ? undefined
      : animate(cx, [50, 78, 50, 22, 50], {
          ease: 'easeInOut',
          duration: 30,
          repeat: Infinity,
          repeatType: 'mirror',
        });
    const controlsCy = prefersReducedMotion
      ? undefined
      : animate(cy, [8, 20, 38, 20, 8], {
          ease: 'easeInOut',
          duration: 30,
          repeat: Infinity,
          repeatType: 'mirror',
        });

    return () => {
      controlsColor.stop();
      controlsCx?.stop();
      controlsCy?.stop();
    };
  }, []);

  // Gradiente radial animado; capa por encima del canvas de estrellas
  // Aurora estilo ejemplo: base oscura + color animado, con centro móvil
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at ${cx}% ${cy}%, #020617 50%, ${color})`;

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ backgroundImage }}
    >
      <Canvas className="absolute inset-0">
        <Stars radius={50} count={1500} factor={3.5} fade speed={1.8} />
      </Canvas>
    </motion.div>
  );
};

export default AuroraBackground;