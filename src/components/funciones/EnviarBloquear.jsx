import ApiMasy from "../../api/ApiMasy";
import { toast } from "react-toastify";

const EnviarBloquear = async (menu, objeto, setEliminar) => {
  const result = await ApiMasy.put(
    `api/${menu[0]}/${menu[1]}/${menu[2]}`,
    objeto
  );
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
  } else {
    toast.success(result.data.messages[0].textos[0], {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setEliminar(true);
  }
  return result;
};

export default EnviarBloquear;
