import { Link } from "react-router-dom";
// Icons
import { RiLogoutCircleRLine, RiArrowRightSLine } from "react-icons/ri";

//agrego props para poder recibir la función OnclickButtonSubmenu, showSubmenu y showMenu para poder mostrar el submenu
//agrego props para recibir seciones y poder iterar en SidebarSecciones.jsx
const SidebarRoutes = ({
  onclickButtonSubmenu,
  showSubmenu,
  showMenu,
  //recibo las secciones para poder iterar en SidebarSecciones.jsx
  secciones,
}) => {
  return (
    <>
      {/**container Sidebar*/}
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-100 p-4 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        {/**Titulo de la Empresa*/}
        <h1 className="text-center text-2xl font-bold text-white mb-10">
          AKRON<span className="text-primary text-4xl">.</span>
        </h1>
        {/**SECCIONES*/}
        {/**Itero en secciones para poder mostrar las secciones en SidebarSecciones.jsx*/}
        {secciones.map((seccion) => (
          <ul>
            {/**LISTAADO DE SECCIONES*/}
            <li>
              {/**Boton para desplegar los items de las secciones*/}
              <button
                onClick={onclickButtonSubmenu} //onclickButtonSubmenu es la función que recibo de Sidebar.jsx para poder mostrar el submenu
                className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                {/**  Id de las secciones */}
                {/**  Iconos de las secciones */}
                {/**  Titulo de las secciones */}

                <h1 id={seccion.id} className="flex items-center gap-4">
                  {seccion.icon} {seccion.title}
                </h1>

                {/**  Icono de la flecha cuando se despliega el menu */}
                <RiArrowRightSLine
                  className={`mt-1 ${
                    showSubmenu && "rotate-90"
                  } transition-all`}
                />
              </button>
              {/** Listado de Items de las secciones */}
              <ul
                className={` ${
                  showSubmenu ? "h-full" : "h-0"
                } overflow-y-hidden transition-all`}
              >
                {/** Items de las secciones */}
                {seccion.items.map((seccion) => (
                  <li>
                    {/**  Path a donde te redirigen los items */}
                    <Link
                      to={seccion.path}
                      className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-white transition-colors"
                    >
                      {/**  Titulo de los items de las secciones */}
                      {seccion.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        ))}
        <nav>
          <Link
            to="/"
            className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
          >
            <RiLogoutCircleRLine className="text-primary" /> Cerrar sesión
          </Link>
        </nav>
      </div>
    </>
  );
};

export default SidebarRoutes;
