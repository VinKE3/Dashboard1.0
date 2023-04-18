import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    checked;
  }, [checked]);
  //#endregion

  //#region Funciones
  const ValidarData = ({ target }) => {
    if (target.name == "isActivo" || target.name == "habilitarAfectarStock") {
      setData({ ...data, [target.name]: target.checked });
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };

  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="id"
            value={data.id}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={ValidarData}
            readOnly={true}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputMitad}>
          <div className={Global.LabelStyle}>
            <Checkbox
              inputId="isActivo"
              name="isActivo"
              readOnly={modo == "Registrar" ? true : false}
              disabled={modo == "Registrar" ? true : false}
              value={data.isActivo ? true : false}
              onChange={(e) => {
                setChecked(e.checked);
                ValidarData(e);
              }}
              checked={data.isActivo ? checked : ""}
            ></Checkbox>
          </div>
          <label htmlFor="isActivo" className={Global.InputStyle}>
            Activo{" "}
          </label>
        </div>
        <div className={Global.ContenedorInputMitad}>
          <div className={Global.LabelStyle}>
            <Checkbox
              inputId="habilitarAfectarStock"
              name="habilitarAfectarStock"
              readOnly={modo == "Consultar" ? true : false}
              value={data.habilitarAfectarStock}
              onChange={(e) => {
                setChecked2(e.checked);
                ValidarData(e);
              }}
              checked={data.habilitarAfectarStock ? checked2 : ""}
            ></Checkbox>
          </div>
          <label htmlFor="habilitarAfectarStock" className={Global.InputStyle}>
            Afectar Stock
          </label>
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="nick" className={Global.LabelStyle}>
            Nick
          </label>
          <input
            type="text"
            id="nick"
            name="nick"
            placeholder="nick"
            value={data.nick ?? ""}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={ValidarData}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="personalId" className={Global.LabelStyle}>
            Personal
          </label>
          <input
            type="text"
            id="personalId"
            name="personalId"
            placeholder="Personal"
            value={data.personalId ?? ""}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={ValidarData}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="clave" className={Global.LabelStyle}>
            Clave
          </label>
          <input
            type="password"
            id="clave"
            name="clave"
            placeholder="Clave"
            value={data.clave ?? ""}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={ValidarData}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="claveConfirmacion" className={Global.LabelStyle}>
            Repetir Clave
          </label>
          <input
            type="password"
            id="claveConfirmacion"
            name="claveConfirmacion"
            placeholder="Confirmar Clave"
            value={data.claveConfirmacion ?? ""}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={ValidarData}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="observacion" className={Global.LabelStyle}>
          Observacion
        </label>
        <input
          type="observacion"
          id="observacion"
          name="observacion"
          placeholder="Observacion"
          value={data.observacion ?? ""}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={ValidarData}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
