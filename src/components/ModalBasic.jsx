import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "./Global";

const ModalBasic = ({
  children,
  childrenFooter,
  setModal,
  titulo,
  tamañoModal = [Global.ModalPequeño, Global.Form],
  cerrar = true,
}) => {

  //#region Funciones
  const CerrarModal = () => {
    setModal(false);
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className={Global.FondoModal}>
        <div className={tamañoModal[0]}>
          {/*content*/}
          <div className={Global.ModalContent}>
            {/*header*/}
            <div className={Global.ModalHeader}>
              <h3 className={Global.TituloModal}>{titulo}</h3>
              {cerrar && (
                <button className={Global.CerrarModal} onClick={CerrarModal}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
            {/*header*/}

            {/*body*/}
            <div className={Global.ModalBody}>
              <form className={tamañoModal[1]}>{children}</form>
            </div>
            {/*body*/}

            {/*footer*/}
            <div className={Global.ModalFooter}>{childrenFooter}</div>
            {/*footer*/}
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default ModalBasic;
