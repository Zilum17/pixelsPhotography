import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { productRequest } from "../api/apiAxios";

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductContextProvider')
  return context;
}

export const ProductContextProvider = ({children}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await productRequest();
      // console.log(response.data)
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }
  return(
    <ProductContext.Provider value={{
      getProducts,
      products,
      loading
    }}>
      {children}
    </ProductContext.Provider>
  )
}