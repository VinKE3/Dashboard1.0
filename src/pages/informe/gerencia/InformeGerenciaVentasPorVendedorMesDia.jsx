import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeGerenciaVentasPorVendedorMesDia = ({ setModal }) => {
  //#region useState
  const [data, setData] = useState({
    añoActual: moment().format("YYYY"),
    mesActual: parseInt(moment().format("MM")).toString(),
  });
  const meses = [
    {
      id: 1,
      nombre: "Enero",
    },
    {
      id: 2,
      nombre: "Febrero",
    },
    {
      id: 3,
      nombre: "Marzo",
    },
    {
      id: 4,
      nombre: "Abril",
    },
    {
      id: 5,
      nombre: "Mayo",
    },
    {
      id: 6,
      nombre: "Junio",
    },
    {
      id: 7,
      nombre: "Julio",
    },
    {
      id: 8,
      nombre: "Agosto",
    },
    {
      id: 9,
      nombre: "Septiembre",
    },
    {
      id: 10,
      nombre: "Octubre",
    },
    {
      id: 11,
      nombre: "Noviembre",
    },
    {
      id: 12,
      nombre: "Diciembre",
    },
  ];
  //#endregion

  //#region useEffect
  useEffect(() => {}, []);
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
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setDataMoneda(result.data.data.monedas);
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(`Informes/Sistema/ReporteClientes`, origen);
    if (model != null) {
      const enlace = document.createElement("a");
      enlace.href = model.url;
      enlace.download = model.fileName;
      enlace.click();
      enlace.remove();
    }
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      titulo="Ventas por Vendedor por Mes y Día"
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
            <label htmlFor="añoActual" className={G.LabelStyle}>
              Año
            </label>
            <input
              type="string"
              id="añoActual"
              name="añoActual"
              autoFocus
              value={data.añoActual ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.InputMitad}>
            <label htmlFor="mesActual" className={G.LabelStyle}>
              Mes
            </label>
            <select
              name="mesActual"
              id="mesActual"
              value={data.mesActual ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {meses.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default InformeGerenciaVentasPorVendedorMesDia;
