import store from "store2";
import Get from "./Get";

const GetPermisos = async (menu, setPermisos) => {
  //Usuario AD
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
      setPermisos([true, false, false, true, true]);
      return true;
    }
    if (menu == "Retencion") {
      setPermisos([true, false, true, true, true]);
      return true;
    }
    if (menu == "MovimientoArticulo") {
      setPermisos([false, false, false, true, false]);
      return true;
    }
    setPermisos([true, true, true, true, true]);
    return true;
  } else {
    //Resto de usuarios
    const res = await Get(
      `Mantenimiento/UsuarioPermiso/GetPorUsuarioYMenu?usuarioId=${store.session.get(
        "usuarioId"
      )}&menuId=${menu} `
    );
    if (
      menu == "BloquearCompra" ||
      menu == "BloquearVenta" ||
      menu == "BloquearMovimientoBancario"
    ) {
      setPermisos([false, res.modificar, false, false, false]);
      return false;
    }
    if (menu == "Correlativo") {
      setPermisos([res.registrar, res.modificar, false, res.consultar, false]);
      return false;
    }
    if (menu == "Retencion") {
      setPermisos([
        res.registrar,
        false,
        res.eliminar,
        res.consultar,
        res.anular,
      ]);
      return false;
    }

    setPermisos([
      res.registrar,
      res.modificar,
      res.eliminar,
      res.consultar,
      res.anular,
    ]);
    return false;
  }
};

export default GetPermisos;
