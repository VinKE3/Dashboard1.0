import React from "react";
import { FaSearch } from "react-icons/fa";
import * as Global from "../../components/Global";
const FiltroBasico = ({
  textLabel,
  value,
  name,
  placeHolder,
  maxLength,
  onChange,
  botonId,
  onClick,
}) => {
  return (
    <div className={Global.InputFull  + " mb-2"}>
      <label htmlFor={name} className={Global.LabelStyle}>{textLabel}</label>
      <input
        type="text"
        id={name}
        name={name}
        maxLength={maxLength}
        spellCheck="false"
        placeholder={placeHolder}
        autoComplete="off"
        autoFocus
        value = {value ?? ""}
        onChange={onChange}
        className={Global.InputBoton}
      />
      <button
        className={Global.BotonBuscar + Global.Anidado + Global.BotonPrimary}
        id={botonId}
        onClick={onClick}
      >
        <FaSearch></FaSearch>
      </button>
    </div>
  );
};

export default FiltroBasico;
