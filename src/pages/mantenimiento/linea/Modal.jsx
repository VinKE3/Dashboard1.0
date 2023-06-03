import React, { useState } from "react";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Linea"]}
      titulo="Linea"
      foco={document.getElementById("tablaLinea")}
      tamañoModal={[G.ModalPequeño, G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className={G.ContenedorInputs}>
          <div className={G.Input56}>
            <label htmlFor="id" className={G.LabelStyle}>
              Código
            </label>
            <input
              type="text"
              id="id"
              name="id"
              maxLength="2"
              autoComplete="off"
              placeholder="Código"
              autoFocus
              disabled={modo == "Nuevo" ? false : true}
              value={data.id ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
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
              autoFocus={modo == "Modificar"}
              placeholder="Descripción"
              disabled={modo == "Consultar"}
              value={data.descripcion ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
