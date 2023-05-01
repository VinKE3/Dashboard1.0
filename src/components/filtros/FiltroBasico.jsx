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
      <label className={Global.LabelStyle}>{textLabel}</label>
      <input
        type="text"
        id={name}
        name={name}
        maxLength={maxLength}
        autoComplete="off"
        spellCheck="false"
        placeholder={placeHolder}
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
