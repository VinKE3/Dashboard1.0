import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as G from "../Global";
const BotonBasico = ({
  botonClass,
  botonIcon,
  botonText,
  autoFoco = false,
  click,
  KeyDown = (e) => {},
  contenedor = "sticky top-2 bg-black/30",
}) => {
  return (
    <div className={contenedor + "flex"}>
      <button
        onClick={click}
        autoFocus={autoFoco}
        className={G.BotonBasico + botonClass}
        onKeyDown={(e) => KeyDown(e)}
      >
        <FontAwesomeIcon
          icon={botonIcon}
          size="1x"
          className="m-0 py-3 px-2.5 sm:pr-1 sm:py-.2.5"
        />
        <div className={G.BotonTexto}>
          <p>{botonText}</p>
        </div>
      </button>
    </div>
  );
};

export default BotonBasico;
