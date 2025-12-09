/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react"; 
import { allOrdersRequest, detallePedidoRequest, productRequest } from "../api/apiAxios"; 

export const SalesAnalyticsContext = createContext();

export const useSalesAnalytics = () => {
    const context = useContext(SalesAnalyticsContext);
    if (!context) throw new Error('useSalesAnalytics must be used within a SalesAnalyticsProvider');
    return context;
}

export const SalesAnalyticsContextProvider = ({children}) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTopSellingProducts = useCallback(async () => {
        setLoading(true);
        const salesMap = new Map();
        
        try {
            const ordersResponse = await allOrdersRequest();
            const orderIds = ordersResponse.data.map(order => order.pedido_id);

            for (const id of orderIds) {
                const detailsResponse = await detallePedidoRequest(id);
                if (!Array.isArray(detailsResponse.data)) {
                    console.warn(`Detalles de pedido ID ${id} no es un array.`);
                    continue; 
                }
                for (const detail of detailsResponse.data) {
                    const { producto_id, cantidad } = detail;
                    const currentQuantity = salesMap.get(producto_id) || 0;
                    salesMap.set(producto_id, currentQuantity + cantidad);
                }
            }

            const productsResponse = await productRequest();
            const products = productsResponse.data;
            
            const productSales = Array.from(salesMap, ([producto_id, cantidad_vendida]) => {
                const product = products.find(p => p.producto_id === producto_id) || {};
                return {
                    producto_id,
                    nombre: product.nombre || `Producto Desconocido (${producto_id})`,
                    cantidad_vendida
                };
            });

            const sortedTop10 = productSales
                .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
                .slice(0, 10);

            setTopProducts(sortedTop10);
            
        } catch (error) {
            console.error("Error al obtener el top de productos:", error);
            setTopProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return(
        <SalesAnalyticsContext.Provider value={{ 
            topProducts,
            loading,
            fetchTopSellingProducts,
        }}>
            {children}
        </SalesAnalyticsContext.Provider>
    )
}