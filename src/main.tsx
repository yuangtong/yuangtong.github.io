import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './lib/fontawesome'
import './index.css'
import { ThemeProvider } from './context/ThemeContext' // Import your custom ThemeProvider

// Define types for the ErrorBoundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error boundary for the entire application
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("React error boundary caught an error:", error, errorInfo);
    
    // Display error in the error-details element
    const errorDetails = document.getElementById('error-details');
    if (errorDetails) {
      errorDetails.textContent = `React Error: ${error.message}\n\nComponent Stack: ${errorInfo.componentStack}`;
    }
    
    // Show error message
    const loadingEl = document.getElementById('loading');
    const errorMessageEl = document.getElementById('error-message');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorMessageEl) errorMessageEl.style.display = 'flex';
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null; // The error UI is handled by the HTML
    }
    return this.props.children;
  }
}

// Make sure the root element exists before trying to render
const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <ErrorBoundary>
        <ThemeProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ThemeProvider>
      </ErrorBoundary>
    );
  } catch (error: unknown) {
    console.error("Failed to render React application:", error);
    
    const loadingEl = document.getElementById('loading');
    const errorMessageEl = document.getElementById('error-message');
    const errorDetails = document.getElementById('error-details');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorMessageEl) errorMessageEl.style.display = 'flex';
    
    if (errorDetails) {
      errorDetails.textContent = `Render Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
} else {
  console.error("Root element not found");
  
  const loadingEl = document.getElementById('loading');
  const errorMessageEl = document.getElementById('error-message');
  const errorDetails = document.getElementById('error-details');
  
  if (loadingEl) loadingEl.style.display = 'none';
  if (errorMessageEl) errorMessageEl.style.display = 'flex';
  
  if (errorDetails) {
    errorDetails.textContent = "Root element with id 'root' not found in the document";
  }
}