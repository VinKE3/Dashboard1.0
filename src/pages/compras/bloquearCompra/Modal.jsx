import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    console.log("data", data);
  }, [data]);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const handleChange = ({ target }) => {
    if (target.name == "isBloqueado") {
      setData({ ...data, [target.name]: target.checked });
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region  Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Compras", "BloquearCompra"]}
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="ids" className={Global.LabelStyle}>
            ID
          </label>
          <input
            type="text"
            id="ids"
            name="ids"
            maxLength="2"
            autoComplete="off"
            placeholder="00"
            readOnly={modo == "Registrar" ? false : true}
            value={data.ids}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="descripcion" className={Global.LabelStyle}>
            Bloquear Compra
          </label>
          <div className={Global.InputStyle}>
            <Checkbox
              id="isBloqueado"
              name="isBloqueado"
              value={data.isBloqueado ? true : false}
              onChange={(e) => {
                setChecked(e.checked);
                handleChange(e);
              }}
              checked={data.isBloqueado ? checked : ""}
            ></Checkbox>
          </div>
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
