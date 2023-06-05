import ApiMasy from "../../api/ApiMasy";
import { toast } from "react-toastify";

const GetIsPermitido = async (menu, accion, id) => {
  const result = await ApiMasy.get(
    `api/${menu}/IsPermitido?accion=${accion}&id=${id}`
  );
  if (result.tipo == 1) {
    res.textos.map((map) => {
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
    return false;
  }
  if (!result.data.data) {
    result.data.messages[0].textos.map((map) => {
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
    return false;
  } else {
    return true;
  }
};

export default GetIsPermitido;
