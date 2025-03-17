// Font optimization utilities
export const optimizeFontLoading = () => {
  // Add font display swap to all Google Fonts
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  
  fontLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('&display=swap')) {
      const newHref = href.includes('?') 
        ? `${href}&display=swap` 
        : `${href}?display=swap`;
      link.setAttribute('href', newHref);
    }
  });
  
  // Add preconnect for Google Fonts
  if (fontLinks.length > 0 && !document.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]')) {
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    
    document.head.insertBefore(preconnectGoogle, document.head.firstChild);
    document.head.insertBefore(preconnectGstatic, document.head.firstChild);
  }
};

// Call this function in your main.tsx