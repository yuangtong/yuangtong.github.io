// Utility to load CSS asynchronously
export const loadCSS = (href: string): void => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  document.head.appendChild(link);
  
  // Once loaded, switch to 'all' media
  link.onload = () => {
    link.media = 'all';
  };
};

// Function to inject critical CSS
export const injectCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};