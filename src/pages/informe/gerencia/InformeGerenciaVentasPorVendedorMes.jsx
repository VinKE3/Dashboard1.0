import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeGerenciaVentasPorVendedorMes = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
  });
  //#endregion

  //#region useEffect
  useEffect(() => {}, []);
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
  return (
    <ModalBasic
      setModal={setModal}
      titulo="Ventas por Vendedor por Mes"
      habilitarFoco={false}
      tamañoModal={[G.ModalPequeño, G.Form]}
      childrenFooter={
        <>
          <button
            type="button"
            onClick={() => Enviar(1)}
            className={G.BotonModalBase + G.BotonRojo}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => Enviar(2)}
            className={G.BotonModalBase + G.BotonVerde}
          >
            EXCEL
          </button>
          <button
            type="button"
            onClick={() => setModal(false)}
            className={G.BotonModalBase + G.BotonCerrarModal}
          >
            CERRAR
          </button>
        </>
      }
    >
      <div className={G.ContenedorBasico}>
        <div className={G.ContenedorInputs}>
          <div className={G.InputMitad}>
            <label htmlFor="fechaInicio" className={G.LabelStyle}>
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              autoFocus
              value={data.fechaInicio ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.InputMitad}>
            <label htmlFor="fechaFin" className={G.LabelStyle}>
              Hasta
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={data.fechaFin ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default InformeGerenciaVentasPorVendedorMes;
