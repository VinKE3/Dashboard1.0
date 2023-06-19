import { toast } from "react-toastify";
import ApiMasy from "../../api/ApiMasy";

const Get = async (menu, mensaje = "Consultado Exitosamente") => {
  const result = await ApiMasy.get(`api/${menu}`);
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
  } else {
    toast.info(mensaje, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    return result.data.data;
  }
};

export default Get;
