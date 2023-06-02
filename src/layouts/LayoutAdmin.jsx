import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebarComponent/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import store from "store2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { authHelper } from "../helpers/AuthHelper";
import Enter from "../components/funciones/Enter";
const LayoutAdmin = () => {
  const navigate = useNavigate();
  const { borrarTodosLosTokens } = authHelper;

  useEffect(() => {
    if (
      !store.session.get("access_token") ||
      !store.local.get("access_token")
    ) {
      borrarTodosLosTokens();
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
        <Enter>
          <div className="h-[78vh] md:h-[84vh] w-full overflow-y-auto">
            <Outlet />
          </div>
        </Enter>
        <div className="h-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
