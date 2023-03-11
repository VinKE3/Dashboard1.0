import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, modo, setRespuestaModal, objeto }) => {
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

  //#region Funcion onChange y validación de campos
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "TipoCobroPago"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="descripcion" className={Global.LabelStyle}>
            Descripcion
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            placeholder="Descripción"
            defaultValue={data.descripcion}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="abreviatura" className={Global.LabelStyle}>
            Abreviatura
          </label>
          <input
            type="text"
            id="abreviatura"
            name="abreviatura"
            onKeyUp={uppercase}
            defaultValue={data.abreviatura}
            readOnly={modo == "Consultar" ? true : false}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="tipoVentaCompraId" className={Global.LabelStyle}>
            Forma Pago
          </label>
          <select
            id="tipoVentaCompraId"
            name="tipoVentaCompraId"
            onChange={handleChange}
            disabled={modo == "Registrar" ? false : true}
            className={Global.SelectStyle}
          >
            <option value="0">--SELECCIONE--</option>
            <option value="CO">CONTADO</option>
            <option value="CR">CREDITO</option>
          </select>
        </div>
        <div className={Global.ContenedorInput48}>
          <label htmlFor="plazo" className={Global.LabelStyle}>
            Plazo
          </label>
          <input
            type="text"
            id="plazo"
            name="plazo"
            defaultValue={data.plazo}
            readOnly={modo == "Consultar" ? true : false}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
};

export default Modal;
