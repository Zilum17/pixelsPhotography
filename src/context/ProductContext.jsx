/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useState, useCallback, useContext, createContext } from "react";
import { productRequest } from "../api/apiAxios";

const PRODUCTS_STORAGE_KEY = 'ALL_PRODUCTS_DATA';
const SINGLE_PRODUCT_KEY = 'LAST_VIEWED_PRODUCT';

const saveProductsData = (data) => {
    try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) { /* ... */ }
};

const loadProductsData = () => {
    try {
        const storedValue = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        return storedValue ? JSON.parse(storedValue) : [];
    } catch (error) { return []; }
};

const saveSingleProductData = (data) => {
    try {
        localStorage.setItem(SINGLE_PRODUCT_KEY, JSON.stringify(data));
    } catch (error) { /* ... */ }
};

const loadSingleProductData = () => {
    try {
        const storedValue = localStorage.getItem(SINGLE_PRODUCT_KEY);
        return storedValue ? JSON.parse(storedValue) : {};
    } catch (error) { return {}; }
};


export const ProductContext = createContext();
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductContextProvider')
  return context;
}

export const ProductContextProvider = ({children}) => {
  const [products, setProducts] = useState(loadProductsData()); 
  const [product, setProduct] = useState(loadSingleProductData()); 
  
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const classifyAndLimitProducts = useCallback((data) => {
    const allCameras = data.filter(p => !p.es_accesorio);
    const allAccessories = data.filter(p => p.es_accesorio);
    setCameras(allCameras);
    setAccessories(allAccessories);
  }, []);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productRequest();
      const rawData = Array.isArray(response.data) ? response.data : [];
      setProducts(rawData)
      saveProductsData(rawData); 
      classifyAndLimitProducts(rawData)
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [classifyAndLimitProducts]);

  const getProduct = useCallback(async (id) => {
    setLoading(true);
    let productData = products.find(p => p.producto_id == id);
    
    if (!productData || products.length === 0) {
        try {
            const response = await productRequest(); 
            const rawData = response.data
            productData = rawData.find(p => p.producto_id == id);
            
            setProducts(rawData);
            saveProductsData(rawData); 
            
            classifyAndLimitProducts(rawData); 
        } catch (error) {
            console.error("Error fetching single product:", error);
            productData = null; 
        }
    }
    
    setProduct(productData || null);
    saveSingleProductData(productData || null); 
    setLoading(false);
  }, [products, classifyAndLimitProducts]);

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