import React, { useState, useEffect } from "react";
import Mensajes from "../funciones/Mensajes";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Insert from "../funciones/Insert";
import Update from "../funciones/Update";
import * as Global from "../Global";

const ModalCrud = ({
  children,
  setModal,
  objeto,
  modo,
  menu,
  titulo,
  cerrar = true,
  foco,
  tamañoModal = [Global.ModalPequeño, Global.Form],
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
  const Enviar = async (e) => {
    if (e.key == "Enter") {
      if (modo == "Nuevo") {
        Nuevo(e);
      } else {
        Modificar(e);
      }
    }
  };
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
      foco.focus();
      setModal(false);
    }
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  const CerrarModal = (e = null) => {
    if (e._reactName != "onClick") {
      if (e.key == "Escape") {
        if (modo != "Consultar") {
          Swal.fire({
            title: "Cerrar Formulario",
            text: "¿Desea cerrar el formulario?",
            icon: "warning",
            iconColor: "#F7BF3A",
            showCancelButton: true,
            color: "#fff",
            background: "#1a1a2e",
            confirmButtonColor: "#eea508",
            confirmButtonText: "Aceptar",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              foco.focus();
              setModal(false);
            }
          });
        } else {
          foco.focus();
          setModal(false);
        }
      }
    } else {
      foco.focus();
      setModal(false);
    }
  };
  //#endregion

  //#region Funciones API
  const Nuevo = async (e) => {
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
              <h3 className={Global.TituloModal}>
                {modo == "Nuevo" ? `Registrar ${titulo}` : `${modo} ${titulo}`}
              </h3>
              {cerrar && (
                <button className={Global.CerrarModal} onClick={CerrarModal}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
            {/*header*/}

            {/*body*/}
            <div className={Global.ModalBody} onKeyDown={(e) => CerrarModal(e)}>
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
                    modo == "Nuevo" ? (e) => Nuevo(e) : (e) => Modificar(e)
                  }
                  onKeyDown={(e) => Enviar(e)}
                >
                  {modo == "Nuevo" ? "Registrar" : "Guardar Cambios"}
                </button>
              )}
              <button
                className={Global.BotonModalBase + Global.BotonCancelarModal}
                type="button"
                autoFocus={modo == "Consultar"}
                onClick={CerrarModal}
                onKeyDown={(e) => CerrarModal(e)}
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
