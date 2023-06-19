import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import * as G from "../../../components/Global";

const VentaTipoDocumento = ({ setModal }) => {
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
    cargoId: "",
    personalId: "",
    boletas: true,
    facturas: true,
    notasCredito: true,
    guiasRemision: true,
    agruparPersonal: false,
  });
  const [dataMoneda, setMoneda] = useState([]);
  const [dataCargo, setDataCargo] = useState([]);
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
      target.name === "facturas" ||
      target.name === "boletas" ||
      target.name === "notasCredito" ||
      target.name === "guiasRemision" ||
      target.name === "agruparPersonal"
    ) {
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
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
    const res = await ApiMasy.get(`api/Mantenimiento/Cargo/Listar`);
    setDataCargo(res.data.data.data);
    const re = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      re.data.data.data.map((res) => ({
        id: res.id,
        dataPersonal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Ventas por tipo de documento"
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
            <label htmlFor="tiendaId" className={G.LabelStyle}>
              Cargo
            </label>
            <select
              id="cargoId"
              name="cargoId"
              autoFocus
              value={data.cargoId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataCargo.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
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
              {dataPersonal.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.personal}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs}>
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
              {dataMoneda.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className={G.InputFull}>
            <div className={G.InputFull}>
              <div className={G.CheckStyle}>
                <Checkbox
                  inputId="facturas"
                  name="facturas"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.facturas ? true : ""}
                />
              </div>
              <label
                htmlFor="facturas"
                className={G.LabelCheckStyle + " rounded-r-none"}
              >
                Facturas
              </label>
            </div>
            <div className={G.InputFull}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="boletas"
                  name="boletas"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.boletas ? true : ""}
                />
              </div>
              <label
                htmlFor="boletas"
                className={G.LabelCheckStyle + " rounded-r-none"}
              >
                Boletas
              </label>
            </div>
            <div className={G.InputFull}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="guiasRemision"
                  name="guiasRemision"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.guiasRemision ? true : ""}
                />
              </div>
              <label
                htmlFor="guiasRemision"
                className={G.LabelCheckStyle + " rounded-r-none"}
              >
                Guías Remision
              </label>
            </div>
            <div className={G.InputFull}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="notasCredito"
                  name="notasCredito"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.notasCredito ? true : ""}
                />
              </div>
              <label htmlFor="notasCredito" className={G.LabelCheckStyle}>
                Notas Credito
              </label>
            </div>
          </div>
          <div className={G.InputFull}>
            <div className={G.CheckStyle}>
              <Checkbox
                inputId="agruparPersonal"
                name="agruparPersonal"
                onChange={(e) => {
                  HandleData(e);
                }}
                checked={data.agruparPersonal ? true : ""}
              />
            </div>
            <label htmlFor="agruparPersonal" className={G.LabelCheckStyle}>
              Agrupar Personal
            </label>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default VentaTipoDocumento;
