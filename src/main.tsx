import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CVPage from './CVPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CVPage />
  </StrictMode>,
)
