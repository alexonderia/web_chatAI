import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app/App';
import { ThemeSettingsProvider } from './theme/ThemeSettingsProvider';
import { AuthProvider } from './features/auth/AuthProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeSettingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeSettingsProvider>
  </React.StrictMode>,
);