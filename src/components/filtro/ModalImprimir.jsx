import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";
import { FaUndoAlt, FaCheck } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../Global";
import * as Funciones from "../funciones/Validaciones";


const ModalImprimir = ({ setModal, setObjeto, foco }) => {

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Artículos"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            <button
              type="button"
              onClick={() => setModal(false)}
              className={Global.BotonModalBase + Global.BotonCancelarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <>
          </>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default ModalImprimir;
