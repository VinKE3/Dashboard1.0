import React from "react";
import { GiAutoRepair } from "react-icons/gi";

const SidebarSecciones = () => {
  const seccion = {
    tituloSec: "Mantenimiento",
    id: "mantenimiento",
    iconoSec: <GiAutoRepair className="text-primary" />,
    subsecciones: [
      { tituloSubsec: "Tipos de Cambio", id: "tipos-de-cambio" },
      { tituloSubsec: "Lineas", id: "lineas" },
      { tituloSubsec: "Sublineas", id: "sublineas" },
    ],
  };
};

export default SidebarSecciones;
