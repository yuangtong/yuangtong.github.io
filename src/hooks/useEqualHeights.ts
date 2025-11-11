/**
 * Hook: useEqualHeights
 * Propósito: Igualar dinámicamente la altura de elementos hijos
 * al valor máximo detectado dentro de un contenedor dado.
 */
import { RefObject, useEffect } from 'react';

export function useEqualHeights(
  containerRef: RefObject<HTMLElement>,
  selector?: string,
  deps: ReadonlyArray<any> = []
) {
  useEffect(() => {
    const container = containerRef.current as HTMLElement | null;
    if (!container) return;

    const getTargets = (): HTMLElement[] => {
      const nodes = selector
        ? Array.from(container.querySelectorAll(selector))
        : Array.from(container.children);
      return nodes.filter((n): n is HTMLElement => n instanceof HTMLElement);
    };

    const applyEqualHeights = () => {
      const targets = getTargets();
      if (targets.length === 0) return;
      // Reset heights to measure natural content height
      targets.forEach((el) => (el.style.height = 'auto'));
      const max = Math.max(...targets.map((el) => el.offsetHeight));
      targets.forEach((el) => (el.style.height = `${max}px`));
    };

    // First apply
    applyEqualHeights();

    // Observe size changes to re-equalize (e.g., fonts, translations)
    const ro = new ResizeObserver(() => {
      applyEqualHeights();
    });
    getTargets().forEach((el) => ro.observe(el));

    // Re-equalize on next frame to catch late content paints
    const raf = requestAnimationFrame(() => applyEqualHeights());

    const onResize = () => applyEqualHeights();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, ...deps]);
}