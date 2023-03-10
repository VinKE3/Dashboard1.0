import React, { useState, useEffect } from "react";
import ApiMasy from "../api/ApiMasy";
import Mensajes from "./Mensajes";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "./Global";

const ModalBasic = ({
  children,
  setModal,
  setRespuestaModal,
  objeto,
  modo,
  menu,
}) => {
  //#region useState
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    mensaje;
  }, [mensaje]);
  useEffect(() => {
    tipoMensaje;
    RetornarMensaje();
  }, [tipoMensaje]);
  useEffect(() => {
    objeto;
  }, [objeto]);
  //#endregion

  //#region Funciones
  const RetornarMensaje = async () => {
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
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  const CerrarModal = () => {
    setRespuestaModal(false);
    setModal(false);
  };
  //#endregion

  //#region Funciones API
  const Registrar = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.post(`api/${menu[0]}/${menu[1]}`, objeto);
    if (result.name == "AxiosError") {
      setTipoMensaje(result.response.data.messages[0].tipo);
      setMensaje(result.response.data.messages[0].textos);
    } else {
      setTipoMensaje(result.data.messages[0].tipo);
      setMensaje(result.data.messages[0].textos[0]);
    }
  };
  const Modificar = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.put(`api/${menu[0]}/${menu[1]}`, objeto);
    if (result.name == "AxiosError") {
      setTipoMensaje(result.response.data.messages[0].tipo);
      setMensaje(result.response.data.messages[0].textos);
    } else {
      setTipoMensaje(result.data.messages[0].tipo);
      setMensaje(result.data.messages[0].textos[0]);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative h-full w-full md:h-auto my-0 md:my-5 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-secondary-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex py-3 px-5 border-b rounded-t border-light">
              <h3 className="text-3xl md:text-2xl font-semibold text-light">
                {modo}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 hover:text-red-500 text-light float-right text-3xl md:text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={CerrarModal}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            {/*header*/}

            {/*body*/}
            <div className="relative flex-auto">
              {tipoMensaje > 0 && (
                <Mensajes
                  tipoMensaje={tipoMensaje}
                  mensaje={mensaje}
                  Click={() => OcultarMensajes()}
                />
              )}
              <form className="min-w-fit py-6 px-8">
                <div className="flex flex-col gap-3">{children}</div>
              </form>
            </div>
            {/*body*/}

            {/*footer*/}
            <div className="flex items-center justify-end py-3 px-5 border-t rounded-b border-light">
              {modo == "Consultar" ? (
                ""
              ) : (
                <button
                  className={Global.BotonOkModal}
                  type="button"
                  onClick={
                    modo == "Registrar"
                      ? (e) => Registrar(e)
                      : (e) => Modificar(e)
                  }
                >
                  {modo == "Registrar" ? "Registrar" : "Guardar Cambios"}
                </button>
              )}
              <button
                className={Global.BotonCancelarModal}
                type="button"
                onClick={CerrarModal}
              >
                CERRAR
              </button>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
  //#endregion
};

export default ModalBasic;
