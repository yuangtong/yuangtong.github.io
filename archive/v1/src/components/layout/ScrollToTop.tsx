/**
 * Archivo: ScrollToTop.tsx
 * Propósito: Restablecer el scroll al inicio en cambios de ruta
 * - Evita que las vistas de detalle abran en la parte inferior
 * - No interfiere con anchors (hash) ni con el historial cuando hay hash
 */
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Si hay hash (anchors) deja que el navegador haga scroll al target
    if (location.hash) return;
    // Sólo cuando cambia la ruta (pathname), no al cambiar query params
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;