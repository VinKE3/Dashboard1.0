import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

const Api = axios.create({
  baseURL: "mcwebapi-tienda.masydase.com/",
  headers: {
    "Content-type": "application/json",
  },
  responseType: "blob",
});

Api.interceptors.request.use(
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

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let response = error;
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    return response;
  }
);

export default Api;
