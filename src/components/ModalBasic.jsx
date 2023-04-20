import React, { useState, useEffect } from "react";
import Mensajes from "./Mensajes";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "./Global";
import Insert from "./CRUD/Insert";
import Update from "./CRUD/Update";

const ModalBasic = ({
  children,
  setModal,
  objeto,
  modo,
  menu,
  titulo,
  tamañoModal = [Global.ModalPequeño, Global.FormSimple],
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
      setModal(false);
    }
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  const CerrarModal = () => {
    setModal(false);
  };
  //#endregion

  //#region Funciones API
  const Registrar = async (e) => {
    e.preventDefault();
    await Insert(menu, objeto, setTipoMensaje, setMensaje);
  };
  const Modificar = async (e) => {
    e.preventDefault();
    await Update(menu, objeto, setTipoMensaje, setMensaje);
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-900/50">
        <div className={tamañoModal[0]}>
          {/*content*/}
          <div className="border-none rounded-lg shadow-lg relative flex flex-col w-full h-full outline-none focus:outline-none bg-gradient-to-b from-gray-900 to-gray-800">
            {/*header*/}
            <div className="flex pt-4 pb-0 px-4 rounded-tt">
              <h3 className="text-3xl md:text-2xl font-semibold text-light">
                {modo + " " + titulo}
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
            <div className="overflow-y-auto relative flex-auto">
              <form className={tamañoModal[1]}>
                {tipoMensaje > 0 && (
                  <Mensajes
                    tipoMensaje={tipoMensaje}
                    mensaje={mensaje}
                    Click={() => OcultarMensajes()}
                  />
                )}
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
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
  //#endregion
};

export default ModalBasic;
