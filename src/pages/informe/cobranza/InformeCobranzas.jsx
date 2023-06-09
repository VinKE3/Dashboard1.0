import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeCobranzas = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    checkFiltro: "todos",
    monedaId: "",
  });
  const [dataMoneda, setDataMoneda] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (
      target.value === "cancelados" ||
      target.value === "pendientes" ||
      target.value === "todos"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
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
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Informe de Cobranzas"
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
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataMoneda.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputsFiltro + " !my-0"}>
            <div className={G.InputMitad}>
              <label htmlFor="fechaInicio" className={G.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
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
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="cancelados"
                    name="agrupar"
                    value="cancelados"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "cancelados"}
                  />
                </div>
                <label
                  htmlFor="cancelados"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Cancelados
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="pendientes"
                    name="agrupar"
                    value="pendientes"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "pendientes"}
                  />
                </div>
                <label
                  htmlFor="pendientes"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Pendientes
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="todos"
                    name="agrupar"
                    value="todos"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "todos"}
                  />
                </div>
                <label
                  htmlFor="todos"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Todos
                </label>
              </div>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default InformeCobranzas;
