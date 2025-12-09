import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDom from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollTop.jsx'

const BASE_ROUTE = "/";
ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <App />
    </HashRouter>
  </StrictMode>,
)
