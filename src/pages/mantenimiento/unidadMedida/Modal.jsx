import React, { useState } from "react";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funcions
  const ValidarData = async ({ target }) => {
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
      menu={["Mantenimiento", "UnidadMedida"]}
      titulo="Unidad de Medida"
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputMitad}>
            <label htmlFor="id" className={Global.LabelStyle}>
              Código
            </label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="00"
              autoComplete="off"
              value={data.id ?? ""}
              onChange={ValidarData}
              disabled
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="codigoSunat" className={Global.LabelStyle}>
              Código SUNAT
            </label>
            <input
              type="text"
              id="codigoSunat"
              name="codigoSunat"
              placeholder="Código SUNAT"
              autoComplete="off"
              autoFocus
              disabled={modo == "Consultar" ? true : false}
              value={data.codigoSunat ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.InputFull}>
          <label htmlFor="descripcion" className={Global.LabelStyle}>
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            autoComplete="off"
            placeholder="Descripción"
            disabled={modo == "Consultar" ? true : false}
            value={data.descripcion ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalCrud>
  );
};

export default Modal;
