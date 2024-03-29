import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/ContextAuth";
import { UserProvider } from "./context/ContextUser";
import { MenuProvider } from "./context/ContextMenu";
import { ApiProvider } from "./context/ContextApiError";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApiProvider>
    <AuthProvider>
      <UserProvider>
        <MenuProvider>
          <App />
        </MenuProvider>
      </UserProvider>
    </AuthProvider>
  </ApiProvider>
);
