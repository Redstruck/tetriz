import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { serviceWorkerManager } from './utils/serviceWorkerManager'

// Initialize the PWA service worker
const initializePWA = async () => {
  try {
    await serviceWorkerManager.register();
    console.log('[PWA] Service worker manager initialized successfully');
  } catch (error) {
    console.error('[PWA] Failed to initialize service worker:', error);
  }
};

// Initialize PWA features
initializePWA();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
