import React, { useState } from "react";
import ModalCrud from "../../../components/modal/ModalCrud";
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
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Cargo"]}
      titulo="Cargo"
      foco={document.getElementById("tablaCargo")}
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="descripcion" className={Global.LabelStyle}>
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              placeholder="Descripción"
              autoComplete="off"
              autoFocus
              disabled={modo == "Consultar" ? true : false}
              value={data.descripcion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input56}>
            <label htmlFor="sueldo" className={Global.LabelStyle}>
              Sueldo
            </label>
            <input
              type="number"
              id="sueldo"
              name="sueldo"
              placeholder="Sueldo"
              autoComplete="off"
              min={0}
              disabled={modo == "Consultar" ? true : false}
              defaultValue={data.sueldo ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
};

export default Modal;
