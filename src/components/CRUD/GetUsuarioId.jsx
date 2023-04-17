import ApiMasy from "../../api/ApiMasy";

const GetUsuarioId = async (nick, menuId) => {
  console.log(nick);
  const result = await ApiMasy.get(
    `api/Mantenimiento/Usuario/Listar?nick=${nick}`
  );
  console.log(result.data.data.data[0].id);
  const result2 = await ApiMasy.get(
    `api/Mantenimiento/UsuarioPermiso/GetPorUsuarioYMenu?usuarioId=${result.data.data.data[0].id}&menuId=${menuId}`
  );
  console.log(result2.data.data);
  return result2.data.data;
};

export default GetUsuarioId;
