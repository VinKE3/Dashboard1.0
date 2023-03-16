import React, { createContext, useContext, useState } from "react";
import ApiMasy from "../api/ApiMasy";

const menuContext = createContext();

export function MenuProvider({ children }) {
  const values = useMenuProvider();
  return <menuContext.Provider value={values}>{children}</menuContext.Provider>;
}

export const useMenu = () => {
  return useContext(menuContext);
};

export const useMenuProvider = () => {
  const [menu, setMenu] = useState([]);
  const [id, setId] = useState([]);
  const [nombre, setNombre] = useState([]);
  const [isActivo, setIsActivo] = useState([]);
  const [sistemaAreaId, setSistemaAreaId] = useState([]);
  const [sistemaAreaNombre, setSistemaAreaNombre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMenu = async (params) => {
    try {
      setIsLoading(true);
      const result = await ApiMasy.get(`api/Menu/Listar`, params);
      if (result.status === 200) {
        const data = result.data.data;
        const id = data.map((item) => item.id);
        const nombre = data.map((item) => item.nombre);
        const isActivo = data.map((item) => item.isActivo);
        const sistemaAreaId = data.map((item) => item.sistemaAreaId);
        const sistemaAreaNombre = data.map((item) => item.sistemaAreaNombre);
        setMenu(data);
        setId(id);
        setNombre(nombre);
        setIsActivo(isActivo);
        setSistemaAreaId(sistemaAreaId);
        setSistemaAreaNombre(sistemaAreaNombre);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return {
    menu,
    id,
    nombre,
    isActivo,
    sistemaAreaId,
    sistemaAreaNombre,
    isLoading,
    error,
    getMenu,
  };
};
