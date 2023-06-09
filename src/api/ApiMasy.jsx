import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

const ApiMasy = axios.create({
  baseURL: "https://mcwebapi-tienda.masydase.com/",
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
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
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
