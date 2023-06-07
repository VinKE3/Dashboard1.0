import React, { useState, useEffect } from "react";
import Insert from "../funciones/Insert";
import Update from "../funciones/Update";
import Mensajes from "../funciones/Mensajes";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as G from "../Global";
import * as Funciones from "../funciones/Validaciones";

const ModalCrud = ({
  children,
  setModal,
  objeto,
  modo,
  menu,
  titulo,
  cerrar = true,
  id = "modalCRUD",
  foco,
  tamañoModal = [G.ModalPequeño, G.Form],
}) => {
  //#region useState
  const [tipo, setTipo] = useState(-1);
  const [mensajes, setMensajes] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    RetornarMensaje();
  }, [tipo]);
  //#endregion

  //#region Funciones
  const RetornarMensaje = async () => {
    if (tipo == 0) {
      toast.success(mensajes, {
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
  const CerrarModal = () => {
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
  };
  const ModalKey = (e) => {
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
  };
  //#endregion

  //#region Funciones API
  const Enviar = async () => {
    if (modo == "Nuevo") {
      await Insert(menu, objeto, setTipo, setMensajes);
    } else {
      await Update(menu, objeto, setTipo, setMensajes);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      <div tabIndex={0} onKeyDown={(e) => ModalKey(e)} className={G.FondoModal}>
        <div className={tamañoModal[0]}>
          {/*content*/}
          <div id={id} className={G.ModalContent}>
            {/*header*/}
            <div className={G.ModalHeader}>
              <h3 className={G.TituloModal}>
                {modo == "Nuevo" ? `Registrar ${titulo}` : `${modo} ${titulo}`}
              </h3>
              {cerrar && (
                <button className={G.CerrarModal} onClick={CerrarModal}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
            {/*header*/}

            {/*body*/}
            <div className={G.ModalBody}>
              <div className={tamañoModal[1]}>
                {tipo > 0 && (
                  <Mensajes
                    tipoMensaje={tipo}
                    mensaje={mensajes}
                    Click={() =>
                      Funciones.OcultarMensajes(setTipo, setMensajes)
                    }
                  />
                )}
                {children}
              </div>
            </div>
            {/*body*/}

            {/*footer*/}
            <div className={G.ModalFooter}>
              {modo == "Consultar" ? (
                ""
              ) : (
                <button
                  id="botonRegistrarModalCrud"
                  className={G.BotonModalBase + G.BotonOkModal}
                  type="button"
                  onClick={() => Enviar()}
                  onKeyDown={async (e) => {
                    if (e.key == "Enter") {
                      await Enviar();
                    }
                  }}
                >
                  {modo == "Nuevo" ? "Registrar" : "Guardar Cambios"}
                </button>
              )}
              <button
                type="button"
                autoFocus={modo == "Consultar"}
                onClick={CerrarModal}
                className={G.BotonModalBase + G.BotonCerrarModal}
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
