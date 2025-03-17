import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { TranslationProvider } from './context/TranslationContext';
import { ThemeProvider } from './context/ThemeContext';
import { optimizeFontLoading } from './utils/fontOptimization';
import { loadNonCriticalScripts } from './utils/scriptLoader';

// Initialize optimizations
optimizeFontLoading();
loadNonCriticalScripts();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);