import React, { useState } from "react";
import * as G from "../../../components/Global";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const HandleData = ({ target }) => {
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
      menu={"Mantenimiento/Cargo"}
      titulo="Cargo"
      foco={document.getElementById("tablaCargo")}
      tamañoModal={[G.ModalPequeño, G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="descripcion" className={G.LabelStyle}>
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              placeholder="Descripción"
              autoComplete="off"
              autoFocus
              disabled={modo == "Consultar"}
              value={data.descripcion ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input56}>
            <label htmlFor="sueldo" className={G.LabelStyle}>
              Sueldo
            </label>
            <input
              type="number"
              id="sueldo"
              name="sueldo"
              placeholder="Sueldo"
              autoComplete="off"
              min={0}
              disabled={modo == "Consultar"}
              defaultValue={data.sueldo ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
};

export default Modal;
