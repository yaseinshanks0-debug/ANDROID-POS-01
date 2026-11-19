import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initRealUserMonitoring } from './lib/performance-monitor';
import { tryGuardedChunkReload } from './lib/lazy-import';

// Recover cleanly if Vite reports a stale chunk / preload error after an update or server restart
window.addEventListener('vite:preloadError', (event) => {
  if (tryGuardedChunkReload()) {
    event.preventDefault();
  }
});

initRealUserMonitoring();

createRoot(document.getElementById('root')!).render(<App />);
