import React from "react";
import { FaUndoAlt } from "react-icons/fa";
import * as G from "../Global";

const FiltroBasico = ({
  textLabel,
  value,
  name,
  placeHolder,
  maxLength,
  onChange,
  boton = true,
  botonId,
  onClick,
}) => {
  return (
    <div className={G.InputFull + " mb-2"}>
      <label htmlFor={name} className={G.LabelStyle}>
        {textLabel}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        maxLength={maxLength}
        spellCheck="false"
        placeholder={placeHolder}
        autoComplete="off"
        autoFocus
        value={value ?? ""}
        onChange={onChange}
        className={boton ? G.InputBoton : G.InputStyle}
      />
      {boton && (
        <button
          className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
          id={botonId}
          onClick={onClick}
        >
          <FaUndoAlt></FaUndoAlt>
        </button>
      )}
    </div>
  );
};

export default FiltroBasico;
