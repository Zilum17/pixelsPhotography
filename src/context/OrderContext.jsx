import { createContext, useContext, useState, useCallback } from "react"; 
import { orderRequest } from "../api/apiAxios";

const ORDER_ID_KEY = 'LAST_ORDER_ID';

const saveOrderId = (orderId) => {
    try {
        localStorage.setItem(ORDER_ID_KEY, JSON.stringify(orderId));
    } catch (error) {
        console.error("Error al guardar el ID de pedido en LocalStorage:", error);
    }
};

const loadOrderId = () => {
    try {
        const storedValue = localStorage.getItem(ORDER_ID_KEY);

        return storedValue ? JSON.parse(storedValue) : null; 
    } catch (error) {
        console.error("Error al cargar el ID de pedido de LocalStorage:", error);
        return null;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const OrderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used within a OrderContextProvider');
    return context;
}

export const OrderContextProvider = ({children}) => {
    
    const [lastOrderId, setLastOrderId] = useState(loadOrderId());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = useCallback(async (clientId, cartDetails) => {
        setLoading(true);
        setError(null);
        
        const orderData = {
            cliente_id: clientId,
            detalles: cartDetails
        };

        try {
            const response = await orderRequest(orderData);
            
            const { pedido_id } = response.data;
            
            saveOrderId(pedido_id);
            setLastOrderId(pedido_id);

            setLoading(false);
            // return { success: true, pedidoId: pedido_id, message: mensaje };

        } catch (err) {
            console.error("Error al crear el pedido:", err);
            setError(err.response?.data?.mensaje || "Error al procesar el pedido.");
            setLoading(false);
            // return { success: false, message: err.response?.data?.mensaje || "Error desconocido." };
        }
    }, []); 

    const getSavedOrderId = useCallback(() => {
        return loadOrderId();
    }, []);


    return(
        <OrderContext.Provider value={{ 
            lastOrderId,
            loading,
            error,
            createOrder,
            getSavedOrderId,
            saveOrderId,
        }}>
            {children}
        </OrderContext.Provider>
    )
}