import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import { Checkbox } from "primereact/checkbox";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState({
    id: "00",
    nick: "",
    observacion: "",
    isActivo: true,
    habilitarAfectarStock: true,
    personalId: "",
    clave: "",
    claveConfirmacion: "",
  });
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    if (modo != "Registrar") {
      setData(objeto);
    }
  }, [objeto]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);
  useEffect(() => {
    checked;
    console.log(checked);
  }, [checked]);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
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
            onChange={handleChange}
            readOnly={true}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <div className=" flex gap-2 justify-center mt-3">
            <Checkbox
              id="isActivo"
              name="isActivo"
              readOnly={modo == "Registrar" ? true : false}
              disabled={modo == "Registrar" ? true : false}
              value={data.isActivo ? true : false}
              onChange={(e) => {
                setChecked(e.checked);
                handleChange(e);
              }}
              checked={data.isActivo ? checked : ""}
            ></Checkbox>
            <label />
            Activo <label />
          </div>
          <div className=" flex gap-2 justify-center mt-3">
            <Checkbox
              id="habilitarAfectarStock"
              name="habilitarAfectarStock"
              readOnly={modo == "Consultar" ? true : false}
              value={data.habilitarAfectarStock}
              onChange={(e) => {
                setChecked2(e.checked);
                handleChange(e);
              }}
              checked={data.habilitarAfectarStock ? checked2 : ""}
            ></Checkbox>
            <label />
            Afectar Stock <label />
          </div>
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
            value={data.nick}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
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
            value={data.personalId}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
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
            value={data.clave}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
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
            value={data.claveConfirmacion}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
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
          value={data.observacion}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
