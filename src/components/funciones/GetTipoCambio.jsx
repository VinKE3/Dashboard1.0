import ApiMasy from "../../api/ApiMasy";
import moment from "moment";
import { toast } from "react-toastify";

const GetTipoCambio = async (fecha, tipo, setTipoMensaje, setMensaje) => {
  const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${fecha}`);
  if (result.tipo == 1) {
    setTipoMensaje(result.tipo);
    setMensaje(result.textos);
    return 0;
  } else {
    setTipoMensaje(-1);
    setMensaje([]);
    let cambio = 0;
    if (tipo == "venta") {
      cambio = result.data.data.precioVenta;
    } else {
      cambio = result.data.data.precioCompra;
    }
    const titulo = `El tipo de cambio del día ${moment(fecha).format(
      "DD/MM/YYYY"
    )} es ${cambio}`;

    toast.info(titulo, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      toastId: "toastTipoCambio",
    });
    return cambio;
  }
};

export default GetTipoCambio;
