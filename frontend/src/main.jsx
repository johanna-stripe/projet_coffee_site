import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './style/settings.css'
import './style/style.css'
import App from './App.jsx'
import './style/responsive.css' // en dernier : doit surcharger les styles des composants

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
