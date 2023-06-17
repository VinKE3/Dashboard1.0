import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const MovimientoDeArticulos = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    articulosMovimiento: false,
    checkFiltro: "marca",
  });
  const [dataTipoExistencia, setDataTipoExistencia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name === "articulosMovimiento") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    if (
      target.value === "marca" ||
      target.value === "linea" ||
      target.value === "lineaSublinea"
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
      `/Api/Informes/Articulos/MovimientoArticulo/FormularioTablas`
    );
    setDataTipoExistencia(result.data.data.tiposExistencia);
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(
      `Informes/Articulos/MovimientoArticulo`,
      origen,
      `&TipoExistenciaId=${data.tipoExistenciaId}&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}&AgrupadoPor=${data.checkFiltro}&ConStock=${data.articulosMovimiento}`
    );
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
        titulo="Movimientos de Artículos"
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
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="marca"
                    name="agrupar"
                    value="marca"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "marca"}
                  />
                </div>
                <label
                  htmlFor="marca"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Agrupar por Marca
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="linea"
                    name="agrupar"
                    value="linea"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "linea"}
                  />
                </div>
                <label
                  htmlFor="linea"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Agrupar por Línea
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="lineaSublinea"
                    name="agrupar"
                    value="lineaSublinea"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "lineaSublinea"}
                  />
                </div>
                <label htmlFor="lineaSublinea" className={G.LabelCheckStyle}>
                  Agrupar por Línea y Sublínea
                </label>
              </div>
            </div>
          </div>

          <div className={G.InputFull}>
            <div className={G.CheckStyle}>
              <Checkbox
                inputId="articulosMovimiento"
                name="articulosMovimiento"
                onChange={(e) => {
                  HandleData(e);
                }}
                checked={data.articulosMovimiento ? true : ""}
              />
            </div>
            <label htmlFor="articulosMovimiento" className={G.LabelCheckStyle}>
              Articulos con Movimiento
            </label>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
              Tipo de Existencia
            </label>
            <select
              id="tipoExistenciaId"
              name="tipoExistenciaId"
              value={data.tipoExistenciaId ?? ""}
              onChange={HandleData}
              className={G.InputBoton}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataTipoExistencia.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default MovimientoDeArticulos;
