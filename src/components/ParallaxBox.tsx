import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';

interface ParallaxBoxProps {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}

const ParallaxBox = ({ children, distance = 100, className = '' }: ParallaxBoxProps) => {
  const { y } = useParallax(distance);

  return (
    <motion.div
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxBox;