import React, { useState } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
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
      setRespuestaModal={setRespuestaModal}
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
              maxLength="2"
              autoComplete="off"
              placeholder="00"
              readOnly={modo == "Registrar" ? false : true}
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
              autoComplete="off"
              placeholder="Departamento"
              readOnly={modo == "Consultar" ? true : false}
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
