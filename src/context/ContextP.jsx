import React, { createContext, useContext, useState } from "react";
import { authHelper } from "../helpers/AuthHelper";
import ApiMasy from "../api/ApiMasy";
import Api from "../api/Api";

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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (params) => {
    setIsLoading(true);
    setError(null);
    setToken(null);
    try {
      console.log("tratando");
      const result = await Api.post(`/api/Sesion/Iniciar`, params);
      console.log(result);
      if (result.status === 200) {
        const { token } = result.data.data;
        setToken(token);
        authHelper.login(result.data.data);
      }
    } catch (error) {
      setError(error?.response);
    }
    setIsLoading(false);
  };

  return {
    token,
    login,
    error,
    isLoading,
  };
};
