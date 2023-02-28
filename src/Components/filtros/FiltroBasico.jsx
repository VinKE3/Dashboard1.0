import React from "react";
import { FaSearch } from "react-icons/fa";
function FiltroBasico({
  textLabel,
  inputPlaceHolder,
  inputId,
  inputName,
  inputMax,
  botonId,
  FiltradoButton,
  /*filter,*/
  FiltradoKeyPress,
}) {
  return (
    <div className="flex mt-2 mb-2 rounded-1 border-gray-200 overflow-hidden text-sm">
      <label className="px-3 py-1 bg-gray-600">{textLabel}</label>

      <input
        type="text"
        className="flex-1 px-3 py-1 text-black"
        placeholder={inputPlaceHolder}
        id={inputId}
        name={inputName}
        maxLength={inputMax}
        //Para filtrar la tabla
        // value={filter}
        onChange={FiltradoKeyPress}
      />

      <button
        className="px-2 rounded-none bg-green-700 text-white hover:bg-green-500"
        id={botonId}
        onClick={FiltradoButton}
      >
        <FaSearch></FaSearch>
      </button>
    </div>
  );
}

export default FiltroBasico;
