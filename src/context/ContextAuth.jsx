import React, { createContext, useContext, useState } from "react";
import { authHelper } from "../helpers/AuthHelper";
import ApiMasy from "../api/ApiMasy";
import jwt_decode from "jwt-decode";

const authContext = createContext();

export function AuthProvider({ children }) {
  const values = useAuthProvider();
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export const useAuthProvider = () => {
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (params) => {
    setIsLoading(true);
    setError(null);
    setToken(null);
    setUsuario(null);
    try {
      const result = await ApiMasy.post(`/api/Sesion/Iniciar`, params);
      if (result.status === 200) {
        const { token } = result.data.data;
        setToken(token);
        var decoded = jwt_decode(token);
        const jwtDecoded =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUsuario(jwtDecoded);
        authHelper.login(result.data.data);
        authHelper.usuarioGuardar({ usuario: jwtDecoded });
      }
    } catch (error) {
      setError(error?.response);
    }
    setIsLoading(false);
  };

  return {
    usuario,
    token,
    login,
    error,
    isLoading,
  };
};
