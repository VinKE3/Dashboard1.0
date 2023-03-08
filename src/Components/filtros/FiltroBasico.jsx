import React from "react";
import { FaSearch } from "react-icons/fa";

const FiltroBasico = ({
  textLabel,
  inputPlaceHolder,
  inputId,
  inputName,
  inputMax,
  botonId,
  FiltradoButton,
  /*filter,*/
  FiltradoKeyPress,
}) => {
  return (
    <div className="flex mt-2 mb-2 rounded-1 border-gray-200 overflow-hidden md:text-sm">
      <label className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold">
        {textLabel}
      </label>

      <input
        type="text"
        className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full  border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-light dark:focus:ring-blue-500 dark:focus:border-blue-500"
        autoComplete="off"
        spellCheck="false"
        placeholder={inputPlaceHolder}
        id={inputId}
        name={inputName}
        maxLength={inputMax}
        // defaultValue={filter} //Filtro local
        onChange={FiltradoKeyPress}
      />

      <button
        className="px-3 rounded-none rounded-r-lg bg-yellow-500 text-light hover:bg-yellow-600"
        id={botonId}
        onClick={FiltradoButton}
      >
        <FaSearch></FaSearch>
      </button>
    </div>
  );
};

export default FiltroBasico;
