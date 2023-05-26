import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useNavigate } from "react-router-dom";
import store from "store2";
import { authHelper } from "../helpers/AuthHelper";
import { RiLogoutCircleRLine } from "react-icons/ri";
import * as Global from "../components/Global";

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
    <header className="h-auto pt-3 pb-2 px-3 ">
      <nav className="h-full pb-3 md:pb-0 flex flex-col md:flex-row items-center justify-between">
        <h1 className="pb-2 md:pb-0 font-bold text-xl">
          Bienvenido{" "}
          <span className="text-primary">{store.session.get("usuario")}</span>
        </h1>
        <div className="card flex justify-content-center gap-2">
          <Menu model={items} popup ref={menu} />
          <Button
            icon="pi pi-building"
            onClick={(e) => menu.current.toggle(e)}
            className={
              Global.BotonBasico + " " + Global.BotonHeader + " !border-none"
            }
          >
            <span className="hidden sm:block pl-2">EMPRESA</span>
          </Button>
          <div>
            <Button
              onClick={handleLogout}
              className={
                Global.BotonBasico + " " + Global.BotonHeader + " !border-none"
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
