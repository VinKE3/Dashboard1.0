import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Api from "../../../api/Api";
import Get from "../../../components/funciones/Get";
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
    checkFiltro: "agruparLinea",
  });
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  const [pdf, setPdf] = useState("");
  const [fileName, setFileName] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    console.log(pdf);
  }, [pdf]);
  useEffect(() => {
    GetTablas();
    Imprimir();
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
    if (target.value === "agruparMarca" || target.value === "agruparLinea") {
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
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };
  const Imprimir = async (origen = 2) => {
    const result = await Api.get(
      `api/Informes/Sistema/ReporteClientes?formato=${origen}`
    );
    setPdf(result.data);
    let model = await GetNombreArchivo(
      result.headers.get("content-disposition")
    );
    setFileName(model);
    setPdf(URL.createObjectURL(pdf));
  };
  const GetNombreArchivo = async (disposition) => {
    let filename = "PDF";
    if (disposition && disposition.indexOf("attachment") !== -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }
    return filename;
  };
  //#endregion
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Stock Valorizado"
        habilitarFoco={false}
        tamañoModal={[G.ModalPequeño, G.Form]}
        childrenFooter={
          <>
            <a
              id="enlace"
              href={pdf}
              download={fileName}
              className={
                G.BotonModalBase + G.BotonVerde + " !text-light border-none"
              }
            >
              DESCARGAR
            </a>
            <button
              type="button"
              onClick={() => Imprimir("pdf")}
              className={G.BotonModalBase + G.BotonRojo + " border-gray-200"}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => Imprimir("excel")}
              className={G.BotonModalBase + G.BotonVerde + "  border-gray-200"}
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
                {tipoDeExistencia.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
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
                    inputId="agruparLinea"
                    name="agrupar"
                    value="agruparLinea"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "agruparLinea"}
                  />
                </div>
                <label
                  htmlFor="agruparLinea"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Agrupar por Linea y Sublinea
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="agruparMarca"
                    name="agrupar"
                    value="agruparMarca"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "agruparMarca"}
                  />
                </div>
                <label htmlFor="agruparMarca" className={G.LabelCheckStyle}>
                  Agrupar por Marca
                </label>
              </div>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default StockValorizado;
