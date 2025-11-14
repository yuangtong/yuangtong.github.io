/**
 * Hook de revelado progresivo al hacer scroll
 * Usa IntersectionObserver para marcar elementos como visibles
 */
import { useEffect, useRef, useState } from 'react';

export interface ScrollRevealOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Scroll reveal con IntersectionObserver
 * - Activa con un pequeño offset vía rootMargin (por defecto 150px)
 * - Respeta `prefers-reduced-motion`: muestra sin animación
 */
export function useScrollReveal(options: ScrollRevealOptions = { rootMargin: '0px 0px 150px 0px', threshold: 0.2 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Accesibilidad: si el usuario prefiere reducir movimiento, no animamos
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Fallback por compatibilidad amplia
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Re-trigger: marca visible al entrar y oculta al salir
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return { ref, isVisible } as const;
}

export default useScrollReveal;