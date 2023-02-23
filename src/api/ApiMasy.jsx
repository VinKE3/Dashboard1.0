import axios from "axios";
import { useNavigate } from "react-router-dom";

export default axios.create({
  baseURL: "https://mcwebapi.masydase.com/",
});

apiMasy.interceptors.request.use(
  (config) => {
    const token = authHelper.getAccessToken();

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
