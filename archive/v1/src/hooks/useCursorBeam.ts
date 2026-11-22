/**
 * Hook: useCursorBeam
 * Propósito: Gestiona posición del cursor relativa a un contenedor (Hero)
 * y deriva intensidad en función de la velocidad para un haz 2D.
 */
import { useEffect } from 'react';
import { useMotionValue, animate } from 'framer-motion';

export interface UseCursorBeamOptions {
  container: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
}

export const useCursorBeam = ({ container, disabled = false }: UseCursorBeamOptions) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const intensity = useMotionValue(0.2); // opacidad base

  useEffect(() => {
    if (disabled) return;
    const el = container.current;
    if (!el) return;

    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();

    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      x.set(nx);
      y.set(ny);

      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dx = nx - lastX;
      const dy = ny - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
      const target = Math.min(0.35, 0.2 + speed * 0.25); // límite de opacidad
      animate(intensity, target, { duration: 0.15 });

      lastX = nx;
      lastY = ny;
      lastT = now;
    };

    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [container, disabled, x, y, intensity]);

  return { x, y, intensity };
};