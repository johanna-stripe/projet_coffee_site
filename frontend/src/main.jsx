import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './3.style/settings.css'
import './3.style/style.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
