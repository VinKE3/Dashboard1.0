import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataEmpTransporte, setDataEmpTransporte] = useState([]);
  //#endregion

  //#region useEffect.
  useEffect(() => {
    GetTablas();
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
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/EmpresaTransporte/Listar`
    );
    setDataEmpTransporte(result.data.data.data);
    if (modo == "Nuevo") {
      //Datos Iniciales
      let empresasTransporte = result.data.data.data.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipo: empresasTransporte.empresaTransporteId,
      }));
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataEmpTransporte).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Mantenimiento/Vehiculo"}
          titulo="Vehiculos"
          foco={document.getElementById("tablaVehiculo")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              {modo != "Nuevo" && (
                <div className={G.Input48}>
                  <label htmlFor="subLineaId" className={G.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="subLineaId"
                    name="subLineaId"
                    placeholder="Código"
                    autoComplete="off"
                    value={data.id ?? ""}
                    disabled={true}
                    className={G.InputStyle}
                  />
                </div>
              )}
              <div className={G.InputFull}>
                <label htmlFor="empresaTransporteId" className={G.LabelStyle}>
                  Empresa Transporte
                </label>
                <select
                  id="empresaTransporteId"
                  name="empresaTransporteId"
                  autoFocus
                  value={data.empresaTransporteId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataEmpTransporte.map((empresa) => (
                    <option
                      key={empresa.empresaTransporteId}
                      value={empresa.empresaTransporteId}
                    >
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="numeroPlaca" className={G.LabelStyle}>
                N° Placa
              </label>
              <input
                type="text"
                id="numeroPlaca"
                name="numeroPlaca"
                placeholder=" N° Placa"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.numeroPlaca ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="marca" className={G.LabelStyle}>
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                placeholder="Marca"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.marca ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="modelo" className={G.LabelStyle}>
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                placeholder="Modelo"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.modelo ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="certificadoInscripcion" className={G.LabelStyle}>
                Certificado Inscripción
              </label>
              <input
                type="text"
                id="certificadoInscripcion"
                name="certificadoInscripcion"
                placeholder=" Certificado Inscripción"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.certificadoInscripcion ?? ""}
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
                placeholder=" Observación"
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
