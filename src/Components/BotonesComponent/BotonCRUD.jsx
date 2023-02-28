import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";

const handleDelete = (id) => {
  console.log("Eliminar: " + id);
};

const BotonCRUD = ({ id, mostrar }) => {
  return (
    <div className="flex item-center justify-center">
      {mostrar[0] ? (
        <div className="w-4 mr-2 scale-110 transform hover:text-blue-500 hover:scale-125">
          <button
            id="boton-consultar"
            onClick={() => console.log("Consultar: " + id)}
            className="p-0 px-1"
            title="Click para consultar registro"
          >
            <FaEye></FaEye>
          </button>
        </div>
      ) : (
        ""
      )}
      {mostrar[1] ? (
        <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-125">
          <button
            id="boton-modificar"
            onClick={() => console.log("Modificar: " + id)}
            className="p-0 px-1"
            title="Click para modificar registro"
          >
            <FaPen></FaPen>
          </button>
        </div>
      ) : (
        ""
      )}
      {mostrar[2] ? (
        <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-125">
          <button
            id="boton-eliminar"
            onClick={() => handleDelete(id)}
            className="p-0 px-1"
            title="Click para eliminar registro"
          >
            <FaTrashAlt></FaTrashAlt>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default BotonCRUD;
