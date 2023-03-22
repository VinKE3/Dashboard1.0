import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);

  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    data;
  }, [data]);

  //#endregion

  //#region Funciones
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }

  const handleChange = ({ target }) => {
    const value = uppercase(target.value);
    setData({ ...data, [target.name]: value });
  };

  //#endregion
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Cargo"]}
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
            defaultValue={data.descripcion}
            onChange={handleChange}
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
            defaultValue={data.sueldo}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
};

export default Modal;
