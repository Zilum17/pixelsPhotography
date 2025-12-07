import { createContext } from "react";
import { useContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartContextProvider')
  return context;
}

export const CartContextProvider = ({children}) => {
  

  return(
    <CartContext.Provider value={{

    }}>
      {children}
    </CartContext.Provider>
  )
}