import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Global from "../Global";
const BotonBasico = ({
  botonClass,
  botonIcon,
  botonText,
  click,
  containerClass = "sticky top-2 bg-black/30",
}) => {
  return (
    <div className={containerClass + "flex"}>
      <button onClick={click} className={Global.BotonBasico + botonClass}>
        <FontAwesomeIcon
          icon={botonIcon}
          size="1x"
          className="m-0 py-3 px-2.5 sm:pr-1 sm:py-.2.5"
        />
        <div className="w-full h-full sm:flex sm:items-center sm:justify-center hidden sm:pr-3 md:text-mini">
          <p>{botonText}</p>
        </div>
      </button>
    </div>
  );
};

export default BotonBasico;
