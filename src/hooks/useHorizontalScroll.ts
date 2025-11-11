/**
 * Hook: useHorizontalScroll
 * Propósito: Gestiona controles de scroll horizontal para contenedores con overflow
 */
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

export interface HorizontalScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  showControls: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export function useHorizontalScroll(
  ref: RefObject<HTMLElement>,
  deps: ReadonlyArray<any> = []
): HorizontalScrollState {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth - clientWidth > 4; // margen para redondeos
    setShowControls(overflow);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, [ref]);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => update();
    const onResize = () => update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Actualiza tras el siguiente frame para capturar cambios de layout
    const raf = requestAnimationFrame(() => update());
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, update, ...deps]);

  const onScrollLeft = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: -Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  }, [ref]);

  const onScrollRight = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  }, [ref]);

  return useMemo(
    () => ({ canScrollLeft, canScrollRight, showControls, onScrollLeft, onScrollRight }),
    [canScrollLeft, canScrollRight, showControls, onScrollLeft, onScrollRight]
  );
}