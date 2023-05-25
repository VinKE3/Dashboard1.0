import React, { useState, useEffect } from "react";
import Mensajes from "../Funciones/Mensajes";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Insert from "../Funciones/Insert";
import Update from "../Funciones/Update";
import * as Global from "../Global";

const ModalCrud = ({
  children,
  setModal,
  objeto,
  modo,
  menu,
  titulo,
  tamañoModal = [Global.ModalPequeño, Global.Form],
  cerrar = true,
}) => {
  //#region useState
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    RetornarMensaje();
  }, [tipoMensaje]);
  //#endregion

  //#region Funciones
  const RetornarMensaje = async () => {
    if (tipoMensaje == 0) {
      toast.success(mensaje, {
        position: "bottom-right",
        autoClose: 3000,
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
      <div className={Global.FondoModal}>
        <div className={tamañoModal[0]}>
          {/*content*/}
          <div id="modalCRUD" className={Global.ModalContent}>
            {/*header*/}
            <div className={Global.ModalHeader}>
              <h3 className={Global.TituloModal}>{modo + " " + titulo}</h3>
              {cerrar && (
                <button className={Global.CerrarModal} onClick={CerrarModal}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
            {/*header*/}

            {/*body*/}
            <div className={Global.ModalBody}>
              <div className={tamañoModal[1]}>
                {tipoMensaje > 0 && (
                  <Mensajes
                    tipoMensaje={tipoMensaje}
                    mensaje={mensaje}
                    Click={() => OcultarMensajes()}
                  />
                )}
                {children}
              </div>
            </div>
            {/*body*/}

            {/*footer*/}
            <div className={Global.ModalFooter}>
              {modo == "Consultar" ? (
                ""
              ) : (
                <button
                  className={Global.BotonModalBase + Global.BotonOkModal}
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
                className={Global.BotonModalBase + Global.BotonCancelarModal}
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
    </>
  );
  //#endregion
};

export default ModalCrud;
