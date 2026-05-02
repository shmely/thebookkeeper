import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { KeeperProvider } from './context/KeeperContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KeeperProvider>
      <App />
    </KeeperProvider>
  </StrictMode>,
)
