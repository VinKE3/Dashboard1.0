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
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
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
      menu={["Mantenimiento", "Departamento"]}
      titulo="Departamento"
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input56}>
            <label htmlFor="id" className={Global.LabelStyle}>
              Código
            </label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="00"
              autoComplete="off"
              maxLength="2"
              autoFocus
              disabled={modo == "Nuevo" ? false : true}
              value={data.id ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="nombre" className={Global.LabelStyle}>
              Departamento
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Departamento"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.nombre ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
