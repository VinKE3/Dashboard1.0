import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Global from "../Global";
const BotonBasico = ({ botonClass, botonIcon, botonText, click }) => {
  return (
    <button onClick={click} className={Global.BotonBasic + botonClass}>
      <FontAwesomeIcon
        icon={botonIcon}
        size="sm"
        className="m-0 sm:pt-1 sm:pr-1 sm:pl-0"
      />
      <span className="hidden sm:block md:text-sm">{botonText}</span>
    </button>
  );
};

export default BotonBasico;
