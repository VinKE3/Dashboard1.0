import ApiMasy from "../../api/ApiMasy";
import { toast } from "react-toastify";

const Put = async (menu, setEliminar, objeto = null) => {
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
    console.log(result);
    let textos = ["Consultado exitosamente"];
    console.log(result.data.messages);
    if (result.data.messages.lenght > 0) {
      textos = result.data.messages.map((map) => map.textos);
    }
    console.log(textos);
    textos.map((map) => {
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
    setEliminar(true);
    return result;
  }
};

export default Put;
