// Utility for loading third-party scripts efficiently
export const loadScript = (
  src: string, 
  async: boolean = true, 
  defer: boolean = true,
  onLoad?: () => void
): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = src;
  script.async = async;
  script.defer = defer;
  
  if (onLoad) {
    script.onload = onLoad;
  }
  
  document.body.appendChild(script);
  return script;
};

// Load non-critical scripts after page load
export const loadNonCriticalScripts = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Example: Analytics, social media widgets, etc.
      setTimeout(() => {
        // loadScript('https://example.com/analytics.js');
      }, 2000); // Delay loading by 2 seconds after page load
    });
  }
};