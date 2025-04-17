
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupUserRewardsSystem } from './integrations/supabase/setup-user-rewards';

// Initialize the rewards system
setupUserRewardsSystem();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
