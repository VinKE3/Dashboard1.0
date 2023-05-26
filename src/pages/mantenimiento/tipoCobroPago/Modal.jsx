import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as Global from "../../../components/Global";

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
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="descripcion" className={Global.LabelStyle}>
                  Descripción
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  autoComplete="off"
                  autoFocus
                  disabled={modo == "Consultar" ? true : false}
                  value={data.descripcion ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="abreviatura" className={Global.LabelStyle}>
                  Abreviatura
                </label>
                <input
                  type="text"
                  id="abreviatura"
                  name="abreviatura"
                  placeholder="Abreviatura"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={data.abreviatura ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label
                  htmlFor="tipoVentaCompraId"
                  className={Global.LabelStyle}
                >
                  Forma Pago
                </label>
                <select
                  id="tipoVentaCompraId"
                  name="tipoVentaCompraId"
                  disabled={modo == "Nuevo" ? false : true}
                  value={data.tipoVentaCompraId ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                >
                  {dataModal.map((forma) => (
                    <option key={forma.id} value={forma.id}>
                      {forma.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="plazo" className={Global.LabelStyle}>
                  Plazo
                </label>
                <input
                  type="number"
                  id="plazo"
                  name="plazo"
                  min={0}
                  value={data.plazo ?? ""}
                  disabled={modo == "Consultar" ? true : false}
                  onChange={ValidarData}
                  className={Global.InputStyle}
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
