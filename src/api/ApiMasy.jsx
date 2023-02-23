import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authHelper } from "../helpers/AuthHelper";

const ApiMasy = axios.create({
  baseURL: "https://mcwebapi.masydase.com/",
});

ApiMasy.interceptors.request.use(
  (config) => {
    const token = authHelper.getAccessToken();
    const navigate = useNavigate();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      navigate("/login");
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default ApiMasy;
