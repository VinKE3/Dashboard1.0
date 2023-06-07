import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import * as G from "../Global";

const ModalBasic = ({
  id = "modalBasic",
  setModal,
  children,
  childrenFooter,
  titulo,
  cabecera = true,
  cerrar = true,
  habilitarFoco = true,
  foco,
  tamañoModal = [G.ModalPequeño, G.Form],
}) => {
  //#region Funciones
  const CerrarModal = () => {
    setModal(false);
  };
  const ModalKey = (e) => {
    if (e.key == "Escape") {
      if (habilitarFoco) {
        foco.focus();
      }
      setModal(false);
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
            {cabecera && (
              <div className={G.ModalHeader}>
                <h3 className={G.TituloModal}>{titulo}</h3>
                {cerrar && (
                  <button className={G.CerrarModal} onClick={CerrarModal}>
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </button>
                )}
              </div>
            )}
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
