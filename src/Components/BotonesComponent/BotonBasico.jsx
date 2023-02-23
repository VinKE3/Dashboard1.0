import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "../../styles/Components/BotonCRUD.css";

const BotonBasico = ({ botonClass, botonIcon, botonText, click }) => {
  return (
    <button
      onClick={click}
      className={"py-2 px-2 flex rounded-1 transition " + botonClass}
    >
      <FontAwesomeIcon icon={botonIcon} size="sm" className="sm:pt-1 sm:pr-1" />
      <span className="hidden sm:block text-base sm:text-sm">{botonText}</span>
    </button>
  );
};

export default BotonBasico;
