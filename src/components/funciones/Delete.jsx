import ApiMasy from "../../api/ApiMasy";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const Delete = async (menu, id, setListar) => {
  Swal.fire({
    title: "Eliminar registro",
    icon: "warning",
    iconColor: "#F7BF3A",
    showCancelButton: true,
    color: "#fff",
    background: "#171B23",
    confirmButtonColor: "#3B8407",
    confirmButtonText: "Confirmar",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const result = await ApiMasy.delete(`api/${menu}/${id}`);
      if (result.tipo == 1) {
        result.textos.map((map) => {
          toast.error(map, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
        return null;
      } else {
        result.data.messages[0].textos.map((map) => {
          toast.success(map, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
        setListar(true);
        return result;
      }
    }
  });
};

export default Delete;
