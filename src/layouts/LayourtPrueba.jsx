import { BsArrowLeftCircle } from "react-icons/bs";
import { MdBusinessCenter } from "react-icons/md";
import { useState } from "react";
import seccionesPrueba from "../Components/SeccionesPrueba";

const LayourtPrueba = () => {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  return (
    <div className="flex">
      <div
        className={`bg-secondary-100 h-screen p-5 pt-8 ${
          open ? "w-72" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftCircle
          className={`absolute bg-white text-secondary-900 text-3xl rounded-full -right-3 top-9 border border-secondary-900 cursor-pointer ${
            open ? "transform rotate-180" : "transform rotate-0"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex">
          <MdBusinessCenter
            className={`text-primary text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
              open && "transform rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin left font-medium text-2xl duration-300 ${
              !open && "scale-0"
            }`}
          >
            Empresas
          </h1>
        </div>
        <ul className="pt-2">
          {seccionesPrueba.map((seccion, index) => (
            <>
              <li
                key={index}
                className=" text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-100 rounded-lg mt-2"
              >
                <span className="text-2xl block float-left">
                  {seccion.icon}
                </span>
                <span
                  className={`text-white font-medium flex-1 ${
                    !open && "hidden"
                  }`}
                >
                  {seccion.title}
                </span>
                {seccion.submenu && (
                  <BsArrowLeftCircle
                    className={`text-2xl ${submenuOpen && "rotate-180"}`}
                    onClick={() => {
                      setSubmenuOpen(!submenuOpen);
                    }}
                  />
                )}
              </li>
              {seccion.submenu && submenuOpen && open && (
                <ul>
                  {seccion.submenuItems.map((submenuItems, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-center gap-x-4 cursor-pointer p-2 px-7 hover:bg-gray-100 rounded-lg mt-2"
                    >
                      {submenuItems.title}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}
        </ul>
      </div>

      <div className="p-7">
        <h1 className="text-2x font-semibold">Home</h1>
      </div>
    </div>
  );
};

export default LayourtPrueba;
