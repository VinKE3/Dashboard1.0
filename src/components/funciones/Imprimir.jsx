import Api from "../../api/Api";
import { toast } from "react-toastify";
const Imprimir = async (menu, id) => {
  const result = await Api.get(`api/${menu[0]}/${menu[1]}/Imprimir/${id}`);
  if (result.name == "AxiosError") {
    let error = "";
    //Captura el mensaje de error
    if (Object.entries(result.response.data).length > 0) {
      error = String(result.response.data.messages[0].textos);
    } else {
      error = String(result.message);
    }
    //Captura el mensaje de error

    toast.error(error, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    return null;
  } else {
    return result;
  }
};

export default Imprimir;
