import React from "react";
import { Link } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";

const SidebarRoutes = () => {
  return (
    <>
      {/**Agregar Props y children */}
      <div>
        <h1 className="uppercase text-center text-xl font-bold mb-10">
          cikron <span className="text-primario text-4xl font-bold">.</span>
        </h1>
        <ul>
          <li>
            <Link
              className="flex items-center gap-3 py-2 px-4 text-white rounded-lg mb-4 hover:bg-secondary-900 transition-colors"
              to="/Ventas"
            >
              <FaBuilding className="text-primario" />
              Ventas
              <RiArrowDownSLine className="text-primario" />
            </Link>
            <ul></ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarRoutes;
