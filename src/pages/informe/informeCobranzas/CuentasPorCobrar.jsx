import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import * as G from "../../../components/Global";

const CuentasPorCobrar = ({ setModal }) => {
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
    clienteId: "",
    checkFiltro: "general",
    checkFiltro2: "fechaVencimiento",
  });
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataCliente, setDataCliente] = useState([]);
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
      target.value === "general" ||
      target.value === "detallado" ||
      target.value === "porPersonal"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    if (
      target.value === "fechaEmision" ||
      target.value === "fechaVencimiento"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro2: target.value,
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
    const res = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      res.data.data.data.map((map) => ({
        id: map.id,
        personal:
          map.apellidoPaterno + " " + map.apellidoMaterno + " " + map.nombres,
      }))
    );
    const re = await ApiMasy.get(`api/Mantenimiento/Cliente/Listar`);
    setDataCliente(re.data.data.data);
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
        titulo="Cuentas por cobrar"
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
            <label htmlFor="clienteId" className={G.LabelStyle}>
              Cliente
            </label>
            <select
              id="clienteId"
              name="clienteId"
              autoFocus
              value={data.clienteId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataCliente.map((dataCliente) => (
                <option key={dataCliente.id} value={dataCliente.id}>
                  {dataCliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              value={data.personalId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataPersonal.map((dataPersonal) => (
                <option key={dataPersonal.id} value={dataPersonal.id}>
                  {dataPersonal.personal}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataMoneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
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
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="general"
                    name="agrupar"
                    value="general"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "general"}
                  />
                </div>
                <label
                  htmlFor="general"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  General
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="detallado"
                    name="agrupar"
                    value="detallado"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "detallado"}
                  />
                </div>
                <label
                  htmlFor="detallado"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Detallado
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
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="fechaEmision"
                    name="agrupar"
                    value="fechaEmision"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaEmision"}
                  />
                </div>
                <label
                  htmlFor="fechaEmision"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Fecha Emisión
                </label>
              </div>
              <div className={G.InputFull}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="fechaVencimiento"
                    name="agrupar"
                    value="fechaVencimiento"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaVencimiento"}
                  />
                </div>
                <label
                  htmlFor="fechaVencimiento"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Fecha Vencimiento
                </label>
              </div>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default CuentasPorCobrar;
