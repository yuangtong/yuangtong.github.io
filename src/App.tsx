import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Home from './pages/Home';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import PaymentsPage from './pages/payment/PaymentsPage';
import { TranslationProvider } from './context/TranslationContext';

function App() {
  return (
    <TranslationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
            <Route path="/paynow" element={<PaymentsPage />} />
          </Routes>
        </Layout>
      </Router>
    </TranslationProvider>
  );
}

export default App;