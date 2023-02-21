import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
//importo secciones para poder iterar en SidebarSecciones.jsx
import secciones from "./Secciones";
//BotonCerrarMenu
import BotonCerrarMenu from "./BotonCerrarMenu";
import SidebarRoutes from "./SidebarRoutes";
//importo componente BotonCerrarMenu para poder usarlo en Sidebar.jsx y poder cerrar el menú
const Sidebar = () => {
  // const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const handleActiveSection = (seccion) => {
    setActiveSection(seccion);
  };

  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     navigate("/login");
  //   }
  // }, []);
  return (
    <>
      <SidebarRoutes
        onclickButtonSubmenu={() => setShowSubmenu(!showSubmenu)}
        showSubmenu={showSubmenu}
        showMenu={showMenu}
        secciones={secciones}
        activeSection={activeSection}
        handleActiveSection={handleActiveSection}
      />
      <BotonCerrarMenu
        // onClick={() => {
        //   localStorage.removeItem("token");
        // }}
        onClickButton={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
      />
    </>
  );
};

export default Sidebar;
