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
          label: "Usuarios",
          icon: "pi pi-users",
          command: () => {
            navigate("/mantenimiento/usuarios");
          },
        },
        {
          label: "Correlativos",
          icon: "pi pi-list",
          command: () => {
            navigate("/mantenimiento/correlativos");
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
    <header className="h-[13vh] md:h-[8vh]  p-3 border-b border-light">
      <nav className=" flex flex-col md:flex-row items-center justify-between">
        <h1 className="pb-2 md:pb-0 font-bold text-xl">
          Bienvenido {" "}
          <span className="text-primary">{store.session.get("usuario")}</span>
        </h1>
        <div className="card flex justify-content-center gap-2">
          <Menu model={items} popup ref={menu} />
          <Button
            label="Empresa"
            icon="pi pi-building"
            onClick={(e) => menu.current.toggle(e)}
            className={Global.BotonHeader + " !border-none"}
          />
          <div>
            <Button
              onClick={handleLogout}
              className={Global.BotonHeader}
            >
              <RiLogoutCircleRLine className="text-black" />
              <span className="pl-2"> Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
