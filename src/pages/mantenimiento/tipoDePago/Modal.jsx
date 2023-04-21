import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.entries(dataModal).length > 0) {
      document.getElementById("tipoVentaCompraId").value =
        data.tipoVentaCompraId;
    }
  }, [dataModal]);
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
        <ModalBasic
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "TipoCobroPago"]}
          titulo="Tipo de Pago"
          tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
        >
          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="descripcion" className={Global.LabelStyle}>
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                autoComplete="off"
                placeholder="Descripción"
                readOnly={modo == "Consultar" ? true : false}
                value={data.descripcion ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInput42pct}>
              <label htmlFor="abreviatura" className={Global.LabelStyle}>
                Abreviatura
              </label>
              <input
                type="text"
                id="abreviatura"
                name="abreviatura"
                autoComplete="off"
                placeholder="Abreviatura"
                readOnly={modo == "Consultar" ? true : false}
                value={data.abreviatura ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="tipoVentaCompraId" className={Global.LabelStyle}>
                Forma Pago
              </label>
              <select
                id="tipoVentaCompraId"
                name="tipoVentaCompraId"
                disabled={modo == "Registrar" ? false : true}
                onChange={ValidarData}
                className={Global.SelectStyle}
              >
                {dataModal.map((forma) => (
                  <option key={forma.id} value={forma.id}>
                    {forma.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.ContenedorInput42pct}>
              <label htmlFor="plazo" className={Global.LabelStyle}>
                Plazo
              </label>
              <input
                type="number"
                id="plazo"
                name="plazo"
                value={data.plazo ?? ""}
                readOnly={modo == "Consultar" ? true : false}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </ModalBasic>
      )}
    </>
  );
  //#endregion
};

export default Modal;
