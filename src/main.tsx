import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startLanguage } from './lib/i18n';
import './index.css';

// A visitor who picked another language sees it from the first paint, not after a flash of English.
startLanguage().then(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
);
