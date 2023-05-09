import { toast } from "react-toastify";

const Mensajes = ({ tipo, mensaje,  tema = "colored", tiempoCierre = 3000, posicion = "bottom-right" }) => {

  //#region Render
  return (
    <>
      {toast.tipo(String(mensaje), {
        position: posicion,
        autoClose: tiempoCierre,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: tema,
      })}
    </>
  );
  //#endregion
};

export default Mensajes;
