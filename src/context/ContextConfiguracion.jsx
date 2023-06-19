import React, { createContext, useContext, useState } from "react";
import ApiMasy from "../api/ApiMasy";

const configuracionContext = createContext();
export function ConfiguracionProvider({ children }) {
  const values = useConfiguracionProvider();
  return (
    <configuracionContext.Provider value={values}>
      {children}
    </configuracionContext.Provider>
  );
}

export const useConfiguracion = () => {
  return useContext(configuracionContext);
};

export const useConfiguracionProvider = () => {
  const [configuracion, setConfiguracion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConfiguracion = async (params) => {
    try {
      setIsLoading(true);

      const result = await ApiMasy.get(
        `api/Empresa/Configuracion/GetSimplificado`,
        params
      );
      if (result.status === 200) {
        const data = result.data.data;
        setConfiguracion(data);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return {
    configuracion,
    isLoading,
    error,
    getConfiguracion,
  };
};