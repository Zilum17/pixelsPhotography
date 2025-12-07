import { useCallback } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";

const CART_STORAGE_KEY = 'CART_ITEMS';

const checkCartEmpty = () => {
  try {
    const storedValue = localStorage.getItem('CART_ITEMS');
    if (!storedValue) {
        return false;
    }
    const cart = JSON.parse(storedValue);
    return Array.isArray(cart) && cart.length > 0;
  } catch (error) {
    console.error("Error al verificar el carrito:", error);
    return false;
  }
};

const saveCartData = (data) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
};

const loadCartData = () => {
  try {
    const storedValue = localStorage.getItem(CART_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    console.error("Error al cargar el carrito de LocalStorage:", error);
    return [];
  }
};

const removeCartData = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error al remover de LocalStorage:", error);
   }
};

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartContextProvider')
  return context;
}

export const CartContextProvider = ({children}) => {
  
  const [cartItems, setCartItems] = useState(loadCartData());
    
  const addToCart = useCallback((productId, quantity = 1) => { 
    setCartItems((prevItems) => {
      const id = parseInt(productId);
      const qty = parseInt(quantity);
      
      if (qty <= 0) return prevItems; 
      const existingItemIndex = prevItems.findIndex(item => item.id === id);

      let updatedCart;

      if (existingItemIndex > -1) {
        updatedCart = prevItems.map((item, index) => 
          index === existingItemIndex
            ? { ...item, cantidad: item.cantidad + qty }
            : item
        );
      } else {
        const newItem = {
          id: id,
          cantidad: qty,
        };
        updatedCart = [...prevItems, newItem];
      }
      saveCartData(updatedCart);
      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
        const id = parseInt(productId);
        const updatedCart = prevItems.filter(item => item.id !== id);
        
        saveCartData(updatedCart);
        return updatedCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    removeCartData();
    console.log("Carrito vaciado.");
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems((prevItems) => {
      const id = parseInt(productId);
      const qty = parseInt(newQuantity);

      if (qty <= 0) {
        const updatedCart = prevItems.filter(item => item.product != id);
        saveCartData(updatedCart);
        return updatedCart;
      }

      const existingItemIndex = prevItems.findIndex(item => item.id == id);
      if (existingItemIndex > -1) {
        const updatedCart = prevItems.map((item, index) => 
          index == existingItemIndex
            ? { ...item, cantidad: qty }
            : item
        );
        
        saveCartData(updatedCart);
        return updatedCart;
      }
      return prevItems;
    });
  }, []);
  

  return(
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      checkCartEmpty,
    }}>
      {children}
    </CartContext.Provider>
  )
}