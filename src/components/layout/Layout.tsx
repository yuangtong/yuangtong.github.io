/**
 * Componente Layout principal
 * Envuelve todas las páginas con Header, Footer y elementos comunes
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Cursor from '../ui/Cursor';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import Contact from '../sections/Contact';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark } = useTheme();
  const location = useLocation();
  // Nota: Las páginas de archivo (projects, work, blog) gestionan su propia NavigationBar.
  // Evitamos renderizar una barra duplicada desde Layout.

  return (
    <div className={`relative ${isDark ? 'dark' : ''}`}>
      <Cursor />
      <Header />
      {/* NavigationBar removida del Layout para evitar duplicidad en páginas de archivo */}
      {children}
      <Contact />
      <Footer />
    </div>
  );
};

export default Layout;