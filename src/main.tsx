import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log("Running in mode:", import.meta.env.MODE);
console.log("Auth server:", import.meta.env.VITE_AUTH_SERVER_URL);

