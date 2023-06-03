import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import Ubigeo from "../../../components/filtro/Ubigeo";
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
          foco={document.getElementById("tablaTransportista")}
          tamañoModal={[G.ModalMediano, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input60pct}>
                <label htmlFor="id" className={G.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="id"
                  autoComplete="off"
                  autoFocus={modo == "Consultar"}
                  disabled={true}
                  value={data.id ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.Input33pct}>
                <div className={G.LabelStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    disabled={modo == "Consultar" }
                    value={data.isActivo ?? ""}
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.isActivo ? true : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="isActivo" className={G.InputStyle}>
                  Activo
                </label>
              </div>
              <div className={G.InputFull}>
                <label
                  htmlFor="empresaTransporteId"
                  className={G.LabelStyle}
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
                  className={G.InputStyle}
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
              <label htmlFor="nombre" className={G.LabelStyle}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre Conductor"
                autoComplete="off"
                disabled={modo == "Consultar" }
                value={data.nombre ?? ""}
                onChange={ValidarData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.Input42pct}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={G.LabelStyle}
                >
                  D.N.I
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="D.N.I"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="licenciaConducir" className={G.LabelStyle}>
                  Licencia de Conducir
                </label>
                <input
                  type="text"
                  id="licenciaConducir"
                  name="licenciaConducir"
                  placeholder="Licencia de Conducir"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.licenciaConducir ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputMitad}>
                <label htmlFor="telefono" className={G.LabelStyle}>
                  Telefono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  placeholder="Telefono"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.telefono ?? ""}
                  onChange={ValidarData}
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
                  disabled={modo == "Consultar" }
                  value={data.celular ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className="flex">
              <label htmlFor="correoElectronico" className={G.LabelStyle}>
                Email
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                placeholder="Email"
                autoComplete="off"
                disabled={modo == "Consultar" }
                value={data.correoElectronico ?? ""}
                onChange={ValidarData}
                className={G.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="direccion" className={G.LabelStyle}>
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Direccion"
                autoComplete="off"
                disabled={modo == "Consultar" }
                value={data.direccion ?? ""}
                onChange={ValidarData}
                className={G.InputStyle}
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
              <label htmlFor="observacion" className={G.LabelStyle}>
                Observación
              </label>
              <input
                type="text"
                id="observacion"
                name="observacion"
                placeholder="Observación"
                autoComplete="off"
                disabled={modo == "Consultar" }
                value={data.observacion ?? ""}
                onChange={ValidarData}
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
