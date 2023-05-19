import GetUsuarioId from "../CRUD/GetUsuarioId";
import store from "store2";

const GetPermisos = async (menu, setPermisos) => {
  if (store.session.get("usuario") == "AD") {
    if (
      menu == "BloquearCompra" ||
      menu == "BloquearVenta" ||
      menu == "BloquearMovimientoBancario"
    ) {
      setPermisos([false, true, false, false, false]);
      return true;
    }
    if (menu == "Correlativo") {
      setPermisos([true, true, false, true, false]);
      return true;
    }
    if (menu == "CuentaPorPagar" || menu == "CuentaPorCobrar") {
      setPermisos([true, false, true, true, true]);
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
    if (
      menu == "BloquearCompra" ||
      menu == "BloquearVenta" ||
      menu == "BloquearMovimientoBancario"
    ) {
      setPermisos([false, result.modificar, false, false, false]);
      return false;
    }
    if (menu == "Correlativo") {
      setPermisos([
        result.registrar,
        result.modificar,
        false,
        result.consultar,
        false,
      ]);
      return false;
    }
    if (menu == "Retencion") {
      setPermisos([
        result.registrar,
        false,
        result.eliminar,
        result.consultar,
        result.anular,
      ]);
      return false;
    }
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
