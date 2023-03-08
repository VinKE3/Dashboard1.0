import React, { useState } from "react";
import secciones from "./Secciones";
import BotonCerrarMenu from "../BotonesComponent/BotonCerrarMenu";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const handleActiveSection = (seccion) => {
    setActiveSection(seccion);
  };

  return (
    <>
      <SidebarRoutes
        onclickButtonSubmenu={() => setShowSubmenu(!showSubmenu)}
        showSubmenu={showSubmenu}
        showMenu={showMenu}
        onClickShowMenu={() => setShowMenu(!showMenu)}
        secciones={secciones}
        activeSection={activeSection}
        handleActiveSection={handleActiveSection}
      />
      <BotonCerrarMenu
        onClickButton={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
      />
    </>
  );
};

export default Sidebar;
