import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Products'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
