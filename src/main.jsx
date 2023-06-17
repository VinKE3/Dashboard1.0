import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApiProvider } from "./context/ContextApiError";
import { AuthProvider } from "./context/ContextAuth";
import { ConfiguracionProvider } from "./context/ContextConfiguracion";
import { MenuProvider } from "./context/ContextMenu";
import { UserProvider } from "./context/ContextUser";
import "./index.css";

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
