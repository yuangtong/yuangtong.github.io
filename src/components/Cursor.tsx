import React from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';

const Cursor = () => {
  const mousePosition = useMousePosition();
  const [hasHoverSupport, setHasHoverSupport] = React.useState(false);
  
  React.useEffect(() => {
    // Check if device supports hover
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasHoverSupport(mediaQuery.matches);
    
    // Listen for changes (e.g., when connecting external mouse to mobile)
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasHoverSupport(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Don't render cursor on devices without hover support (mobile)
  if (!hasHoverSupport) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-pink-500 rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: "spring",
          damping: 15,
          mass: 0.25,
        }}
      />
      
      {/* Trailing effect */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 border-2 border-black dark:border-white rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
        }}
        transition={{
          type: "spring",
          damping: 25,
          mass: 0.5,
        }}
      />
    </>
  );
};

export default Cursor;