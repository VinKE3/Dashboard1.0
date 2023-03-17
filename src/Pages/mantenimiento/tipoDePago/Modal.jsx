import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    dataModal;
    document.getElementById("tipoVentaCompraId").value = data.tipoVentaCompraId;
  }, [dataModal]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/TipoCobroPago/FormularioTablas`
    );
    setdataModal(result.data.data.tiposVentaCompra);
  };
  //#endregion

  //#region Render
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
            onKeyUp={uppercase}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInput72}>
          <label htmlFor="abreviatura" className={Global.LabelStyle}>
            Abreviatura
          </label>
          <input
            type="text"
            id="abreviatura"
            name="abreviatura"
            placeholder="Abreviatura"
            readOnly={modo == "Consultar" ? true : false}
            defaultValue={data.abreviatura}
            onChange={handleChange}
            onKeyUp={uppercase}
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
            disabled={modo == "Registrar" ? false : true}
            onChange={handleChange}
            className={Global.SelectStyle}
          >
            {dataModal.map((forma) => (
              <option key={forma.id} value={forma.id}>
                {forma.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInput72}>
          <label htmlFor="plazo" className={Global.LabelStyle}>
            Plazo
          </label>
          <input
            type="number"
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
  //#endregion
};

export default Modal;
