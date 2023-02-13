import { Link } from "react-router-dom";
// Icons
import { RiLogoutCircleRLine, RiArrowRightSLine } from "react-icons/ri";
const SidebarRoutes = ({
  onclickButtonSubmenu,
  showSubmenu,
  showMenu,
  secciones,
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
    // if (showSubmenu) {
    //   onclickButtonSubmenu();
    // }
  };
  return (
    <>
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-100 p-4 flex flex-col z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        <h1 className="text-center text-2xl font-bold text-white h-[7vh] xl:h-[50vh] bg-secondary-900 rounded-lg">
          <Link to={"/"}>
            AKRON<span className="text-primary text-4xl">.</span>
          </Link>
        </h1>

        {secciones.map((seccion) => (
          <div key={seccion.id} className="mt-1 xl:h-[80vh]">
            <ul>
              <li>
                <button
                  id={seccion.id}
                  onClick={onClickSubMenu}
                  className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
                >
                  <h1 id={seccion.id} className="flex items-center gap-4">
                    {seccion.icon} {seccion.title}
                  </h1>
                  <RiArrowRightSLine
                    id={seccion.id}
                    className={`mt-1 ${
                      seccion.id === activeSection && "rotate-90"
                    } transition-all`}
                  />
                </button>
                <ul
                  className={` ${
                    seccion.id === activeSection ? "h-full" : "h-0"
                  } overflow-y-hidden `}
                >
                  {seccion.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        to={item.path}
                        className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-white transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        ))}
        <nav className="xl:h-[10vh]">
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
