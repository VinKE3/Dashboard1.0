import React from "react";
import { FaSearch } from "react-icons/fa";
import * as Global from "../Global";
const FiltroBasico = ({
  textLabel,
  inputPlaceHolder,
  inputId,
  inputName,
  inputMax,
  botonId,
  FiltradoButton,
  FiltradoKeyPress,
}) => {
  return (
    <div className="flex mt-2 mb-2 rounded-1 border-gray-200 overflow-hidden md:text-sm">
      <label className={Global.LabelStyle}>{textLabel}</label>

      <input
        type="text"
        className={Global.InputBoton}
        autoComplete="off"
        spellCheck="false"
        placeholder={inputPlaceHolder}
        id={inputId}
        name={inputName}
        maxLength={inputMax}
        onChange={FiltradoKeyPress}
      />

      <button
        className={Global.BotonBuscar}
        id={botonId}
        onClick={FiltradoButton}
      >
        <FaSearch></FaSearch>
      </button>
    </div>
  );
};

export default FiltroBasico;
