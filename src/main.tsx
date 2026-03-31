import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './components/Header/header.tsx'
import { KeeperProvider } from './context/KeeperContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KeeperProvider>
      <Header/>
      <App />
    </KeeperProvider>
  </StrictMode>,
)
