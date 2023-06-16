import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

const ApiMasy = axios.create({
  baseURL: "https://mcwebapi.masydase.com/",
  headers: {
    "Content-type": "application/json",
  },
});

ApiMasy.interceptors.request.use(
  (config) => {
    const token = authHelper.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return error;
  }
);

ApiMasy.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = authHelper.getAccessToken();
      const refreshToken = authHelper.getRefreshToken();
      const params = {
        token: token,
        refreshToken: refreshToken,
      };
      const result = await ApiMasy.post(`/api/Sesion/ActualizarToken `, params);
      if (result.status === 200) {
        const { token } = result.data.data;
        authHelper.login(result.data.data);
        ApiMasy.defaults.headers.common["Authorization"] = "Bearer " + token;
        return ApiMasy(originalRequest);
      } else {
        window.location.href = "/login";
        console.log("Error al actualizar el token");
      }
    } else if (error.response.status === 400) {
      window.location.href = "/login";
      console.log("Error al actualizar el token error 400");
    }
    let retorna = "";
    if (Object.entries(error.response.data).length > 0) {
      retorna = error.response.data.messages[0];
    } else {
      //404
      retorna = { tipo: 1, textos: [error.message] };
    }
    return retorna;
  }
);

export default ApiMasy;
