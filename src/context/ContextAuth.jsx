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
  //#region useState
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //Datos que retorna
  const [usuario, setUsuario] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [afectarStock, setAfectarStock] = useState("");
  const [global, setGlobal] = useState([]);
  //Datos que retorna
  //#endregion

  const login = async (params) => {
    setIsLoading(true);
    setError(null);
    setToken(null);
    setUsuario(null);
    setUsuarioId(null);
    setPersonalId(null);
    setAfectarStock(null);
    setGlobal(null);
    try {
      const result = await ApiMasy.post(`/api/Sesion/Iniciar`, params);
      if (result.status === 200) {
        const { token } = result.data.data;

        //Asigna el token
        setToken(token);
        //Asigna el token

        var tokenDecodificado = jwt_decode(token);

        const usuario =
          tokenDecodificado[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        const usuarioId =
          tokenDecodificado[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const personalId = tokenDecodificado["PersonalId"];
        const afectarStock = tokenDecodificado["HabilitarAfectarStock"];
        
        setUsuario(usuario);
        setUsuarioId(usuarioId);
        setPersonalId(personalId);
        setAfectarStock(afectarStock);

        authHelper.login(result.data.data);
        authHelper.usuarioGuardar({ usuario: usuario });
        authHelper.usuarioIdGuardar({ usuarioId: usuarioId });
        authHelper.personalIdGuardar({ personalId: personalId });
        authHelper.afectarStockGuardar({ afectarStock: afectarStock });

        //Datos Global
        const res = await ApiMasy.get(`api/Empresa/Configuracion/GetSimplificado`);
        setGlobal(res.data.data)
        authHelper.globalGuardar({ global: res.data.data });
        // Datos Global
      }
    } catch (error) {
      setError(error?.response);
    }
    setIsLoading(false);
  };

  return {
    login,
    token,
    isLoading,
    error,
    usuarioId,
    usuario,
    personalId,
    afectarStock,
    global
  };
};
