import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Mensajes = ({ tipoMensaje, mensaje, cerrar = true, Click }) => {
  //#region Funcion cambiar fondo del mensaje
  const FondoColor = (tipoMensaje) => {
    if (tipoMensaje == 1) {
      return "mb-3 p-4 bg-red-600 text-white rounded-md";
    }
    if (tipoMensaje == 2) {
      return "mb-3 p-4 bg-blue-600 text-white rounded-md";
    }
    if (tipoMensaje == 3) {
      return "mb-3 p-4 bg-yellow-600 text-white rounded-md";
    }
  };
  //#endregion

  //#region Render
  return (
    <div className={FondoColor(tipoMensaje)}>
      {cerrar && (
        <button
          className="p-1 ml-auto bg-transparent border-0 text-light float-right text-xl leading-none font-semibold outline-none focus:outline-none"
          onClick={Click}
        >
          <FontAwesomeIcon icon={faXmark} size="1x" />
        </button>
      )}
      <h3 className="font-bold">Mensaje:</h3>
      {mensaje.map((msj) => (
        <p key={msj}> {`• ${msj}`} </p>
      ))}
    </div>
  );
  //#endregion
};

export default Mensajes;
