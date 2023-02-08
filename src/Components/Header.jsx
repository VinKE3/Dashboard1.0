import React from "react";
import { FaBuilding } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="h-[7vh] md:h-[10vh] border-b border-b-primario p-8 items-center">
      <nav className="flex items-center justify-between">
        <h1 className="font-bold">
          Bienvenido <span className="text-primario">Usuario</span>
        </h1>
        <Menu
          menuClassName={"bg-secondary-100 text-white"}
          menuButton={
            <MenuButton className="flex gap-1 hover:bg-secondary-100 py-2 px-4 rounded-lg">
              <FaBuilding className="text-primario text-2xl" />
              <span>Empresa</span>
              <RiArrowDownSLine className="text-primario text-2xl" />
            </MenuButton>
          }
          transition
        >
          <MenuItem className="rounded-lg hover:bg-secondary-900">
            <Link to="/configuracion" className="flex items-center text-white">
              Configuración
            </Link>
          </MenuItem>
          <MenuItem className="rounded-lg hover:bg-secondary-900">
            <Link to="/usuarios" className="flex items-center text-white">
              Usuarios
            </Link>
          </MenuItem>
          <MenuItem className="rounded-lg hover:bg-secondary-900">
            <Link to="/correlativos" className="flex items-center text-white">
              Correlativos
            </Link>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Header;
