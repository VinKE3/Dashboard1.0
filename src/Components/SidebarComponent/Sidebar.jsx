import React, { useState } from "react";
import seccionesList from "./Secciones";
import BotonCerrarMenu from "../BotonesComponent/BotonCerrarMenu";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  const [showSecciones, setShowSecciones] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const handleActiveSection = (seccion) => {
    setActiveSection(seccion);
  };
  const secciones = seccionesList();

  return (
    <>
      <SidebarRoutes
        onclickButtonSubmenu={() => setShowSubmenu(!showSubmenu)}
        showSubmenu={showSubmenu}
        showMenu={showMenu}
        onClickShowMenu={() => setShowMenu(!showMenu)}
        secciones={secciones}
        showSecciones={showSecciones}
        setShowSecciones={setShowSecciones}
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
