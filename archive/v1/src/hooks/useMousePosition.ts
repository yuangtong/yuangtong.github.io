import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasHoverSupport, setHasHoverSupport] = useState(false);

  useEffect(() => {
    // Check if device supports hover
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasHoverSupport(mediaQuery.matches);

    const updateMousePosition = (e: MouseEvent) => {
      if (hasHoverSupport) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (hasHoverSupport) {
      window.addEventListener('mousemove', updateMousePosition);

      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }
  }, [hasHoverSupport]);

  // Return null position if hover is not supported
  return hasHoverSupport ? mousePosition : { x: 0, y: 0 };
};