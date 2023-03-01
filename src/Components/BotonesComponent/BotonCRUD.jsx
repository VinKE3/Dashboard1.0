import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import ApiMasy from "../../api/ApiMasy";
import Swal from "sweetalert2";

const BotonCRUD = ({ id, mostrar, menu, Click1, Click2 }) => {
  const handleDelete = async (id) => {
    // const response = await ApiMasy.delete(`api/Mantenimiento/Linea/${id}`);
    Swal.fire({
      title: "Esta seguro?",
      text: "Los cambios no se podran revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiMasy.delete(`api/Mantenimiento/${menu}/${id}`).then((response) => {
          if (response.status === 200) {
            Swal.fire("Eliminado!", "Se elimino correctamente.", "success");
          } else if (response.status === 404) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          } else {
            Swal.fire("Error!", "No se pudo eliminar.", "error");
          }
        });
      }
    });
  };

  return (
    <div className="flex item-center justify-center">
      {mostrar[0] ? (
        <div className="w-4 mr-2 scale-110 transform hover:text-blue-500 hover:scale-125">
          <button
            id="boton-consultar"
            className="p-0 px-1"
            title="Click para consultar registro"
            onClick={Click1}
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
            onClick={Click2}
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
