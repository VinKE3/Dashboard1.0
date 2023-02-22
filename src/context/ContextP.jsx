import React, { createContext, useContext, useState } from "react";
import { authHelper } from "../helpers/AuthHelper";
import axios from "../api/axios";

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

  const login = async (params) => {
    try {
      const result = await axios.post(`/api/Sesion/Iniciar`, params);
      if (result.status === 200) {
        const { token } = result.data;
        setToken(token);
        authHelper.login(result.data);
      }
    } catch (error) {
      console.log({ error });
      setError(error);
      setIsLoading(false);
    }
  };

  return {
    token,
    login,
    error,
  };
};
