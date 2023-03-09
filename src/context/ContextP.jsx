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
  const [user2, setUser2] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (params) => {
    setIsLoading(true);
    setError(null);
    setToken(null);
    setUser2(null);
    try {
      const result = await ApiMasy.post(`/api/Sesion/Iniciar`, params);
      if (result.status === 200) {
        const { token } = result.data.data;
        setToken(token);
        var decoded = jwt_decode(token);
        var jwtDecoded =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUser2(jwtDecoded);
        authHelper.login(result.data.data);
      }
    } catch (error) {
      setError(error?.response);
    }
    setIsLoading(false);
  };

  return {
    user2,
    token,
    login,
    error,
    isLoading,
  };
};
