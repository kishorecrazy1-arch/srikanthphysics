import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/* Dev only: open protected pages without auth, e.g. /foundation-dashboard?testMode=1 */
if (import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('testMode') === '1') {
    localStorage.setItem('testMode', 'true');
    params.delete('testMode');
    const qs = params.toString();
    const path = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    window.history.replaceState(null, '', path || window.location.pathname);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
