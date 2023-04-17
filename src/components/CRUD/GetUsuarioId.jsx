import ApiMasy from "../../api/ApiMasy";

const GetUsuarioId = async (usuarioId, menuId) => {
  const result2 = await ApiMasy.get(
    `api/Mantenimiento/UsuarioPermiso/GetPorUsuarioYMenu?usuarioId=${usuarioId}&menuId=${menuId}`
  );
  console.log(result2.data.data);
  return result2.data.data;
};

export default GetUsuarioId;
