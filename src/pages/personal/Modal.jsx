import moment from "moment/moment";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../../components/Global";
import Ubigeo from "../../components/filtro/Ubigeo";
import ModalCrud from "../../components/modal/ModalCrud";

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
      setData((prev) => ({
        ...prev,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      }));
    }
  }, [dataUbigeo]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == "isActivo") {
      setData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Personal/FormularioTablas`
    );
    setDataSexo(result.data.data.sexos);
    setDataEstadoCivil(result.data.data.estadosCivil);
    setDataCargo(result.data.data.cargos);
    setDataEntidad(result.data.data.entidadesBancaria);
    setDataTipoCuenta(result.data.data.tiposCuentaBancaria);
    setDataMoneda(result.data.data.monedas);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let sexos = result.data.data.sexos.find((map) => map);
      let estadosCivil = result.data.data.estadosCivil.find((map) => map);
      let cargos = result.data.data.cargos.find((map) => map);
      let entidadesBancaria = result.data.data.entidadesBancaria.find(
        (map) => map
      );
      let tiposCuentaBancaria = result.data.data.tiposCuentaBancaria.find(
        (map) => map
      );
      let monedas = result.data.data.monedas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        sexoId: sexos.id,
        estadoCivilId: estadosCivil.id,
        cargoId: cargos.id,
        entidadBancariaId: entidadesBancaria.id,
        tipoCuentaBancariaId: tiposCuentaBancaria.id,
        monedaId: monedas.id,
      }));
    }
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
          menu={"Mantenimiento/Personal"}
          titulo="Personal"
          foco={document.getElementById("tablaPersonal")}
          tamañoModal={[G.ModalGrande, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              {modo != "Nuevo" && (
                <div className={G.InputTercio}>
                  <label htmlFor="id" className={G.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Código"
                    autoComplete="off"
                    disabled={true}
                    value={data.id ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              )}
              <div className={G.InputFull}>
                {" "}
                <div className={G.InputFull}>
                  <label
                    htmlFor="numeroDocumentoIdentidad"
                    className={G.LabelStyle}
                  >
                    DNI
                  </label>
                  <input
                    type="text"
                    id="numeroDocumentoIdentidad"
                    name="numeroDocumentoIdentidad"
                    placeholder="Número Documento Identidad"
                    autoComplete="off"
                    maxLength="8"
                    autoFocus
                    disabled={modo == "Consultar"}
                    value={data.numeroDocumentoIdentidad ?? ""}
                    onChange={HandleData}
                    className={G.InputBoton}
                  />
                </div>
                <div className={G.Input + " w-36"}>
                  <div className={G.CheckStyle + G.Anidado}>
                    <Checkbox
                      inputId="isActivo"
                      name="isActivo"
                      disabled={modo == "Consultar"}
                      value={data.isActivo}
                      onChange={(e) => {
                        HandleData(e);
                      }}
                      checked={data.isActivo ? true : ""}
                    ></Checkbox>
                  </div>
                  <label htmlFor="isActivo" className={G.LabelCheckStyle}>
                    Activo
                  </label>
                </div>
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="cargoId" className={G.LabelStyle}>
                  Cargo
                </label>
                <select
                  id="cargoId"
                  name="cargoId"
                  value={data.cargoId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataCargo.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputTercio}>
                <label htmlFor="apellidoPaterno" className={G.LabelStyle}>
                  Ap.Paterno
                </label>
                <input
                  type="text"
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  placeholder="Apellido Paterno"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.apellidoPaterno ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="apellidoMaterno" className={G.LabelStyle}>
                  Ap. Materno
                </label>
                <input
                  type="text"
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  placeholder="Apellido Materno"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.apellidoMaterno ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="nombres" className={G.LabelStyle}>
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  placeholder="Nombres"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.nombres ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
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

            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="direccion" className={G.LabelStyle}>
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.direccion ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="telefono" className={G.LabelStyle}>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.telefono ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="celular" className={G.LabelStyle}>
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  placeholder="Celular"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.celular ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputTercio}>
                <label htmlFor="fechaNacimiento" className={G.LabelStyle}>
                  Fec. Nac.
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={moment(data.fechaNacimiento ?? "").format(
                    "yyyy-MM-DD"
                  )}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="sexoId" className={G.LabelStyle}>
                  Sexo
                </label>
                <select
                  id="sexoId"
                  name="sexoId"
                  value={data.sexoId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataSexo.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="estadoCivilId" className={G.LabelStyle}>
                  Estado Civil
                </label>
                <select
                  id="estadoCivilId"
                  name="estadoCivilId"
                  value={data.estadoCivilId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataEstadoCivil.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="correoElectronico" className={G.LabelStyle}>
                  Correo Electrónico
                </label>
                <input
                  type="text"
                  id="correoElectronico"
                  name="correoElectronico"
                  placeholder="Correo Electrónico"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.correoElectronico ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="entidadBancariaId" className={G.LabelStyle}>
                  Entidad Bancaria
                </label>
                <select
                  id="entidadBancariaId"
                  name="entidadBancariaId"
                  value={data.entidadBancariaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataEntidad.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.Input60pct}>
                <label htmlFor="tipoCuentaBancariaId" className={G.LabelStyle}>
                  Tipo Cuenta
                </label>
                <select
                  id="tipoCuentaBancariaId"
                  name="tipoCuentaBancariaId"
                  value={data.tipoCuentaBancariaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataTipoCuenta.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
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
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
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
              <label htmlFor="cuentaCorriente" className={G.LabelStyle}>
                Cuenta Corriente
              </label>
              <input
                type="text"
                id="cuentaCorriente"
                name="cuentaCorriente"
                placeholder="N° Cuenta Corriente"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.cuentaCorriente ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
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
                disabled={modo == "Consultar"}
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
