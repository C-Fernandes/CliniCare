import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import '././styles/style.scss'
import App from './App.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { PreferencesProvider } from './providers/PreferencesProvider.tsx'
import { ToastProvider } from './providers/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </PreferencesProvider>
  </StrictMode>,
)
