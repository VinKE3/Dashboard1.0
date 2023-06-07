import ApiMasy from "../../api/ApiMasy";
import { toast } from "react-toastify";

const Put = async (
  menu,
  setListar,
  objeto = null,
  mensaje = ["Consultado exitosamente"],
  refresca = true
) => {
  let result = null;
  if (objeto != null) {
    result = await ApiMasy.put(`api/${menu}`, objeto);
  } else {
    result = await ApiMasy.put(`api/${menu}`);
  }
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
    return result;
  } else {
    if (result.data.messages.lenght > 0) {
      mensaje = result.data.messages.map((map) => map.textos);
    }
    mensaje.map((map) => {
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
    if (refresca) {
      setListar(true);
    }
    return result;
  }
};

export default Put;
