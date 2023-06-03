import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

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
  const HandleData = async ({ target }) => {
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
          foco={document.getElementById("tablaCuentaCorriente")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input40pct}>
                <label
                  htmlFor="cuentaCorrienteId"
                  className={G.LabelStyle}
                >
                  Código
                </label>
                <input
                  type="text"
                  id="cuentaCorrienteId"
                  name="cuentaCorrienteId"
                  placeholder="Código"
                  autoComplete="off"
                  value={data.cuentaCorrienteId ?? ""}
                  onChange={HandleData}
                  disabled={true}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label
                  htmlFor="tipoCuentaDescripcion"
                  className={G.LabelStyle}
                >
                  T. Cuenta
                </label>
                <select
                  id="tipoCuentaDescripcion"
                  name="tipoCuentaDescripcion"
                  autoFocus
                  value={data.tipoCuentaDescripcion ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar" }
                  className={G.InputStyle}
                >
                  {dataTCuenta.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="monedaId" className={G.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  value={data.monedaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar" }
                  className={G.InputStyle}
                >
                  {dataMoneda.map((moneda) => (
                    <option key={moneda.id} value={moneda.id}>
                      {moneda.abreviatura}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label
                  htmlFor="entidadBancariaId"
                  className={G.LabelStyle}
                >
                  E.Bancaria
                </label>
                <select
                  id="entidadBancariaId"
                  name="entidadBancariaId"
                  value={data.entidadBancariaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar" }
                  className={G.InputStyle}
                >
                  {dataEntidad.map((entidad) => (
                    <option key={entidad.id} value={entidad.id}>
                      {entidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputFull}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número de cuenta"
                  autoComplete="off"
                  maxLength="25"
                  disabled={modo == "Consulta" ? true : false}
                  value={data.numero ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className="flex">
              <label htmlFor="observacion" className={G.LabelStyle}>
                Observación
              </label>
              <input
                type="text"
                id="observacion"
                name="observacion"
                placeholder="Observación"
                autoComplete="off"
                disabled={modo == "Consulta" ? true : false}
                value={data.observacion ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
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
