import React, { useState } from "react";
import BotonCerrarMenu from "../BotonesComponent/BotonCerrarMenu";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <SidebarRoutes />
      <BotonCerrarMenu
        onClickButton={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
      />
    </>
  );
};

export default Sidebar;
