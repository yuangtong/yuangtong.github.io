/**
 * Página principal Home
 * Agrupa todas las secciones principales del portfolio
 */

import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Work from '../components/sections/Work';
import Projects from '../components/sections/Projects';
import Blog from '../components/sections/Blog';
import Testimonials from '../components/sections/Testimonials';
import Timeline from '../components/sections/Timeline';
import ScrollControls from '../components/ui/ScrollControls';

const Home: React.FC = () => {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <About />
      <Timeline />
      <Work />
      <Projects />
      <Blog />
      <Testimonials />
      {/* Controles de scroll vertical: aparecen suavemente al detectar scroll */}
      <ScrollControls />
    </main>
  );
};

export default Home;