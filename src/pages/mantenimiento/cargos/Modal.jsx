import React, { useState } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const ValidarData = ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion
  return (
    <ModalBasic
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Cargo"]}
      titulo="Cargo"
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
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
        <div className={Global.ContenedorInput56}>
          <label htmlFor="sueldo" className={Global.LabelStyle}>
            Sueldo
          </label>
          <input
            type="number"
            id="sueldo"
            name="sueldo"
            autoComplete="off"
            placeholder="Sueldo"
            readOnly={modo == "Consultar" ? true : false}
            defaultValue={data.sueldo ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
};

export default Modal;
