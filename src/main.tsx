import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app/App';
import { ThemeSettingsProvider } from './theme/ThemeSettingsProvider';
import { AuthProvider } from './features/auth/AuthProvider';
import { SettingsProvider } from './features/settings/SettingsProvider';
import { ModelProvider } from './features/ai/ModelProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeSettingsProvider>
      <AuthProvider>
        <SettingsProvider>
          <ModelProvider>
            <App />
          </ModelProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeSettingsProvider>
  </React.StrictMode>,
);