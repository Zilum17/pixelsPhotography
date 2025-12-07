import { useState, useCallback } from "react";
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
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const classifyAndLimitProducts = useCallback((data) => {
    const allCameras = data.filter(p => !p.es_accesorio);
    const allAccessories = data.filter(p => p.es_accesorio);
    setCameras(allCameras);
    setAccessories(allAccessories);
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await productRequest();
      const rawData = response.data
      // console.log(rawData)
      setProducts(rawData)
      classifyAndLimitProducts(rawData)
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const getProduct = async (id) => {
    setLoading(true);
    let productData = products.find(p => p.producto_id == id);
    
    if (!productData || products.length === 0) {
        try {
            const response = await productRequest(); 
            const rawData = response.data
            productData = rawData.find(p => p.producto_id == id);
            setProducts(rawData);
            classifyAndLimitProducts(rawData); 
        } catch (error) {
            console.error("Error fetching single product:", error);
            productData = null; 
        }
    }
    
    setProduct(productData || null);
    setLoading(false);
  }

  return(
    <ProductContext.Provider value={{
      getProducts,
      getProduct,
      products,
      product,
      loading,
      cameras,
      accessories
    }}>
      {children}
    </ProductContext.Provider>
  )
}