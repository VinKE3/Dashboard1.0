import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import store from "store2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Enter from "../components/funciones/Enter";
import Sidebar from "../components/sidebarComponent/Sidebar";
import { authHelper } from "../helpers/AuthHelper";

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
          <div className="h-[78vh] md:h-[86vh] w-full overflow-y-auto">
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
