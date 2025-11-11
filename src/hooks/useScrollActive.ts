/**
 * Hook: useScrollActive
 * Propósito: Detecta si el usuario ha iniciado el scroll (scrollY > threshold)
 * y devuelve un booleano para activar estados UI como `position: fixed`.
 */
import { useEffect, useState } from 'react';

export function useScrollActive(threshold: number = 1) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setActive(window.scrollY > threshold);
    };

    // Estado inicial por si ya hay desplazamiento
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return active;
}

export default useScrollActive;