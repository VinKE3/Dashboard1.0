import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";
import Swal from "sweetalert2";

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
    Promise.reject(error);
  }
);

ApiMasy.interceptors.response.use(
  (response) => {
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Exito",
        text: "Operación realizada con éxito",
      });
    }
    return response;
  },
  (error) => {
    if (error.response.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.messages[0].textos,
      });
    } else if (error.response.status === 401) {
      window.location.href = "/login";
    } else if (error.response.status === 409) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.messages[0].textos,
      });
    }
  }
);

export default ApiMasy;
