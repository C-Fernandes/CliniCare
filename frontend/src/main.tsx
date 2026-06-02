import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '././styles/style.scss'
import App from './App.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { ToastProvider } from './providers/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
