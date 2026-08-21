import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { HotelDataProvider } from './context/HotelDataContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HotelDataProvider>
        <App />
      </HotelDataProvider>
    </AuthProvider>
  </StrictMode>,
)
