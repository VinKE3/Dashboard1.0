import React, { useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import Swal from "sweetalert2";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";

const BotonCRUD = ({
  mostrar,
  id,
  Click1,
  Click2,
  menu,
  setRespuestaAlert,
}) => {
  useEffect(() => {
    setRespuestaAlert(false);
  }, [setRespuestaAlert]);
  //#region Función Eliminar
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¡Los cambios no se podrán revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiMasy.delete(`api/Mantenimiento/${menu}/${id}`).then((response) => {
          if (response.status === 200) {
            setRespuestaAlert(true);
            Swal.fire("", String(response.data.messages[0].textos), "success");
          } else if (response.status === 404) {
            Swal.fire(
              "ERROR",
              String(response.data.messages[0].textos),
              "error"
            );
            setRespuestaAlert(false);
          } else {
            Swal.fire(
              "ERROR",
              String(response.data.messages[0].textos),
              "error"
            );
            setRespuestaAlert(false);
          }
        });
      }
    });
  };
  //#endregion

  //#region  Render
  return (
    <div className="flex item-center justify-center">
      {mostrar[0] ? (
        <div className="w-4 mr-2 scale-110 transform hover:text-blue-500 hover:scale-125">
          <button
            id="boton-consultar"
            onClick={Click1}
            className="p-0 px-1"
            title="Click para consultar registro"
          >
            <FaEye></FaEye>
          </button>
        </div>
      ) : (
        ""
      )}
      {mostrar[1] ? (
        <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-125">
          <button
            id="boton-modificar"
            onClick={Click2}
            className="p-0 px-1"
            title="Click para modificar registro"
          >
            <FaPen></FaPen>
          </button>
        </div>
      ) : (
        ""
      )}
      {mostrar[2] ? (
        <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-125">
          <button
            id="boton-eliminar"
            onClick={() => handleDelete(id)}
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
