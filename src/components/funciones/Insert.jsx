import ApiMasy from "../../api/ApiMasy";

const Insert = async (menu, objeto, setTipoMensaje, setMensaje) => {
  const result = await ApiMasy.post(`api/${menu}`, objeto);
  if (result.tipo == 1) {
    setTipoMensaje(result.tipo);
    setMensaje(result.textos);
    return null;
  } else {
    setTipoMensaje(result.data.messages[0].tipo);
    setMensaje(result.data.messages[0].textos);
    return result;
  }
};

export default Insert;
