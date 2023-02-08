import React from "react";
import { Link } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";

const SidebarSalir = () => {
  return (
    <div>
      <Link
        className="flex items-center gap-2 py-2 px-4 text-white rounded-lg mb-4 hover:bg-secondary-900 transition-colors"
        to="/Ventas"
      >
        <FaBuilding className="text-primario" />
        Salir
      </Link>
    </div>
  );
};

export default SidebarSalir;
