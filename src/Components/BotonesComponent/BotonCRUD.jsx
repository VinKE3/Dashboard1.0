import React, { useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import Swal from "sweetalert2";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BotonCRUD = ({
  setRespuestaAlert,
  permisos,
  menu,
  id,
  ClickConsultar,
  ClickModificar,
}) => {
  //#region useEffect
  useEffect(() => {
    setRespuestaAlert(false);
  }, [setRespuestaAlert]);
  //#endregion

  //#region Función Eliminar
  const Eliminar = async (id) => {
    Swal.fire({
      title: "Eliminar registro",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1E1F25",
      confirmButtonColor: "#EE8100",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiMasy.delete(`api/${menu[0]}/${menu[1]}/${id}`).then((response) => {
          if (response.name == "AxiosError") {
            let err = "";
            if (response.response.data == "") {
              err = response.message;
            } else {
              err = String(response.response.data.messages[0].textos);
            }
            toast.error(err, {
              position: "bottom-right",
              autoClose: 7000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setRespuestaAlert(false);
          } else {
            setRespuestaAlert(true);
            toast.success(String(response.data.messages[0].textos), {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        });
      }
    });
  };
  //#endregion

  //#region Render
  return (
    <div className="flex item-center justify-center">
      {permisos[1] ? (
        <div className="w-4 mr-2 scale-110 transform hover:text-green-500 hover:scale-125">
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
      {permisos[2] ? (
        <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-125">
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
      {permisos[3] ? (
        <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-125">
          <button
            id="boton-eliminar"
            onClick={() => Eliminar(id)}
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
