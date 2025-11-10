import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Home from './pages/Home';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import { WorkPage } from './pages/work/WorkPage';
import { WorkDetails } from './pages/work/WorkDetails';
import PaymentsPage from './pages/payment/PaymentsPage';
import { TranslationProvider } from './context/TranslationContext';

function App() {
  return (
    <TranslationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<WorkDetails />} />
            <Route path="/paynow" element={<PaymentsPage />} />
          </Routes>
        </Layout>
      </Router>
    </TranslationProvider>
  );
}

export default App;