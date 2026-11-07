import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initRealUserMonitoring } from './lib/performance-monitor';

initRealUserMonitoring();

createRoot(document.getElementById('root')!).render(<App />);
