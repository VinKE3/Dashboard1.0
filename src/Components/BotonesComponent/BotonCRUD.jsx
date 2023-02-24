import React from "react";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import ApiMasy from "../../api/ApiMasy";

const handleDelete = (id) => {
  console.log("Eliminar: " + id);
};

const BotonCRUD = ({ row }) => {
  return (
    <div className="flex item-center justify-center">
      <div className="w-4 mr-2 scale-110 transform hover:text-blue-500 hover:scale-125">
        <button
          id="boton-consultar"
          onClick={() => console.log("Consultar: " + row)}
          className="p-0 px-1"
        >
          <FaEye></FaEye>
        </button>
      </div>

      <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-125">
        <button
          id="boton-modificar"
          onClick={() => console.log("Modificar: " + row)}
          className="p-0 px-1"
        >
          <FaPen></FaPen>
        </button>
      </div>

      <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-125">
        <button
          id="boton-eliminar"
          onClick={() => handleDelete(row)}
          className="p-0 px-1"
        >
          <FaTrashAlt></FaTrashAlt>
        </button>
      </div>
    </div>
  );
};

export default BotonCRUD;
