import { Link } from "react-router-dom";
import { useState } from "react";
//?Icons
import { RiLogoutCircleRLine, RiArrowRightSLine } from "react-icons/ri";
import { authHelper } from "../../helpers/AuthHelper";
const SidebarMenus = ({
  onclickButtonSubmenu,
  showSubmenu,
  showMenu,
  secciones,
  handleActiveSection,
  onClickShowMenu,
  activeSection,
}) => {
  const { borrarTodosLosTokens } = authHelper;
  const [activeItem, setActiveItem] = useState(null);
  const onClickSubMenu = (e) => {
    e.preventDefault();
    handleActiveSection(e.target.id);
    if (e.target.id === activeSection) {
      handleActiveSection("");
    }
    if (showSubmenu) {
      onclickButtonSubmenu();
    }
  };
  const onClickShowMenuHandle = (e) => {
    e.preventDefault();
    onClickShowMenu();
  };

  const handleLogout = () => {
    borrarTodosLosTokens();
    window.location.href = "/login";
  };

  return (
    <div
      className={`h-[100vh] overflow-y-scroll fixed xl:static w-full md:w-[50%] lg:w-[35%] xl:w-auto top-0 p-4 flex flex-col z-50 bg-secondary-100
       ${showMenu ? "left-0" : "-left-full"}
       transition-all`}
    >
      <div className="h-[8vh]  ">
        <h1 className="h-[6vh] text-center text-2xl font-bold text-ligth">
          <Link to={"/"}>
            CYKRON<span className="text-primary text-4xl">.</span>
          </Link>
        </h1>
      </div>
      <div className="h-[90vh] overflow-y-scroll">
        {secciones.map((seccion) => (
          <div key={seccion.id} enabled={seccion.enabled}>
            <ul>
              <li>
                <button
                  id={seccion.id}
                  onClick={onClickSubMenu}
                  className="w-full flex items-center py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors font-semibold md:font-normal text-lg md:text-base"
                >
                  <span
                    id={seccion.id}
                    className="flex flex-1 items-center gap-4"
                  >
                    {seccion.icon} {seccion.title}
                  </span>
                  <RiArrowRightSLine
                    id={seccion.id}
                    className={`mt-1 ${
                      seccion.id === activeSection && "rotate-90"
                    } transition-all`}
                  />
                </button>
                <ul
                  className={`${
                    seccion.id === activeSection ? "h-full" : "h-0"
                  } overflow-y-hidden `}
                  onClick={onClickShowMenuHandle}
                >
                  {seccion.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        to={item.path}
                        onMouseEnter={() => setActiveItem(item.title)}
                        className="py-2 px-4 border-l border-gray-500 ml-6 block relative text-white transition-colors"
                      >
                        {item.title}
                        <span
                          className={`before:border-secondary-100 hover:before:bg-primary before:w-3 before:h-3 before:absolute before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                            activeItem === item.title
                              ? "before:bg-primary"
                              : "before:border-secondary-100 hover:before:bg-primary"
                          }`}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 hover:text-primary transition-colors w-full"
        >
          <RiLogoutCircleRLine className="text-primary" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default SidebarMenus;
