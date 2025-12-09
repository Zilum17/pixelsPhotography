/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useState } from "react"; 
import { updatePedidoRequest, detallePedidoRequest } from "../api/apiAxios";

const ORDER_ID_KEY = 'LAST_ORDER_ID';
const INVOICE_STORAGE_KEY = 'LAST_INVOICE_DATA';

const loadOrderId = () => {
    try {
        const storedValue = localStorage.getItem(ORDER_ID_KEY);
        return storedValue ? JSON.parse(storedValue) : null; 
    } catch (error) {
        console.error("Error al cargar el ID de pedido de LocalStorage:", error);
        return null;
    }
};

const saveInvoiceData = (data) => {
    try {
        localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error al guardar la factura en LocalStorage:", error);
    }
};

const loadInvoiceData = () => {
    try {
        const storedValue = localStorage.getItem(INVOICE_STORAGE_KEY);
        return storedValue ? JSON.parse(storedValue) : null; 
    } catch (error) {
        console.error("Error al cargar la factura de LocalStorage:", error);
        return null;
    }
};

const removeInvoiceData = () => {
    try {
        localStorage.removeItem(INVOICE_STORAGE_KEY);
        localStorage.removeItem(ORDER_ID_KEY);
    } catch (error) {
        console.error("Error al remover la factura de LocalStorage:", error);
    }
};

export const FactureContext = createContext();

export const useFacture = () => {
    const context = useContext(FactureContext);
    if (!context) throw new Error('useFacture must be used within a FactureContextProvider');
    return context;
}

export const FactureContextProvider = ({children}) => {
  
  const [invoice, setInvoice] = useState(loadInvoiceData());
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const getSavedOrderId = useCallback(() => {
      return loadOrderId();
  }, []);
  
  const updatePedido = useCallback(async (cliente) => {
    setLoading(true);
    const lastOrderId = getSavedOrderId();

    if (!lastOrderId) {
        setLoading(false);
        throw new Error("No se encontró un ID de pedido guardado.");
    }

    const paddedId = String(lastOrderId).padStart(5, '0');
    const newInvoiceNumber = `F-2025-${paddedId}`;
    const datosFiscales = cliente?.rfc || 'PIX987654321A1';

    const invoiceData = {
        pedido_id: lastOrderId, 
        numero_factura: newInvoiceNumber,
        datos_fiscales_cliente: datosFiscales
    };
    const dataI = {
        cliente_id: cliente.cliente_id
    }

    try {
        await updatePedidoRequest(dataI);
        setInvoice(invoiceData);
        saveInvoiceData(invoiceData);
    } catch(error) {
        console.error("Error al actualizar el pedido para facturar:", error);
        setInvoice(null);
        throw error;
    } finally {
        setLoading(false);
    }
  }, [getSavedOrderId]);

  const fetchOrderDetails = useCallback(async () => {
    setDetailsLoading(true);
    try {
        const id = getSavedOrderId();
        if (!id) {
            setOrderDetails([]);
            setDetailsLoading(false);
            return;
        }
        const response = await detallePedidoRequest(id);
        setOrderDetails(response.data);
    } catch (error) {
        console.error("Error al cargar detalles del pedido:", error);
        setOrderDetails([]);
    } finally {
        setDetailsLoading(false);
    }
  }, [getSavedOrderId]);

  return(
      <FactureContext.Provider value={{ 
        updatePedido,
        invoice,
        loading,
        removeInvoiceData,
        fetchOrderDetails,
        orderDetails,
        detailsLoading
      }}>
          {children}
      </FactureContext.Provider>
  )
}