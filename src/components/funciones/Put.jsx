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
    setEliminar(true);
  }
};

export default Put;
