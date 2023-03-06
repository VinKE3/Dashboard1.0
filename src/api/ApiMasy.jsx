import axios from "axios";
import { useState } from "react";
import { authHelper } from "../helpers/AuthHelper";
import Swal from "sweetalert2";
import Mensajes from "../Components/Mensajes";

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
    return response;
  },
  (error) => {
    if (error.response.status === 400) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: error.response.data.messages[0].textos,
      // });

      <Mensajes
        tipoMensaje={error.response.data.messages[0].tipo}
        mensaje={error.response.data.messages[0].textos}
      />;
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
