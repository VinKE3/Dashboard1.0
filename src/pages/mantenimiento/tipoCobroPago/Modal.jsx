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
      `api/Mantenimiento/TipoCobroPago/FormularioTablas`
    );
    setdataModal(result.data.data.tiposVentaCompra);
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
          menu={["Mantenimiento", "TipoCobroPago"]}
          titulo="Tipo de Pago"
          foco={document.getElementById("tablaCobroPago")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="descripcion" className={G.LabelStyle}>
                  Descripción
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  autoComplete="off"
                  autoFocus
                  disabled={modo == "Consultar" }
                  value={data.descripcion ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.Input42pct}>
                <label htmlFor="abreviatura" className={G.LabelStyle}>
                  Abreviatura
                </label>
                <input
                  type="text"
                  id="abreviatura"
                  name="abreviatura"
                  placeholder="Abreviatura"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.abreviatura ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label
                  htmlFor="tipoVentaCompraId"
                  className={G.LabelStyle}
                >
                  Forma Pago
                </label>
                <select
                  id="tipoVentaCompraId"
                  name="tipoVentaCompraId"
                  disabled={modo == "Nuevo" ? false : true}
                  value={data.tipoVentaCompraId ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                >
                  {dataModal.map((forma) => (
                    <option key={forma.id} value={forma.id}>
                      {forma.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.Input42pct}>
                <label htmlFor="plazo" className={G.LabelStyle}>
                  Plazo
                </label>
                <input
                  type="number"
                  id="plazo"
                  name="plazo"
                  min={0}
                  value={data.plazo ?? ""}
                  disabled={modo == "Consultar" }
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
