import React from "react";
import { FaBuilding } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextAuth";

const Header = () => {
  const { usuario } = useAuth();
  return (
    <header className="h-[10vh] border-b border-b-primario p-8 items-center pb-8 lg:pb-0">
      <nav className="flex items-center justify-between">
        <h1 className="font-bold just">
          Bienvenido <span className="text-primary">{usuario}</span>
        </h1>
        <div>
          <Menu
            menuClassName={"bg-secondary-100 text-white"}
            menuButton={
              <MenuButton className="flex gap-1 hover:bg-secondary-100 py-2 px-4 rounded-lg">
                <FaBuilding className="text-primary text-2xl" />
                <span>Empresa</span>
                <RiArrowDownSLine className="text-primary text-2xl" />
              </MenuButton>
            }
            transition
          >
            <MenuItem className="rounded-lg hover:bg-secondary-900 hover:text-primary">
              <Link
                to="/configuracion"
                className="flex items-center hover:text-primary"
              >
                Configuración
              </Link>
            </MenuItem>
            <MenuItem className="rounded-lg hover:bg-secondary-900 hover:text-primary">
              <Link
                to="/usuarios"
                className="flex items-center  hover:text-primary"
              >
                Usuarios
              </Link>
            </MenuItem>
            <MenuItem className="rounded-lg hover:bg-secondary-900 hover:text-primary">
              <Link
                to="/correlativos"
                className="flex items-center hover:text-primary"
              >
                Correlativos
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
