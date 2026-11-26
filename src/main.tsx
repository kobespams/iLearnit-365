import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isProdBuild = Boolean((import.meta as unknown as { env?: { PROD?: boolean } }).env?.PROD);

if (typeof window !== 'undefined' && 'serviceWorker' in navigator && isProdBuild) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-fatal in sandboxed previews
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
