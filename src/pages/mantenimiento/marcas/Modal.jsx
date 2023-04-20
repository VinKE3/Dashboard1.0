import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
  }, [data]);
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Marca"]}
      titulo="Marca"
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            autoComplete="off"
            placeholder="00"
            readOnly={modo == "Registrar" ? false : true}
            value={data.id}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="nombre" className={Global.LabelStyle}>
            Descripción
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            autoComplete="off"
            placeholder="Nombre"
            readOnly={modo == "Consultar" ? true : false}
            value={data.nombre}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
