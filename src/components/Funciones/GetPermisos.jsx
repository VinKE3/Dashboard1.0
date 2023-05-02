import GetUsuarioId from "../CRUD/GetUsuarioId";
import store from "store2";

const GetPermisos = async (menu, setPermisos) => {
  if (store.session.get("usuario") == "AD") {
    if (menu == "BloquearCompra") {
      setPermisos([false, true, false, false, false]);
    }else{
      setPermisos([true, true, true, true, true]);
    }
    return true;
  } else {
    const result = await GetUsuarioId(store.session.get("usuarioId"), menu);
    setPermisos([
      result.registrar,
      result.modificar,
      result.eliminar,
      result.consultar,
      result.anular,
    ]);
    return false;
  }
};

export default GetPermisos;
