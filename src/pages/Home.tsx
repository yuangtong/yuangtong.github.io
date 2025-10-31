/**
 * Página principal Home
 * Agrupa todas las secciones principales del portfolio
 */

import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Work from '../components/sections/Work';
import Projects from '../components/sections/Projects';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

const Home: React.FC = () => {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <About />
      <Work />
      <Projects />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default Home;