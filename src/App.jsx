import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import { ProductContextProvider } from './context/ProductContext'
import Order from './pages/Order'
import Cart from './pages/Cart'
import Facture from './pages/Facture'


function App() {
  return (
    <ProductContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/facture" element={<Facture />} />
        <Route path="*" elementd={<NotFound />} />
      </Routes>
    </ProductContextProvider>
  )
}

export default App
