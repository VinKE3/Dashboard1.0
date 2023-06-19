import React, { useState } from "react";
import BotonCerrarMenu from "../boton/BotonCerrarMenu";
import seccionesList from "./SeccionesMenus";
import SidebarMenus from "./SidebarMenus";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const handleActiveSection = (seccion) => {
    setActiveSection(seccion);
  };
  const secciones = seccionesList();

  return (
    <>
      <SidebarMenus
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
