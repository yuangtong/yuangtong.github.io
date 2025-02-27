import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { useTheme } from './context/ThemeContext';
import { TranslationProvider } from './context/TranslationContext';

function App() {
  const { isDark } = useTheme();
  
  return (
    <TranslationProvider>
      <Router>
        <div className={`relative ${isDark ? 'dark' : ''}`}>
          <Cursor />
          <Header />
          <Routes>
            <Route path="/" element={
              <main className="relative overflow-hidden">
                <Hero />
                <About />
                { /* <Work /> */ }
                { <Projects /> }
                { /* <BlogPage /> */ }
                <Contact /> 
              </main>
            } />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </TranslationProvider>
  );
}

export default App;