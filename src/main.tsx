import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// GitHub Pages project sites are served from a subpath (e.g. /sevasathi/).
// Vite injects the configured base here; './' (local/root hosting) means '/'.
const base = import.meta.env.BASE_URL
const basename = base === './' || base === '/' ? '/' : base.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
)
