// Lazy loading utility for components
import { lazy, ComponentType } from 'react';

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
): { Component: React.LazyExoticComponent<T>; fallback: React.ReactNode } {
  const Component = lazy(importFunc);
  return { Component, fallback };
}

// Image optimization helper
export const optimizeImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
  // If it's an Unsplash image, use their optimization parameters
  if (url.includes('unsplash.com')) {
    // Check if the URL already has parameters
    const hasParams = url.includes('?');
    const connector = hasParams ? '&' : '?';
    return `${url}${connector}auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  
  // For other images, return as is (you might want to implement other CDN-specific optimizations)
  return url;
};

// Defer non-critical resources
export const deferResource = (url: string, type: 'script' | 'style'): void => {
  const element = document.createElement(type === 'script' ? 'script' : 'link');
  
  if (type === 'script') {
    (element as HTMLScriptElement).src = url;
    (element as HTMLScriptElement).defer = true;
  } else {
    (element as HTMLLinkElement).href = url;
    (element as HTMLLinkElement).rel = 'stylesheet';
    (element as HTMLLinkElement).media = 'print';
    (element as HTMLLinkElement).onload = () => {
      (element as HTMLLinkElement).media = 'all';
    };
  }
  
  document.head.appendChild(element);
};