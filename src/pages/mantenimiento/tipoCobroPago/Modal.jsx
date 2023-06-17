import React, { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoVentaCompra, setDataTipoVentaCompra] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/TipoCobroPago/FormularioTablas`
    );
    setDataTipoVentaCompra(result.data.data.tiposVentaCompra);
    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposVentaCompra = result.data.data.tiposVentaCompra.find(
        (map) => map
      );
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoVentaCompraId: tiposVentaCompra.id,
      }));
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoVentaCompra).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Mantenimiento/TipoCobroPago"}
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
                  disabled={modo == "Consultar"}
                  value={data.descripcion ?? ""}
                  onChange={HandleData}
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
                  disabled={modo == "Consultar"}
                  value={data.abreviatura ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="tipoVentaCompraId" className={G.LabelStyle}>
                  Forma Pago
                </label>
                <select
                  id="tipoVentaCompraId"
                  name="tipoVentaCompraId"
                  disabled={modo == "Nuevo" ? false : true}
                  value={data.tipoVentaCompraId ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                >
                  {dataTipoVentaCompra.map((forma) => (
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
                  disabled={modo == "Consultar"}
                  onChange={HandleData}
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
