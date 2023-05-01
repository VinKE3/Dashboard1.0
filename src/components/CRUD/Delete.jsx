import ApiMasy from "../../api/ApiMasy";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const Delete = async (menu, id, setRespuesta) => {
  setRespuesta(false);
  const result = Swal.fire({
    title: "Eliminar registro",
    icon: "warning",
    iconColor: "#F7BF3A",
    showCancelButton: true,
    color: "#fff",
    background: "#1a1a2e",
    confirmButtonColor: "#eea508",
    confirmButtonText: "Aceptar",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      ApiMasy.delete(`api/${menu[0]}/${menu[1]}/${id}`).then((response) => {
        if (response.name == "AxiosError") {
          let err = "";
          if (response.response.data == "") {
            err = response.message;
          } else {
            err = String(response.response.data.messages[0].textos);
          }
          toast.error(err, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setRespuesta(false);
        } else {
          setRespuesta(true);
          toast.success(String(response.data.messages[0].textos), {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      });
    }
  });
  return result;
};

export default Delete;
