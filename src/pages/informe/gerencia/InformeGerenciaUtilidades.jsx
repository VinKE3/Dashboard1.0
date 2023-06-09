import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeGerenciaUtilidades = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    monedaId: "S",
    checkFiltro: "porDocumento",
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
      target.value === "porDocumento" ||
      target.value === "porDetalle" ||
      target.value === "porArticulo" ||
      target.value === "porPersonal"
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
        titulo="Informe Utilidades"
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
          <div className={G.ContenedorInputs}>
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
                    inputId="porDocumento"
                    name="agrupar"
                    value="porDocumento"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porDocumento"}
                  />
                </div>
                <label
                  htmlFor="porDocumento"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Documento
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porDetalle"
                    name="agrupar"
                    value="porDetalle"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porDetalle"}
                  />
                </div>
                <label
                  htmlFor="porDetalle"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Doc. Detalle
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porArticulo"
                    name="agrupar"
                    value="porArticulo"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porArticulo"}
                  />
                </div>
                <label
                  htmlFor="porArticulo"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Articulo
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porPersonal"
                    name="agrupar"
                    value="porPersonal"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porPersonal"}
                  />
                </div>
                <label htmlFor="porPersonal" className={G.LabelCheckStyle}>
                  Por Personal
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

export default InformeGerenciaUtilidades;
