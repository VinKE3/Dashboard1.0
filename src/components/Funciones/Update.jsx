import ApiMasy from "../../api/ApiMasy";

const Update = async (menu, objeto, setTipoMensaje, setMensaje) => {
  const result = await ApiMasy.put(`api/${menu[0]}/${menu[1]}`, objeto);
  if (result.name == "AxiosError") {
    if (Object.entries(result.response.data).length > 0) {
      setTipoMensaje(result.response.data.messages[0].tipo);
      setMensaje(result.response.data.messages[0].textos);
    } else {
      setTipoMensaje(1);
      setMensaje([result.message]);
    }
  } else {
    setTipoMensaje(result.data.messages[0].tipo);
    setMensaje(result.data.messages[0].textos[0]);
  }
  return result;
};

export default Update;
