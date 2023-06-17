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
  const HandleData = async ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={"Mantenimiento/Marca"}
      titulo="Marca"
      foco={document.getElementById("tablaMarca")}
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
              placeholder="Código"
              autoComplete="off"
              maxLength={2}
              autoFocus
              disabled={modo == "Nuevo" ? false : true}
              value={data.id ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.InputFull}>
            <label htmlFor="nombre" className={G.LabelStyle}>
              Descripción
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              autoComplete="off"
              placeholder="Nombre"
              autoFocus={modo == "Modificar"}
              disabled={modo == "Consultar"}
              value={data.nombre ?? ""}
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
