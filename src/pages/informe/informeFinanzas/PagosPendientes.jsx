import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import Mensajes from "../../../components/funciones/Mensajes";
import { FaUndoAlt } from "react-icons/fa";

const PagosPendientes = ({ setModal }) => {
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
  const [moneda, setMoneda] = useState([]);
  const [proveedor, setDataProveedor] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    TipoCambio(data.fechaFin);
    GetTablas();
    GetTablas();
  }, []);

  const HandleData = async ({ target }) => {
    if (
      target.value === "porFecha" ||
      target.value === "porProveedor" ||
      target.value === "pagosRealizados"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    if (target.name === "detallado") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const TipoCambio = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje(result.response.data.messages[0].textos);
      } else {
        setTipoMensaje(1);
        setMensaje([result.message]);
      }
      setData({
        ...data,
        tipoCambio: 0,
      });
    }
  };

  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
    const res = await ApiMasy.get(`api/Mantenimiento/Proveedor/Listar`);
    setDataProveedor(res.data.data.data);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Reporte Pagos" setModal={setModal}>
        {tipoMensaje > 0 && (
          <Mensajes
            tipoMensaje={tipoMensaje}
            mensaje={mensaje}
            Click={() => Funciones.OcultarMensajes(setTipoMensaje, setMensaje)}
          />
        )}
        <div className={G.ContenedorBasico}>
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
            <label htmlFor="porFecha" className={G.LabelCheckStyle + +" !my-0"}>
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
              {proveedor.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs + " !my-0"}>
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
                className={G.InputBoton}
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
              autoFocus
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputTercio}>
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
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="detallado"
                  name="detallado"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.detallado ? true : ""}
                />
              </div>
              <label htmlFor="detallado" className={G.InputBoton}>
                Detallado
              </label>
            </div>
          </div>

          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonVerde}
              botonIcon={faPlus}
              click={() => Imprimir()}
              contenedor=""
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default PagosPendientes;
