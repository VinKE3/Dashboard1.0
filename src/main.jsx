import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/ContextAuth";
import { UserProvider } from "./context/ContextUser";
import { MenuProvider } from "./context/ContextMenu";
import { ApiProvider } from "./context/ContextApiError";
import { ConfiguracionProvider } from "./context/ContextConfiguracion";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApiProvider>
    <AuthProvider>
      <UserProvider>
        <MenuProvider>
          <ConfiguracionProvider>
            <App />
          </ConfiguracionProvider>
        </MenuProvider>
      </UserProvider>
    </AuthProvider>
  </ApiProvider>
);