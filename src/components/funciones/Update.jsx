import ApiMasy from "../../api/ApiMasy";

const Update = async (menu, objeto, setTipoMensaje, setMensaje) => {
  const result = await ApiMasy.put(`api/${menu}`, objeto);
  if (result.tipo == 1) {
    setTipoMensaje(result.tipo);
    setMensaje(result.textos);
  } else {
    console.log(result.data.messages);
    setTipoMensaje(result.data.messages[0].tipo);
    setMensaje(result.data.messages[0].textos);
  }
};

export default Update;
