import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTCuenta, setdataTCuenta] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataEntidad, setDataEntidad] = useState([]);
  //#endregion

  //#region useEffect
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
    <>
      {dataTCuenta.length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "CuentaCorriente"]}
          titulo="Cuenta Corriente"
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input40pct}>
                <label
                  htmlFor="cuentaCorrienteId"
                  className={Global.LabelStyle}
                >
                  Código
                </label>
                <input
                  type="text"
                  id="cuentaCorrienteId"
                  name="cuentaCorrienteId"
                  autoComplete="off"
                  placeholder="00"
                  readOnly
                  value={data.cuentaCorrienteId ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="tipoCuentaDescripcion"
                  className={Global.LabelStyle}
                >
                  T.Cuenta
                </label>
                <select
                  id="tipoCuentaDescripcion"
                  name="tipoCuentaDescripcion"
                  value={data.tipoCuentaDescripcion ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataTCuenta.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}> 
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.Input40pct}>
                <label htmlFor="monedaId" className={Global.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  value={data.monedaId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataMoneda.map((moneda) => (
                    <option key={moneda.id} value={moneda.id}>
                      {moneda.abreviatura}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label
                  htmlFor="entidadBancariaId"
                  className={Global.LabelStyle}
                >
                  E.Bancaria
                </label>
                <select
                  id="entidadBancariaId"
                  name="entidadBancariaId"
                  value={data.entidadBancariaId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataEntidad.map((entidad) => (
                    <option key={entidad.id} value={entidad.id}>
                      {entidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
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
                  value={data.numero ?? ""}
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
                value={data.observacion ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
