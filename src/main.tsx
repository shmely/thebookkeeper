import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { KeeperProvider } from './context/KeeperContext'

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

// תפיסת האירוע מיד עם טעינת הדפדפן ושמירתו על ה-window
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KeeperProvider>
      <App />
    </KeeperProvider>
  </StrictMode>,
)
