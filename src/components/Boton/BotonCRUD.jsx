import React, { useEffect } from "react";
import Delete from "../Funciones/Delete";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../Global";

const BotonCRUD = ({
  setEliminar,
  permisos,
  menu = ["", ""],
  id = "",
  ClickConsultar,
  ClickModificar,
  ClickEliminar,
}) => {
  //#region useEffect
  useEffect(() => {
    setEliminar(false);
  }, [setEliminar]);
  //#endregion

  const ValidarEliminar = async () => {
    if (id != "") {
      Delete([menu[0], menu[1]], id, setEliminar);
    } else {
      ClickEliminar();
    }
  };

  //#region Render
  return (
    <div className="flex item-center justify-center">
      {permisos[3] ? (
        <div className={Global.TablaBotonConsultar}>
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
        <div className={Global.TablaBotonModificar}>
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
        <div className={Global.TablaBotonEliminar}>
          <button
            id="boton-eliminar"
            onClick={ValidarEliminar}
            className="p-0 px-1"
            title="Click para eliminar registro"
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
