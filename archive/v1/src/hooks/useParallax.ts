import { useScroll, useTransform, useSpring } from 'framer-motion';

export const useParallax = (distance: number = 100, speed: number = 1) => {
  const { scrollY } = useScroll();
  
  // Create a smoother scrolling effect with springs
  const smoothY = useSpring(
    useTransform(scrollY, [0, 1000], [0, distance * speed]),
    {
      stiffness: 100,
      damping: 30,
      mass: 1
    }
  );
  
  return { y: smoothY };
};