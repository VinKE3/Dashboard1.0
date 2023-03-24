import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTCuenta, setdataTCuenta] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataEntidad, setDataEntidad] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    dataTCuenta;
    document.getElementById("tipoCuentaDescripcion").value =
      data.tipoCuentaDescripcion;
  }, [dataTCuenta]);
  useEffect(() => {
    dataMoneda;
    document.getElementById("monedaId").value = data.monedaId;
  }, [dataMoneda]);
  useEffect(() => {
    dataEntidad;
    document.getElementById("entidadBancariaId").value = data.entidadBancariaId;
  }, [dataEntidad]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/FormularioTablas`
    );
    setdataTCuenta(result.data.data.tiposCuentaBancaria);
    setDataMoneda(result.data.data.monedas);
    setDataEntidad(result.data.data.entidadesBancarias);
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "CuentaCorriente"]}
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput40pct}>
          <label htmlFor="cuentaCorrienteId" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="cuentaCorrienteId"
            name="cuentaCorrienteId"
            autoComplete="off"
            placeholder="00"
            readOnly
            value={data.cuentaCorrienteId}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="tipoCuentaDescripcion" className={Global.LabelStyle}>
            T.Cuenta
          </label>
          <select
            id="tipoCuentaDescripcion"
            name="tipoCuentaDescripcion"
            onChange={ValidarData}
            disabled={modo == "Consultar" ? true : false}
            className={Global.SelectStyle}
          >
            {dataTCuenta.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInput40pct}>
          <label htmlFor="monedaId" className={Global.LabelStyle}>
            Moneda
          </label>
          <select
            id="monedaId"
            name="monedaId"
            onChange={ValidarData}
            disabled={modo == "Consultar" ? true : false}
            className={Global.SelectStyle}
          >
            {dataMoneda.map((moneda) => (
              <option key={moneda.id} value={moneda.id}>
                {moneda.abreviatura}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="entidadBancariaId" className={Global.LabelStyle}>
            E.Bancaria
          </label>
          <select
            id="entidadBancariaId"
            name="entidadBancariaId"
            onChange={ValidarData}
            disabled={modo == "Consultar" ? true : false}
            className={Global.SelectStyle}
          >
            {dataEntidad.map((entidad) => (
              <option key={entidad.id} value={entidad.id}>
                {entidad.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="numero" className={Global.LabelStyle}>
            Número de Cuenta
          </label>
          <input
            type="text"
            id="numero"
            name="numero"
            autoComplete="off"
            maxLength="25"
            placeholder="Número de cuenta"
            readOnly={modo == "Consulta" ? true : false}
            value={data.numero}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className="flex">
        <label htmlFor="observacion" className={Global.LabelStyle}>
          Observación
        </label>
        <input
          type="text"
          id="observacion"
          name="observacion"
          autoComplete="off"
          placeholder="Observación"
          readOnly={modo == "Consulta" ? true : false}
          value={data.observacion == null ? "" : data.observacion}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
