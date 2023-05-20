import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setDataModal] = useState([]);
  //#endregion

  //#region useEffect.
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
      `api/Mantenimiento/EmpresaTransporte/Listar`
    );
    setDataModal(result.data.data.data);
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataModal).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Vehiculo"]}
          titulo="Vehiculos"
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input48}>
                <label htmlFor="subLineaId" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="subLineaId"
                  name="subLineaId"
                  placeholder="00"
                  autoComplete="off"
                  maxLength="2"
                  value={data.subLineaId ?? ""}
                  onChange={ValidarData}
                  disabled={true}
                  className={Global.InputStyle + Global.Disabled}
                />
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="empresaTransporteId"
                  className={Global.LabelStyle}
                >
                  Empresa Transporte
                </label>
                <select
                  id="empresaTransporteId"
                  name="empresaTransporteId"
                  autoFocus
                  value={data.empresaTransporteId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataModal.map((empresa) => (
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
              <label htmlFor="numeroPlaca" className={Global.LabelStyle}>
                N° Placa
              </label>
              <input
                type="text"
                id="numeroPlaca"
                name="numeroPlaca"
                placeholder=" N° Placa"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.numeroPlaca ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="marca" className={Global.LabelStyle}>
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                placeholder="Marca"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.marca ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className="flex">
              <label htmlFor="modelo" className={Global.LabelStyle}>
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                placeholder="Modelo"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.modelo ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className="flex">
              <label
                htmlFor="certificadoInscripcion"
                className={Global.LabelStyle}
              >
                Certificado Inscripción
              </label>
              <input
                type="text"
                id="certificadoInscripcion"
                name="certificadoInscripcion"
                placeholder=" Certificado Inscripción"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.certificadoInscripcion ?? ""}
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
                placeholder=" Observación"
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
