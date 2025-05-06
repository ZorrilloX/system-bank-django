import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterConfig from './navigation/RouterConfig.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RouterConfig/>
    </BrowserRouter>
  </StrictMode>,
)
