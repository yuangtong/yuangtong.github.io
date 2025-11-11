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
import NavigationBar from '../ui/NavigationBar';
import Contact from '../sections/Contact';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark } = useTheme();
  const location = useLocation();
  const isArchiveRoute = /^\/(projects|work|blog)\/?$/.test(location.pathname);

  return (
    <div className={`relative ${isDark ? 'dark' : ''}`}>
      <Cursor />
      <Header />
      {isArchiveRoute && <NavigationBar />}
      {children}
      <Contact />
      <Footer />
    </div>
  );
};

export default Layout;