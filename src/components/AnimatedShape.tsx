import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';

interface AnimatedShapeProps {
  className?: string;
  depth?: number;
  children?: React.ReactNode;
}

const AnimatedShape: React.FC<AnimatedShapeProps> = ({
  className = '',
  depth = 1,
  children
}) => {
  const { y } = useParallax(100 * depth);

  // Increased movement range and faster animation
  const randomMovement = {
    x: [-20, 20],
    y: [-20, 20],
    rotate: [-15, 15],
  };

  return (
    <motion.div
      style={{ y }}
      animate={randomMovement}
      transition={{
        duration: 2, // Faster animation
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        // Add random delay to create more organic movement
        delay: Math.random() * 2
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedShape;