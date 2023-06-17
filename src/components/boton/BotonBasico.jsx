import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import * as G from "../Global";

const BotonBasico = ({
  botonClass,
  botonIcon,
  botonText,
  autoFoco = false,
  click,
  KeyDown = (e) => {},
  sticky = "sticky top-2 bg-black/30 flex items-center",
  contenedor = "",
}) => {
  return (
    <div className={sticky + contenedor}>
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
