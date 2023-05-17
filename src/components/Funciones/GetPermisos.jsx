import GetUsuarioId from "../CRUD/GetUsuarioId";
import store from "store2";

const GetPermisos = async (menu, setPermisos) => {
  if (store.session.get("usuario") == "AD") {
    if (menu == "BloquearCompra" || menu == "BloquearVenta" || menu == "BloquearMovimientoBancario") {
      setPermisos([false, true, false, false, false]);
      return true;
    }
    if (menu == "Correlativo") {
      setPermisos([true, true, true, false, false]);
      return true;
    }
    if (menu == "Retencion") {
      setPermisos([true, false, true, true, true]);
      return true;
    }

    setPermisos([true, true, true, true, true]);
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
