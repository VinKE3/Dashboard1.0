import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

const ApiMasy = axios.create({
  baseURL: "https://mcwebapi.masydase.com/",
});

ApiMasy.interceptors.request.use(
  (config) => {
    const token = authHelper.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
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
  }
);

export default ApiMasy;
