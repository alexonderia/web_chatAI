import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app/App';
import { ThemeSettingsProvider } from './theme/ThemeSettingsProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeSettingsProvider>
      <App />
    </ThemeSettingsProvider>
  </React.StrictMode>,
);
