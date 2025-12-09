/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react"; 
import { allOrdersRequest } from "../api/apiAxios";

export const OrderHistoryContext = createContext();

export const useOrderHistory = () => {
    const context = useContext(OrderHistoryContext);
    if (!context) throw new Error('useOrderHistory must be used within a OrderHistoryContextProvider');
    return context;
}

export const OrderHistoryContextProvider = ({children}) => {
    
    const [orderHistory, setOrderHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    const fetchOrderHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);

        try {
            const response = await allOrdersRequest(); 
            setOrderHistory(response.data);

        } catch (err) {
            console.error("Error al cargar el historial de pedidos:", err);
            setHistoryError("No se pudo cargar el historial.");
            setOrderHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    }, []); 

    return(
        <OrderHistoryContext.Provider value={{ 
            orderHistory,
            historyLoading,
            historyError,
            fetchOrderHistory,
        }}>
            {children}
        </OrderHistoryContext.Provider>
    )
}