import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const RegistroSalidaCilindros = ({ setModal }) => {
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
    checkFiltro: "porFecha",
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
    if (target.value === "porFecha" || target.value === "porPersonal") {
      setData((prev) => ({
        ...prev,
        checkFiltro: target.value,
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
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        personal:
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
        titulo="Registro salidas de cilindros"
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
          <div className={G.InputFull}>
            <div className={G.InputFull}>
              <div className={G.CheckStyle}>
                <RadioButton
                  inputId="porFecha"
                  name="agrupar"
                  value="porFecha"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.checkFiltro === "porFecha"}
                />
              </div>
              <label
                htmlFor="porFecha"
                className={G.LabelCheckStyle + "rounded-r-none"}
              >
                Por Fecha
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
              <label
                htmlFor="porPersonal"
                className={G.LabelCheckStyle + " !py-1 "}
              >
                Por Personal
              </label>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default RegistroSalidaCilindros;
