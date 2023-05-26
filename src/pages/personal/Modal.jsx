import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import moment from "moment/moment";
import ModalCrud from "../../components/modal/ModalCrud";
import * as Global from "../../components/Global";
import { Checkbox } from "primereact/checkbox";
import Ubigeo from "../../components/filtro/Ubigeo";
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [dataSexo, setDataSexo] = useState([]);
  const [dataEstadoCivil, setDataEstadoCivil] = useState([]);
  const [dataCargo, setDataCargo] = useState([]);
  const [dataEntidad, setDataEntidad] = useState([]);
  const [dataTipoCuenta, setDataTipoCuenta] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataUbigeo).length > 0) {
      setData({
        ...data,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "isActivo") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Personal/FormularioTablas`
    );
    setDataSexo(result.data.data.sexos);
    setDataEstadoCivil(result.data.data.estadosCivil);
    setDataCargo(result.data.data.cargos);
    setDataEntidad(result.data.data.entidadesBancaria);
    setDataTipoCuenta(result.data.data.tiposCuentaBancaria);
    setDataMoneda(result.data.data.monedas);
  };
  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(dataEstadoCivil).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Personal"]}
          titulo="Personal"
          tamañoModal={[Global.ModalGrande, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputTercio}>
                <label htmlFor="id" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="id"
                  autoComplete="off"
                  disabled={true}
                  value={data.id ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  DNI
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="DNI"
                  autoComplete="off"
                  maxLength="8"
                  autoFocus
                  disabled={modo == "Consultar" ? true : false}
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.isActivo}
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.isActivo ? true : ""}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="isActivo"
                  className={Global.InputStyle + " font-bold"}
                >
                  Activo
                </label>
              </div>
            </div>

            <div className={Global.ContenedorInputs}>
              <div className={Global.InputTercio}>
                <label htmlFor="apellidoPaterno" className={Global.LabelStyle}>
                  Ap.Paterno
                </label>
                <input
                  type="text"
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  placeholder="Apellido Paterno"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.apellidoPaterno ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="apellidoMaterno" className={Global.LabelStyle}>
                  Ap. Materno
                </label>
                <input
                  type="text"
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  placeholder="Apellido Materno"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.apellidoMaterno ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="nombres" className={Global.LabelStyle}>
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  placeholder="Nombres"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.nombres ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>

            <Ubigeo
              modo={modo}
              id={["departamentoId", "provinciaId", "distritoId"]}
              dato={{
                departamentoId: data.departamentoId,
                provinciaId: data.provinciaId,
                distritoId: data.distritoId,
              }}
              setDataUbigeo={setDataUbigeo}
            ></Ubigeo>

            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="direccion" className={Global.LabelStyle}>
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.direccion ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="telefono" className={Global.LabelStyle}>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.telefono ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="celular" className={Global.LabelStyle}>
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  placeholder="Celular"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.celular ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>

            <div className={Global.ContenedorInputs}>
              <div className={Global.InputTercio}>
                <label htmlFor="fechaNacimiento" className={Global.LabelStyle}>
                  Fec. Nac.
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={moment(data.fechaNacimiento ?? "").format(
                    "yyyy-MM-DD"
                  )}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="sexoId" className={Global.LabelStyle}>
                  Sexo
                </label>
                <select
                  id="sexoId"
                  name="sexoId"
                  value={data.sexoId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataSexo.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="estadoCivilId" className={Global.LabelStyle}>
                  Estado Civil
                </label>
                <select
                  id="estadoCivilId"
                  name="estadoCivilId"
                  value={data.estadoCivilId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataEstadoCivil.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label
                  htmlFor="correoElectronico"
                  className={Global.LabelStyle}
                >
                  Correo Electrónico
                </label>
                <input
                  type="text"
                  id="correoElectronico"
                  name="correoElectronico"
                  placeholder="Correo Electrónico"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.correoElectronico ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="cargoId" className={Global.LabelStyle}>
                  Cargo
                </label>
                <select
                  id="cargoId"
                  name="cargoId"
                  value={data.cargoId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataCargo.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
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
                  {dataEntidad.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.Input60pct}>
                <label
                  htmlFor="tipoCuentaBancariaId"
                  className={Global.LabelStyle}
                >
                  T.Cuenta
                </label>
                <select
                  id="tipoCuentaBancariaId"
                  name="tipoCuentaBancariaId"
                  value={data.tipoCuentaBancariaId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataTipoCuenta.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputMitad}>
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
                  {dataMoneda.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.abreviatura}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="cuentaCorriente" className={Global.LabelStyle}>
                Cuenta Corriente
              </label>
              <input
                type="text"
                id="cuentaCorriente"
                name="cuentaCorriente"
                placeholder="N° Cuenta Corriente"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.cuentaCorriente ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="observacion" className={Global.LabelStyle}>
                Observación
              </label>
              <input
                type="text"
                id="observacion"
                name="observacion"
                placeholder="Observación"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
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
