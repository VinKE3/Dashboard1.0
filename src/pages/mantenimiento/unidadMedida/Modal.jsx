import React, { useState } from "react";
import * as G from "../../../components/Global";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funcions
  const HandleData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={"Mantenimiento/UnidadMedida"}
      titulo="Unidad de Medida"
      foco={document.getElementById("tablaUnidadMedida")}
      tamañoModal={[G.ModalPequeño, G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className={G.ContenedorInputs}>
          {modo != "Nuevo" && (
            <div className={G.InputMitad}>
              <label htmlFor="id" className={G.LabelStyle}>
                Código
              </label>
              <input
                type="text"
                id="id"
                name="id"
                placeholder="Código"
                autoComplete="off"
                value={data.id ?? ""}
                onChange={HandleData}
                disabled={true}
                className={G.InputStyle}
              />
            </div>
          )}
          <div className={G.InputFull}>
            <label htmlFor="codigoSunat" className={G.LabelStyle}>
              Código SUNAT
            </label>
            <input
              type="text"
              id="codigoSunat"
              name="codigoSunat"
              placeholder="Código SUNAT"
              autoComplete="off"
              autoFocus
              disabled={modo == "Consultar"}
              value={data.codigoSunat ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
        <div className={G.InputFull}>
          <label htmlFor="descripcion" className={G.LabelStyle}>
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            autoComplete="off"
            placeholder="Descripción"
            disabled={modo == "Consultar"}
            value={data.descripcion ?? ""}
            onChange={HandleData}
            className={G.InputStyle}
          />
        </div>
      </div>
    </ModalCrud>
  );
};

export default Modal;
