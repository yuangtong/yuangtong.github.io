/**
 * Componente Layout principal
 * Envuelve todas las páginas con Header, Footer y elementos comunes
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Cursor from '../ui/Cursor';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`relative ${isDark ? 'dark' : ''}`}>
      <Cursor />
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;