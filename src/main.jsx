import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' //Se usa BrowserRouter para envolver la app para facilitar el enrutamiento entre paginas y componentes

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />  
    </BrowserRouter>
  </StrictMode>,
)
