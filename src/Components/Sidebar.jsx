import React from "react";
import SidebarRoutes from "./SidebarRoutes";
import SidebarSalir from "./SidebarSalir";

const Sidebar = () => {
  return (
    <>
      <div className="xl:h-[100vh] overflow-y-scroll fixed lg:static w-full h-full -left-full top-0 bg-secondary-100 p-8 flex flex-col justify-between">
        <SidebarRoutes />
        <SidebarSalir />
      </div>
    </>
  );
};

export default Sidebar;
