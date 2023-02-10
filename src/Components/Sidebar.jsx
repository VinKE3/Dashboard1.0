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
  //necesito leer el id de secciones para poder mostrar el submenu de cada sección que se clickea
  const [idSeccion, setIdSeccion] = useState("");

  return (
    <>
      <SidebarRoutes
        onclickButtonSubmenu={() => setShowSubmenu(!showSubmenu)}
        showSubmenu={showSubmenu}
        showMenu={showMenu}
        secciones={secciones}
        //agrego idSeccion para poder leer el id de la sección que se clickea
        idSeccion={idSeccion}
      />
      <BotonCerrarMenu
        onClickButton={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
      />
    </>
  );
};

export default Sidebar;
