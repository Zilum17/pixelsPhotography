import { useCallback } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { clientRequest } from "../api/apiAxios";
const LOCAL_STORAGE_KEY = 'cliente_data';

const saveClientData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving to LocalStorage:", error);
    }
};

const loadClientData = () => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error("Error loading from LocalStorage:", error);
        return null;
    }
};

const removeClientData = () => {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error("Error removing from LocalStorage:", error);
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const ClienteContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) throw new Error('useCliente must be used within a ClienteContextProvider')
  return context;
}

export const ClienteContextProvider = ({children}) => {
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState(loadClientData());

  const login = useCallback(async (email, password) => {
  setLoading(true);
  
  try {
      const response = await clientRequest(
        {
          email,
          password
        }
      );
      const serverClientData = response.data;
      
      const clientDataToStore = {
        id: serverClientData.cliente_id,
        email: serverClientData.email,
        password: serverClientData.password_hash
      };

      saveClientData(clientDataToStore);
      setCliente(serverClientData); // Guardar el objeto estandarizado

    } catch (err) {
        setCliente(null);
        removeClientData();
        throw err; 
    } finally {
        setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setCliente(null);
    removeClientData();
  }, []);
  
  return(
    <ClienteContext.Provider value={{ 
      loadClientData,
      login,
      loading,
      cliente,
      logout
    }}>
      {children}
    </ClienteContext.Provider>
  )
}