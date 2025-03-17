// New utility file for comprehensive image optimization
import { optimizeImageUrl } from './performance';

export const getImageFormat = () => {
  // Check for WebP support
  const canUseWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };
  
  // Check for AVIF support
  const canUseAVIF = () => {
    const img = new Image();
    img.onload = () => true;
    img.onerror = () => false;
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    return img.complete;
  };
  
  return {
    webp: canUseWebP(),
    avif: canUseAVIF()
  };
};

export const generateResponsiveImageSrcSet = (url, sizes = [400, 800, 1200]) => {
  if (!url) return { src: '', srcSet: '' };
  
  const formats = getImageFormat();
  const baseUrl = url.split('?')[0]; // Remove any existing query params
  
  // Default format (original or jpg)
  let srcSet = sizes.map(size => 
    `${optimizeImageUrl(baseUrl, size)} ${size}w`
  ).join(', ');
  
  // Use modern formats if supported
  if (formats.avif) {
    srcSet = sizes.map(size => 
      `${baseUrl}?auto=format&fmt=avif&w=${size}&q=80 ${size}w`
    ).join(', ');
  } else if (formats.webp) {
    srcSet = sizes.map(size => 
      `${baseUrl}?auto=format&fmt=webp&w=${size}&q=80 ${size}w`
    ).join(', ');
  }
  
  return {
    src: optimizeImageUrl(url),
    srcSet
  };
};

// Helper component for optimized images
export const getOptimizedImageProps = (url, alt = '', sizes = '100vw') => {
  const { src, srcSet } = generateResponsiveImageSrcSet(url);
  
  return {
    src,
    srcSet,
    sizes,
    alt,
    loading: 'lazy',
    decoding: 'async',
    width: 800, // Default width, should be overridden when used
    height: 600, // Default height, should be overridden when used
  };
};