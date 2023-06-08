import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const InformePlanillaPagos = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    personalId: "",
    checkFiltro: "sinDetalle",
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
      target.value === "sinDetalle" ||
      target.value === "conDetalle" ||
      target.value === "reporte"
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
        titulo="Informe planilla pagos"
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
            <div className={G.InputFull}>
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
            <div className={G.InputFull}>
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
              <div className={G.InputMitad}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="sinDetalle"
                    name="agrupar"
                    value="sinDetalle"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "sinDetalle"}
                  />
                </div>
                <label
                  htmlFor="sinDetalle"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Sin Detalle de Planilla
                </label>
              </div>
              <div className={G.InputMitad}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="conDetalle"
                    name="agrupar"
                    value="conDetalle"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "conDetalle"}
                  />
                </div>
                <label
                  htmlFor="conDetalle"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Con Detalle de Planilla
                </label>
              </div>
              <div className={G.InputMitad}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporte"
                    name="agrupar"
                    value="reporte"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporte"}
                  />
                </div>
                <label
                  htmlFor="reporte"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Reporte Mensual
                </label>
              </div>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default InformePlanillaPagos;
