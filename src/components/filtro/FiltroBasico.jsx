import React from "react";
import { FaUndoAlt } from "react-icons/fa";
import * as Global from "../Global";
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
    <div className={Global.InputFull + " mb-2"}>
      <label htmlFor={name} className={Global.LabelStyle}>
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
        className={boton ? Global.InputBoton : Global.InputStyle}
      />
      {boton && (
        <button
          className={Global.BotonBuscar + Global.Anidado + Global.BotonPrimary}
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
