import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
