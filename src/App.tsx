import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { useTheme } from './context/ThemeContext';
import { TranslationProvider } from './context/TranslationContext';
import { lazyLoad } from './utils/performance';
import { registerServiceWorker } from './utils/registerServiceWorker';

// Lazy load components
const { Component: HomePage } = lazyLoad(() => import('./components/Hero'));
const { Component: ProjectsPage } = lazyLoad(() => import('./components/Projects'));
const { Component: ProjectDetailPage } = lazyLoad(() => import('./pages/projects/ProjectDetails'));
const { Component: WorkPage } = lazyLoad(() => import('./pages/work/WorkPage')); // Changed path
const { Component: WorkDetailsPage } = lazyLoad(() => import('./pages/work/WorkDetails'));
const { Component: BlogPage } = lazyLoad(() => import('./pages/blog/BlogPage')); // Changed path
const { Component: BlogPostPage } = lazyLoad(() => import('./pages/blog/BlogPost'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// App component without Router (will be used inside AppWrapper)
function App() {
  const { isDark } = useTheme();
  const location = useLocation();
  
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
  }, []);
  
  return (
    <div className={`relative ${isDark ? 'dark' : ''}`}>
      <Cursor />
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

// Wrapper component that provides Router
function AppWrapper() {
  return (
    <TranslationProvider>
      <Router>
        <App />
      </Router>
    </TranslationProvider>
  );
}

export default AppWrapper;