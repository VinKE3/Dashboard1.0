import { toast } from "react-toastify";

//#region Funciones
export const RetornarMensaje = async () => {
  if (tipoMensaje == 0) {
    toast.success(mensaje, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setRespuestaModal(true);
    setModal(false);
  }
};
export const OcultarMensajes = (setMensaje, setTipoMensaje) => {
  setMensaje([]);
  setTipoMensaje(-1);
};
export const CerrarModal = () => {
  setRespuestaModal(false);
  setModal(false);
};
//#endregion
