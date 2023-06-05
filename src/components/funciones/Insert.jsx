import ApiMasy from "../../api/ApiMasy";

const Insert = async (menu, objeto, setTipoMensaje, setMensaje) => {
  const result = await ApiMasy.post(`api/${menu[0]}/${menu[1]}`, objeto);
  if (result.tipo == 1) {
    setTipoMensaje(result.tipo);
    setMensaje(result.textos);
  } else {
    setTipoMensaje(result.data.messages[0].tipo);
    setMensaje(result.data.messages[0].textos[0]);
  }
};

export default Insert;
