import React from 'react';
import { getOptimizedImageProps } from '../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw'
}) => {
  const imageProps = getOptimizedImageProps(src, alt, sizes);
  
  return (
    <img
      {...imageProps}
      width={width || imageProps.width}
      height={height || imageProps.height}
      className={className}
    />
  );
};

export default OptimizedImage;