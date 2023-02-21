import axios from "axios";
import * as types from "actions/ActionTypes";
import { authHelper } from "helpers/AuthHelper";
import history from "../history";
import store from "../store";

const apiMasy = axios.create({
  baseURL: process.env.API_URL,
});

apiMasy.interceptors.request.use(
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

apiMasy.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if (apiMasy.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response.status === 401 || error.response.status === 403) {
      const token = authHelper.getAccessToken();

      originalRequest.headers.Authorization = `Bearer ${token}`;
      originalRequest.headers["Content-Type"] = "application/json";

      return axios(originalRequest).catch(() => {
        if (history.location.pathname !== "/login") {
          store.dispatch({ type: types.USER_LOGOUT });
          authHelper.borrarTodosLosTokens();
          window.location.href = "/login";
        }
      });
    }

    return Promise.reject(error);
  }
);

apiMasy.CancelToken = axios.CancelToken;
apiMasy.isCancel = axios.isCancel;

export default apiMasy;
