/**
 * Hook: useScrollControls
 * Propósito: Gestiona la visibilidad y estado de controles de scroll
 * - Detecta overflow vertical y si el usuario ha iniciado scroll
 * - Expone capacidades para desplazamiento arriba/abajo
 * - Oculta indicadores cuando no hay más contenido en una dirección
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ScrollControlsState {
  canScrollUp: boolean;
  canScrollDown: boolean;
  showControls: boolean; // hay overflow vertical
  hasScrolled: boolean; // usuario inició scroll
  onScrollUp: () => void;
  onScrollDown: () => void;
}

export function useScrollControls(): ScrollControlsState {
  const [scrollY, setScrollY] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [viewport, setViewport] = useState({ height: 0 });
  const [docHeight, setDocHeight] = useState<number>(0);

  // Actualiza medidas iniciales y al redimensionar
  useEffect(() => {
    const updateSizes = () => {
      setViewport({ height: window.innerHeight });
      const doc = document;
      const bodyHeight = doc.body ? doc.body.scrollHeight : 0;
      const docHeightEl = doc.documentElement ? doc.documentElement.scrollHeight : 0;
      setDocHeight(Math.max(bodyHeight, docHeightEl));
    };
    updateSizes();
    window.addEventListener('resize', updateSizes, { passive: true });
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // Escucha scroll para estados
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
      setHasScrolled(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const canScrollUp = scrollY > 8;
  const maxScrollY = Math.max(0, docHeight - viewport.height);
  const canScrollDown = scrollY < maxScrollY - 8;
  const showControls = docHeight - viewport.height > 16; // hay contenido adicional

  const onScrollUp = useCallback(() => {
    const atBottom = scrollY >= Math.max(0, docHeight - viewport.height - 8);
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -Math.round(viewport.height * 0.8), behavior: 'smooth' });
    }
  }, [viewport.height, scrollY, docHeight]);

  const onScrollDown = useCallback(() => {
    window.scrollBy({ top: Math.round(viewport.height * 0.8), behavior: 'smooth' });
  }, [viewport.height]);

  return useMemo(
    () => ({ canScrollUp, canScrollDown, showControls, hasScrolled, onScrollUp, onScrollDown }),
    [canScrollUp, canScrollDown, showControls, hasScrolled, onScrollUp, onScrollDown]
  );
}