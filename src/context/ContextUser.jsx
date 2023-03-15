import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import ApiMasy from "../api/ApiMasy";

const userContext = createContext();

export function UserProvider({ children }) {
  const values = useUserProvider();
  return <userContext.Provider value={values}>{children}</userContext.Provider>;
}

export const useUser = () => {
  return useContext(userContext);
};

export const useUserProvider = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState(0);
  const [nick, setNick] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(false);
  const [isActivo, setIsActivo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    data;
    if (Object.entries(data).length > 0) {
      setId(data.id);
      setNick(data[0].nick);
      setTipoUsuario(data.tipoUsuarioDescripcion);
      setIsActivo(data.isActivo);
      setIsLoading(false);
      console.log(data[0].nick);
    }
  }, [data]);

  const getUser = async (params) => {
    try {
      setIsLoading(true);
      const result = await ApiMasy.get(
        `/api/Mantenimiento/Usuario/Listar`,
        params
      );
      if (result.status === 200) {
        let datos = result.data.data.data.map((item) => {
          return {
            nick: item.nick,
            tipoUsuarioDescripcion: item.tipoUsuarioDescripcion,
            isActivo: item.isActivo,
            id: item.id,
          };
        });
        setData(datos);
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return {
    id,
    nick,
    tipoUsuario,
    isActivo,
    isLoading,
    error,
    getUser,
  };
};
