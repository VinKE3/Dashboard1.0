import React, { useEffect } from "react";
import Delete from "../funciones/Delete";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import * as G from "../Global";

const BotonCRUD = ({
  setListar,
  permisos,
  menu = "",
  id = "",
  ClickConsultar,
  ClickModificar,
  ClickEliminar,
}) => {
  //#region useEffect
  useEffect(() => {
    setListar(false);
  }, [setListar]);
  //#endregion

  const ValidarEliminar = async () => {
    if (id != "") {
      await Delete(menu, id, setListar);
    } else {
      ClickEliminar();
    }
  };

  //#region Render
  return (
    <div className="flex item-center justify-center">
      {permisos[3] ? (
        <div className={G.TablaBotonConsultar}>
          <button
            id="boton-consultar"
            onClick={ClickConsultar}
            className="p-0 px-1"
            title="Click para consultar registro"
          >
            <FaEye></FaEye>
          </button>
        </div>
      ) : (
        ""
      )}
      {permisos[1] ? (
        <div className={G.TablaBotonModificar}>
          <button
            id="boton-modificar"
            onClick={ClickModificar}
            className="p-0 px-1"
            title="Click para modificar registro"
          >
            <FaPen></FaPen>
          </button>
        </div>
      ) : (
        ""
      )}
      {permisos[2] ? (
        <div className={G.TablaBotonEliminar}>
          <button
            id="botonEliminarFila"
            onClick={ValidarEliminar}
            className="p-0 px-1"
            title="Click para Eliminar registro"
          >
            <FaTrashAlt></FaTrashAlt>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  //#endregion
};

export default BotonCRUD;
