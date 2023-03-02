import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

const BASE_URL = "https://mcwebapi.masydase.com/";
const ApiMasy = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

ApiMasy.interceptors.request.use(
  (config) => {
    console.log("interceptor");
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
