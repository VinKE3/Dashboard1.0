import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/botonCRUD.css";

const BotonBasico = ({ botonClass, botonIcon, botonText, click }) => {
  return (
    <button
      onClick={click}
      className={
        "flex bg-gray-700 hover:bg-primary hover:text-black text-gray-100 font-bold text-sm px-5 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 uppercase " +
        botonClass
      }
    >
      <FontAwesomeIcon icon={botonIcon} size="sm" className="sm:pt-1 sm:pr-1" />
      <span className="hidden sm:block text-base sm:text-sm">{botonText}</span>
    </button>
  );
};

export default BotonBasico;
