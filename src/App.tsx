import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Projects from './components/Projects';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogPost } from './pages/blog/BlogPost';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import { WorkDetails } from './pages/work/WorkDetails';
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
                { /* <Projects /> */ }
                { /* <BlogPage /> */ }
                <Contact /> 
              </main>
            } />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            <Route path="/work/:slug" element={<WorkDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </TranslationProvider>
  );
}

export default App;