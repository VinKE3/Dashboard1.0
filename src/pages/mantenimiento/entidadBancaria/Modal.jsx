import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funcions
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
      `api/Mantenimiento/EntidadBancaria/FormularioTablas`
    );
    setdataModal(result.data.data.tiposEntidadesBancarias);
  };
  //#endregion

  return (
    <>
      {dataModal.length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "EntidadBancaria"]}
          titulo="Entidad Bancaria"
          foco={document.getElementById("tablaEntidadBancaria")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input40pct}>
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
                  onChange={ValidarData}
                  disabled={true}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={G.LabelStyle}
                >
                  RUC
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="00000000000"
                  autoComplete="off"
                  maxLength="11"
                  autoFocus
                  disabled={modo == "Consultar"}
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="tipo" className={G.LabelStyle}>
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={data.tipo ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataModal.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
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
                placeholder="Nombre"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.nombre ?? ""}
                onChange={ValidarData}
                className={G.InputStyle}
              />
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
};

export default Modal;
