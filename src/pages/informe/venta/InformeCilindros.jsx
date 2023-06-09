import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeCilindros = ({ setModal }) => {
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
    checkFiltro: "reporteSalidaCilindros",
  });
  const [dataPersonal, setDataPersonal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (
      target.value === "reporteSalidaCilindros" ||
      target.value === "reporteEntradaCilindros" ||
      target.value === "reporteCilindrosVendidos" ||
      target.value === "reporteCilindrosPendientes" ||
      target.value === "reporteCilindrosSobrantes"
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
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        dataPersonal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
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
        titulo="Informe de Cilindros"
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
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataPersonal.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.personal}
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
                    inputId="reporteSalidaCilindros"
                    name="agrupar"
                    value="reporteSalidaCilindros"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporteSalidaCilindros"}
                  />
                </div>
                <label
                  htmlFor="reporteSalidaCilindros"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Informe Salida Cilindros
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteEntradaCilindros"
                    name="agrupar"
                    value="reporteEntradaCilindros"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporteEntradaCilindros"}
                  />
                </div>
                <label
                  htmlFor="reporteEntradaCilindros"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Informe Entrada Cilindros
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteCilindrosVendidos"
                    name="agrupar"
                    value="reporteCilindrosVendidos"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosVendidos"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosVendidos"
                  className={G.LabelCheckStyle}
                >
                  Informe Cilindros Vendidos
                </label>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="reporteCilindrosPendientes"
                    name="agrupar"
                    value="reporteCilindrosPendientes"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosPendientes"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosPendientes"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Informe Cilindros Pendientes
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteCilindrosSobrantes"
                    name="agrupar"
                    value="reporteCilindrosSobrantes"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosSobrantes"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosSobrantes"
                  className={G.LabelCheckStyle}
                >
                  Informe Cilindros Sobrantes
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

export default InformeCilindros;
