import React from "react";
import BotonCrud from "./BotonCrud";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faInfo,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const BarraBotonesCrud = () => {
  return (
    <div className="d-flex py-2">
      <BotonCrud
        botonText="Registrar"
        botonClass="hover:text-blue-500"
        botonIconClass=""
        botonIcon={faPlus}
      />
      {/* <BotonCRUD
        botonText="Modificar"
        botonClass="boton-crud-modificar"
        botonIconClass=""
        botonIcon={faPenToSquare}
      />
      <BotonCRUD
        botonText="Eliminar"
        botonClass="boton-crud-eliminar"
        botonIconClass=""
        botonIcon={faTrash}
      />
      <BotonCRUD
        botonText="Consultar"
        botonClass="boton-crud-consultar"
        botonIconClass="w-2"
        botonIcon={faInfo}
      /> */}
      {/* <BotonCRUD
        botonText="Refrescar"
        botonClass="boton-crud-refrescar"
        botonIconClass=""
        botonIcon={faRotateRight}
      /> */}
    </div>
  );
};

export default BarraBotonesCrud;
