import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useNavigate } from "react-router-dom";
import store from "store2";
import { authHelper } from "../helpers/AuthHelper";
import { RiLogoutCircleRLine } from "react-icons/ri";

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
    console.log("logout");
  };
  return (
    <header className="h-[10vh] border-b border-b-primario md:p-8 items-center pb-8 lg:pb-0">
      <nav className=" flex flex-col md:flex-row items-center justify-between">
        <h1 className="mb-1 font-bold just text-xl">
          Bienvenido{" "}
          <span className="text-primary">{store.session.get("usuario")}</span>
        </h1>
        <div className="card flex justify-content-center gap-2">
          <Menu model={items} popup ref={menu} />
          <Button
            label="Empresa"
            icon="pi pi-building"
            onClick={(e) => menu.current.toggle(e)}
          />
          <div>
            <Button
              onClick={handleLogout}
              className="flex items-center font-bold gap-4 py-2 px-4 rounded-lg bg-primary transition-colors w-full text-black"
            >
              <RiLogoutCircleRLine className="text-black" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
