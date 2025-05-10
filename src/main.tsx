
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import i18n configuration before rendering the app
// This ensures i18n is initialized before any components using translations are rendered
import './i18n/config';
// Import other things after i18n is initialized
import App from './App.tsx';
import './index.css';

// Make the jsx helper globally available for emergency fixes
import jsx from './utils/jsx-helper';
(window as any).jsx = jsx;

// Create a dedicated function for rendering to ensure i18n is fully loaded
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Ensure i18n is ready before rendering
renderApp();
