import React, { useState } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "UnidadMedida"]}
      titulo="Unidad de Medida"
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputMitad}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            autoComplete="off"
            placeholder="00"
            readOnly
            value={data.id ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputMitad}>
          <label htmlFor="codigoSunat" className={Global.LabelStyle}>
            Código SUNAT
          </label>
          <input
            type="text"
            id="codigoSunat"
            name="codigoSunat"
            autoComplete="off"
            placeholder="Código SUNAT"
            readOnly={modo == "Consultar" ? true : false}
            value={data.codigoSunat ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="descripcion" className={Global.LabelStyle}>
          Descripción
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          autoComplete="off"
          placeholder="Descripción"
          readOnly={modo == "Consultar" ? true : false}
          value={data.descripcion ?? ""}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
};

export default Modal;
