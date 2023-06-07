import Api from "../../api/Api";
import ApiMasy from "../../api/ApiMasy";
import { toast } from "react-toastify";

const Imprimir = async (menu, id) => {
  const result = await Api.get(`api/${menu[0]}/${menu[1]}/Imprimir/${id}`);
  console.log(result)
  if (result.name == "AxiosError") {
    const res = await ApiMasy.get(`api/${menu[0]}/${menu[1]}/Imprimir/${id}`);
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
    return null;
  } else {
    return result;
  }
};

export default Imprimir;
