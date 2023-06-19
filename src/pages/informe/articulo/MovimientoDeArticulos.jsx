import moment from "moment";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";

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
    agrupadoPor: "MA",
    conMovimiento: false,
    tipoExistenciaId: "",
  });
  const [dataTipoExistencia, setDataTipoExistencia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == "conMovimiento") {
      setData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
      return;
    }
    setData((prev) => ({
      ...prev,
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
      `&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}&AgrupadoPor=${data.agrupadoPor}&ConStock=${data.conMovimiento}&TipoExistenciaId=${data.tipoExistenciaId}`
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
                    inputId="agruparMarca"
                    name="agrupadoPor"
                    value="MA"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.agrupadoPor == "MA"}
                  />
                </div>
                <label
                  htmlFor="agruparMarca"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Marca
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="agruparLinea"
                    name="agrupadoPor"
                    value="LI"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.agrupadoPor == "LI"}
                  />
                </div>
                <label
                  htmlFor="agruparLinea"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Línea
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="agruparLineaSublinea"
                    name="agrupadoPor"
                    value="SL"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.agrupadoPor == "SL"}
                  />
                </div>
                <label
                  htmlFor="agruparLineaSublinea"
                  className={G.LabelCheckStyle}
                >
                  SubLínea
                </label>
              </div>
            </div>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
                  Tipo de existencia
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
              <div className={G.Input + " w-48"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="conMovimiento"
                    name="conMovimiento"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.conMovimiento ? true : ""}
                  />
                </div>
                <label htmlFor="conMovimiento" className={G.LabelCheckStyle}>
                  Con Movimiento
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

export default MovimientoDeArticulos;
