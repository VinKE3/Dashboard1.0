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
  //recibo idSeccion para poder leer el id de la sección que se clickea
  idSeccion,
  handleActiveSection,
  activeSection,
}) => {
  const onClickSubMenu = (e) => {
    console.log(e.target.id);
    e.preventDefault();
    handleActiveSection(e.target.id);
    if (e.target.id === activeSection) {
      handleActiveSection("");
    }
    //al darle click a las secciones no se muestra el submenu
    if (showSubmenu) {
      onclickButtonSubmenu();
    }
  };
  return (
    <>
      {/**container Sidebar*/}
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-100 p-4 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        {/**Titulo de la Empresa*/}
        <h1 className="text-center text-2xl font-bold text-white xl:h-[7vh] h-[7vh] bg-secondary-900 rounded-lg">
          AKRON<span className="text-primary text-4xl">.</span>
        </h1>
        {/**SECCIONES*/}
        {secciones.map((seccion) => (
          <div key={seccion.id} className="mt-1">
            <ul>
              {/**LISTAADO DE SECCIONES*/}
              <li>
                {/**Boton para desplegar los items de las secciones*/}
                <button
                  id={seccion.id}
                  onClick={onClickSubMenu} //onclickButtonSubmenu es la función que recibo de Sidebar.jsx para poder mostrar el submenu
                  className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
                >
                  {/**  Id de las secciones */}
                  {/**  Iconos de las secciones */}
                  {/**  Titulo de las secciones */}
                  <h1 key={seccion.id} className="flex items-center gap-4">
                    {seccion.icon} {seccion.title}
                  </h1>
                  {/**  Icono de la flecha cuando se despliega el menu */}
                  <RiArrowRightSLine
                    className={`mt-1 ${
                      seccion.id === activeSection && "rotate-90"
                    } transition-all`}
                  />
                </button>
                {/** Listado de Items de las secciones */}
                <ul
                  className={` ${
                    seccion.id === activeSection ? "h-full" : "h-0"
                  } overflow-y-hidden transition-all`}
                >
                  {/** Items de las secciones */}
                  {seccion.items.map((item) => (
                    <li key={item.title}>
                      {/**  Path a donde te redirigen los items */}
                      <Link
                        to={item.path}
                        className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-white transition-colors"
                      >
                        {/**  Titulo de los items de las secciones */}
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        ))}
        {/**SBoton cerrar Sesion*/}
        <nav className="">
          <Link
            to="/"
            className="flex items-center gap-4 py-2 px-4 rounded-lg bg-secondary-900 hover:text-primary transition-colors"
          >
            <RiLogoutCircleRLine className="text-primary" /> Cerrar sesión
          </Link>
        </nav>
      </div>
    </>
  );
};

export default SidebarRoutes;
