import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import * as G from "../../../components/Global";

const StockValorizado = ({ setModal }) => {
  //#region useState
  const [data, setData] = useState({
    tipoExistenciaId: "",
    conStock: true,
    corteFecha: false,
    checkFiltro: "linea",
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
    if (target.name === "conStock" || target.name === "corteFecha") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    if (target.value === "marca" || target.value === "linea") {
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
      `api/Informes/Articulos/StockValorizado/FormularioTablas`
    );
    setDataTipoExistencia(result.data.data.tiposExistencia);
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(
      `Informes/Articulos/StockValorizado`,
      origen,
      `&TipoExistenciaId=${data.tipoExistenciaId}&ConStock=${data.conStock}&ConCorteFecha=${data.corteFecha}`
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
        titulo="Stock Valorizado"
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
            <div className={G.InputFull}>
              <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
                Tipo de Existencia
              </label>
              <select
                id="tipoExistenciaId"
                name="tipoExistenciaId"
                autoFocus
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
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="conStock"
                    name="conStock"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.conStock ? true : ""}
                  />
                </div>
                <label
                  htmlFor="conStock"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Con Stock
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="corteFecha"
                    name="corteFecha"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.corteFecha ? true : ""}
                  />
                </div>
                <label htmlFor="corteFecha" className={G.LabelCheckStyle}>
                  Corte Fecha
                </label>
              </div>
            </div>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
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
                  Agrupar por Línea y Sublínea
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
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
                <label htmlFor="marca" className={G.LabelCheckStyle}>
                  Agrupar por Marca
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

export default StockValorizado;
