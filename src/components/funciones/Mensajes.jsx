import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Mensajes = ({ tipoMensaje, mensaje, cerrar = true, Click }) => {
  //#region Funcion cambiar fondo del mensaje
  const FondoColor = (tipoMensaje) => {
    if (tipoMensaje == 0) {
      return "bg-green-600/90 ";
    }
    if (tipoMensaje == 1) {
      return "bg-red-600/90 ";
    }
    if (tipoMensaje == 2) {
      return "bg-blue-600/80 ";
    }
    if (tipoMensaje == 3) {
      return "bg-yellow-600/70 ";
    }
  };
  //#endregion

  //#region Render
  return (
    <div className={"mb-3 p-4 rounded-md " + FondoColor(tipoMensaje)}>
      {cerrar && (
        <button
          className="p-1 ml-auto bg-transparent border-0 text-light float-right text-xl leading-none font-semibold outline-none focus:outline-none"
          onClick={Click}
        >
          <FontAwesomeIcon icon={faXmark} size="1x" />
        </button>
      )}
      <h3 className="font-bold text-white ">Mensaje:</h3>
      {mensaje.map((msj) => (
        <p key={msj} className="text-white">
          {" "}
          {`• ${msj}`}{" "}
        </p>
      ))}
    </div>
  );
  //#endregion
};

export default Mensajes;
