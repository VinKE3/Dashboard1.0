import React, { createContext, useContext, useState } from "react";
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
  const [id, setId] = useState(0);
  const [nick, setNick] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(false);
  const [isActivo, setIsActivo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUser = async (params) => {
    try {
      setIsLoading(true);
      const result = await ApiMasy.get(
        `/api/Mantenimiento/Usuario/Listar`,
        params
      );
      console.log(result.data.data.data);
      if (result.status === 200) {
        const { nick, tipoUsuarioDescripcion, isActivo, id } =
          result.data.data.data.map(item);
        setId(id);
        setNick(nick);
        setTipoUsuario(tipoUsuarioDescripcion);
        setIsActivo(isActivo);
        setIsLoading(false);
      }
      console.log(nick);
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
