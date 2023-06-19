import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalBasic from "../../../components/modal/ModalBasic";
import Mensajes from "../../../components/funciones/Mensajes";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import { FaUndoAlt } from "react-icons/fa";
import * as G from "../../../components/Global";

const PagosPendientes = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    proveedorId: "",
    checkFiltro: "porFecha",
    tipoCambio: 0,
    detallado: true,
  });
  const [dataMoneda, setMoneda] = useState([]);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    TipoCambio(data.fechaFin);
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (
      target.value === "porFecha" ||
      target.value === "porProveedor" ||
      target.value === "pagosRealizados"
    ) {
      setData((prev) => ({
        ...prev,
        checkFiltro: target.value,
      }));
      return;
    }
    if (target.name === "detallado") {
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
    const res = await ApiMasy.get(`api/Mantenimiento/Proveedor/Listar`);
    setDataProveedor(res.data.data.data);
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "venta",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
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
        titulo="Informe de Pagos Pendientes/Realizados"
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
        {tipoMensaje > 0 && (
          <Mensajes
            tipoMensaje={tipoMensaje}
            mensaje={mensaje}
            Click={() => Funciones.OcultarMensajes(setTipoMensaje, setMensaje)}
          />
        )}
        <div className={G.ContenedorBasico}>
          <div className={G.ContenedorBasico + " !p-0 !gap-y-0.5 !border-0"}>
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
                className={G.LabelCheckStyle + +" !my-0"}
              >
                Cronograma de Pagos pendientes (Por Fecha)
              </label>
            </div>
            <div className={G.InputFull}>
              <div className={G.CheckStyle}>
                <RadioButton
                  inputId="porProveedor"
                  name="agrupar"
                  value="porProveedor"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.checkFiltro === "porProveedor"}
                />
              </div>
              <label
                htmlFor="porProveedor"
                className={G.LabelCheckStyle + +" !my-0"}
              >
                Cronograma de Pagos pendientes (Por Proveedor)
              </label>
            </div>
            <div className={G.InputFull}>
              <div className={G.CheckStyle}>
                <RadioButton
                  inputId="pagosRealizados"
                  name="agrupar"
                  value="pagosRealizados"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.checkFiltro === "pagosRealizados"}
                />
              </div>
              <label
                htmlFor="pagosRealizados"
                className={G.LabelCheckStyle + +" !my-0"}
              >
                Historial de Pagos Realizados
              </label>
            </div>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="proveedorId" className={G.LabelStyle}>
              Proveedores
            </label>
            <select
              id="proveedorId"
              name="proveedorId"
              autoFocus
              value={data.proveedorId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataProveedor.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs + " !my-0"}>
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
            <div className={G.InputMitad}>
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
                {dataMoneda.map((dataMoneda) => (
                  <option key={dataMoneda.id} value={dataMoneda.id}>
                    {dataMoneda.abreviatura}
                  </option>
                ))}
              </select>
            </div>
            <div className={G.InputFull}>
              <label htmlFor="tipoCambio" className={G.LabelStyle}>
                T. Cambio
              </label>
              <input
                type="number"
                id="tipoCambio"
                name="tipoCambio"
                placeholder="Tipo de Cambio"
                autoComplete="off"
                min={0}
                value={data.tipoCambio ?? ""}
                onChange={HandleData}
                className={G.InputBoton}
              />
              <button
                id="consultarTipoCambio"
                className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                onClick={() => {
                  TipoCambio(data.fechaFin);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
            <div className={G.Input + " w-25"}>
              <div className={G.CheckStyle}>
                <Checkbox
                  inputId="detallado"
                  name="detallado"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.detallado ? true : ""}
                />
              </div>
              <label htmlFor="detallado" className={G.LabelCheckStyle}>
                Detallado
              </label>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default PagosPendientes;
