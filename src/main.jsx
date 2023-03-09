import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/ContextP";
import APIErrorProvider from "./context/ContextError";
import Interceptors from "./api/InterceptorsApiMasy";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <APIErrorProvider>
        <Interceptors> */}
      <App />
      {/* </Interceptors>
      </APIErrorProvider> */}
    </AuthProvider>
  </React.StrictMode>
);
