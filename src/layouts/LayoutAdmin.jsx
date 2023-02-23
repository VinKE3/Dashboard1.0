import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SidebarComponent/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LayoutAdmin = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
        <div className="h-[80vh] overflow-y-scroll p-8">
          <Outlet />
        </div>
        <div className="h-[10vh]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
