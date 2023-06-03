import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../Global";

const ModalBasic = ({
  children,
  childrenFooter,
  setModal,
  titulo,
  cerrar = true,
  tamañoModal = [G.ModalPequeño, G.Form],
}) => {
  //#region Funciones
  const CerrarModal = () => {
    setModal(false);
  };

  //#endregion

  //#region Render
  return (
    <>
      <div className={G.FondoModal}>
        <div className={tamañoModal[0]}>
          {/*content*/}
          <div id="modalBasic" className={G.ModalContent}>
            {/*header*/}
            <div className={G.ModalHeader}>
              <h3 className={G.TituloModal}>{titulo}</h3>
              {cerrar && (
                <button className={G.CerrarModal} onClick={CerrarModal}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
            {/*header*/}

            {/*body*/}
            <div className={G.ModalBody}>
              <div className={tamañoModal[1]}>{children}</div>
            </div>
            {/*body*/}

            {/*footer*/}
            <div className={G.ModalFooter}>{childrenFooter}</div>
            {/*footer*/}
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default ModalBasic;
