import React, { createContext, useContext, useEffect, useState } from "react";
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
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState([]);
  const [nick, setNick] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState([]);
  const [isActivo, setIsActivo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUser = async (params) => {
    try {
      setIsLoading(true);
      const result = await ApiMasy.get(
        `/api/Mantenimiento/Usuario/Listar`,
        params
      );
      if (result.status === 200) {
        const data = result.data.data.data;
        const id = data.map((item) => item.id);
        const nick = data.map((item) => item.nick);
        const tipoUsuario = data.map((item) => item.tipoUsuario);
        const isActivo = data.map((item) => item.isActivo);
        setUsuarios(data);
        setId(id);
        setNick(nick);
        setTipoUsuario(tipoUsuario);
        setIsActivo(isActivo);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return {
    id,
    nick,
    tipoUsuario,
    isActivo,
    isLoading,
    error,
    getUser,
    usuarios,
  };
};
