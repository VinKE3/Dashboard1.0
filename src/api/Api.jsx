import axios from "axios";
import { authHelper } from "../helpers/AuthHelper";

export default axios.create({
  baseURL: "https://mcwebapi.masydase.com/",
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },

  interceptors: {
    request: {
      use:
        ((config) => {
          const token = authHelper.getAccessToken();
          console.log(token);
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
        }),
    },
    response: {
      use:
        ((response) => {
          return response;
        },
        (error) => {
          if (error.response.status === 401) {
            window.location.href = "/login";
          }
        }),
    },
  },
});
