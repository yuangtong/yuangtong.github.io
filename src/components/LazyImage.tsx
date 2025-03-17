import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getOptimizedImageProps } from '../utils/imageOptimization';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  sizes?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, isIntersecting, hasIntersected } = useIntersectionObserver({
    rootMargin: '200px', // Start loading when image is 200px from viewport
  });
  
  const imageProps = getOptimizedImageProps(src, alt, sizes);
  
  // Calculate aspect ratio for placeholder
  const aspectRatio = height && width ? (height / width) * 100 : 56.25; // Default to 16:9
  
  return (
    <div 
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        paddingBottom: `${aspectRatio}%`,
        backgroundColor: placeholderColor,
      }}
    >
      {(isIntersecting || hasIntersected) && (
        <img
          {...imageProps}
          width={width || imageProps.width}
          height={height || imageProps.height}
          onLoad={() => setIsLoaded(true)}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default LazyImage;