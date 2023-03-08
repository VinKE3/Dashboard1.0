import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";
import Swal from "sweetalert2";
import { useContext } from "react";
import { APIErrorContext } from "../context/ContextError";
import useApiError from "../context/UseApiError";

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

function useAPIError() {
  const { error, addError, removeError } = useContext(APIErrorContext);

  return { error, addError, removeError };
}

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
    const { addError } = useAPIError();

    if (error.response.status === 400) {
      addError(error.response.data.message, error.response.status);
      console.log(error.response.data.message);
    }

    if (error.response.status === 404) {
      addError(error.response.data.message, error.response.status);
    }

    if (error.response.status === 500) {
      addError(error.response.data.message, error.response.status);
    }

    return Promise.reject(error);
  }
);

export default ApiMasy;
