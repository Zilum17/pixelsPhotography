import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import { ProductContextProvider } from './context/ProductContext'


function App() {
  return (
    <ProductContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProductContextProvider>
  )
}

export default App
