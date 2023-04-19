import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SidebarComponent/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import store from "store2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
        <div className="h-[78vh] md:h-[84vh] overflow-y-scroll px-0 md:px-4">
          <Outlet />
        </div>
        <div className="h-[8vh]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
