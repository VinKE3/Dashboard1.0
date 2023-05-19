import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import Ubigeo from "../../../components/filtros/Ubigeo";
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setDataModal] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
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
      `api/Mantenimiento/EmpresaTransporte/Listar`
    );
    let model = result.data.data.data.map((resultado) => ({
      id: resultado.empresaTransporteId,
      descripcion: resultado.nombre,
    }));
    setDataModal(model);
  };
  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(dataModal).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Conductor"]}
          titulo="Conductor"
          tamañoModal={[Global.ModalMediano, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input60pct}>
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
              <div className={Global.Input33pct}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.isActivo ?? ""}
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.isActivo ? true : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="isActivo" className={Global.InputStyle}>
                  Activo
                </label>
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="empresaTransporteId"
                  className={Global.LabelStyle}
                >
                  Emp. Transporte
                </label>
                <select
                  id="empresaTransporteId"
                  name="empresaTransporteId"
                  autoFocus
                  value={data.empresaTransporteId ?? ""} 
                  onChange={ValidarData}
                  disabled={modo != "Consultar" ? false : true}
                  className={Global.InputStyle}
                >
                  {dataModal.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="nombre" className={Global.LabelStyle}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre Conductor"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.nombre ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input42pct}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  D.N.I
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="D.N.I"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="licenciaConducir" className={Global.LabelStyle}>
                  Licencia de Conducir
                </label>
                <input
                  type="text"
                  id="licenciaConducir"
                  name="licenciaConducir"
                  placeholder="Licencia de Conducir"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.licenciaConducir ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputMitad}>
                <label htmlFor="telefono" className={Global.LabelStyle}>
                  Telefono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  placeholder="Telefono"
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
            <div className="flex">
              <label htmlFor="correoElectronico" className={Global.LabelStyle}>
                Email
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                placeholder="Email"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.correoElectronico ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="direccion" className={Global.LabelStyle}>
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Direccion"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.direccion ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <Ubigeo
              modo={modo}
              setDataUbigeo={setDataUbigeo}
              id={["departamentoId", "provinciaId", "distritoId"]}
              dato={{
                departamentoId: data.departamentoId,
                provinciaId: data.provinciaId,
                distritoId: data.distritoId,
              }}
            ></Ubigeo>
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
