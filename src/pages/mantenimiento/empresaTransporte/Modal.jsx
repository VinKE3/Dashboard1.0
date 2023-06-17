import React, { useEffect, useState } from "react";
import * as G from "../../../components/Global";
import Ubigeo from "../../../components/filtro/Ubigeo";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataUbigeo, setDataUbigeo] = useState([]);
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
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(data).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Mantenimiento/EmpresaTransporte"}
          titulo="Empresa Transporte"
          foco={document.getElementById("tablaEmpresaTransporte")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              {modo != "Nuevo" && (
                <div className={G.Input72}>
                  <label htmlFor="id" className={G.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Código"
                    autoComplete="off"
                    value={data.id ?? ""}
                    onChange={HandleData}
                    disabled={true}
                    className={G.InputStyle}
                  />
                </div>
              )}
              <div className={G.InputFull}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={G.LabelStyle}
                >
                  RUC N°
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="N° Documento Identidad"
                  autoComplete="off"
                  maxLength={11}
                  autoFocus
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className="flex">
              <label htmlFor="nombre" className={G.LabelStyle}>
                Razón Social
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Razón Social"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.nombre ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
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
                  maxLength={20}
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
                disabled={modo == "Consultar"}
                value={data.correoElectronico ?? ""}
                onChange={HandleData}
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
                placeholder="Dirección"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.direccion ?? ""}
                onChange={HandleData}
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
