import React, { useState } from "react";
//importo secciones para poder iterar en SidebarSecciones.jsx
import secciones from "./Secciones";
//BotonCerrarMenu
import BotonCerrarMenu from "./BotonCerrarMenu";
import SidebarRoutes from "./SidebarRoutes";
//importo componente BotonCerrarMenu para poder usarlo en Sidebar.jsx y poder cerrar el menú
const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <>
      <SidebarRoutes
        onclickButtonSubmenu={() => setShowSubmenu(!showSubmenu)}
        showSubmenu={showSubmenu}
        showMenu={showMenu}
        secciones={secciones}
      />
      <BotonCerrarMenu
        onClickButton={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
      />
    </>
  );
};

export default Sidebar;
