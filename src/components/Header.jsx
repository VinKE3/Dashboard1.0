import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useNavigate } from "react-router-dom";
import store from "store2";
import { authHelper } from "../helpers/AuthHelper";
import { RiLogoutCircleRLine } from "react-icons/ri";
import * as G from "../components/Global";

const Header = () => {
  const menu = useRef(null);
  const navigate = useNavigate();
  const { borrarTodosLosTokens } = authHelper;
  const items = [
    {
      items: [
        {
          label: "Configuración",
          icon: "pi pi-cog",
          command: () => {
            navigate("/mantenimiento/empresa");
          },
        },
        {
          label: "Usuario",
          icon: "pi pi-users",
          command: () => {
            navigate("/mantenimiento/usuario");
          },
        },
        {
          label: "Correlativos",
          icon: "pi pi-list",
          command: () => {
            navigate("/mantenimiento/correlativo");
          },
        },
      ],
    },
  ];
  const handleLogout = () => {
    borrarTodosLosTokens();
    window.location.href = "/login";
  };
  return (
    <header className="bg-secondary-300">
      <nav className="h-full p-2 pt-3.5 flex flex-col md:flex-row items-center justify-between ">
        <p className={G.TituloUsuario}>
          Bienvenido{" "}
          <span className="text-primary">{store.session.get("usuario")}</span>
        </p>
        <div className="flex items-center justify-center gap-x-2">
          <Menu model={items} popup ref={menu} />
          <Button
            icon="pi pi-building"
            onClick={(e) => menu.current.toggle(e)}
            className={G.BotonBasico + G.BotonHeader + "h-7 !border-none" }
          >
            <span className="hidden sm:block pl-2">EMPRESA</span>
          </Button>
          <div>
            <Button
              onClick={handleLogout}
              className={G.BotonBasico + G.BotonHeader + "h-7 !border-none"
              }
            >
              <RiLogoutCircleRLine className="text-black" />
              <span className="hidden sm:block pl-2">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
