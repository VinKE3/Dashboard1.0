import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import Mensajes from "../../../components/funciones/Mensajes";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";

const PagosPendientes = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    proveedorId: "",
    checkFiltro: "porFecha",
    tipoCambio: 0,
    detallado: true,
  });
  const [moneda, setMoneda] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    GetPorIdTipoCambio(data.fechaFin);
    Proveedores();
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
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

  const GetPorIdTipoCambio = async (id) => {
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

  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };

  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
  };

  const Proveedores = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/Listar`);
    setProveedor(result.data.data.data);
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
            Click={() => OcultarMensajes()}
          />
        )}
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.InputFull}>
            <div className={Global.CheckStyle}>
              <RadioButton
                inputId="porFecha"
                name="agrupar"
                value="porFecha"
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.checkFiltro === "porFecha"}
              />
            </div>
            <label
              htmlFor="porFecha"
              className={Global.LabelCheckStyle + +" !my-0"}
            >
              Cronograma de Pagos pendientes (Por Fecha)
            </label>
          </div>
          <div className={Global.InputFull}>
            <div className={Global.CheckStyle}>
              <RadioButton
                inputId="porProveedor"
                name="agrupar"
                value="porProveedor"
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.checkFiltro === "porProveedor"}
              />
            </div>
            <label
              htmlFor="porProveedor"
              className={Global.LabelCheckStyle + +" !my-0"}
            >
              Cronograma de Pagos pendientes (Por Proveedor)
            </label>
          </div>
          <div className={Global.InputFull}>
            <div className={Global.CheckStyle}>
              <RadioButton
                inputId="pagosRealizados"
                name="agrupar"
                value="pagosRealizados"
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.checkFiltro === "pagosRealizados"}
              />
            </div>
            <label
              htmlFor="pagosRealizados"
              className={Global.LabelCheckStyle + +" !my-0"}
            >
              Historial de Pagos Realizados
            </label>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="proveedorId" className={Global.LabelStyle}>
              Proveedores
            </label>
            <select
              id="proveedorId"
              name="proveedorId"
              autoFocus
              value={data.proveedorId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
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
          <div className={Global.ContenedorFiltro + " !my-0"}>
            <div className={Global.InputFull}>
              <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="fechaFin" className={Global.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
            </div>
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputTercio}>
              <label htmlFor="tipoCambio" className={Global.LabelStyle}>
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
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="consultarTipoCambio"
                className={
                  Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                }
                onClick={() => {
                  GetPorIdTipoCambio(data.fechaFin);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
            <div className={Global.Input + " w-25"}>
              <div className={Global.CheckStyle + Global.Anidado}>
                <Checkbox
                  inputId="detallado"
                  name="detallado"
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.detallado ? true : ""}
                />
              </div>
              <label htmlFor="detallado" className={Global.InputBoton}>
                Detallado
              </label>
            </div>
          </div>

          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={Global.BotonAgregar}
              botonIcon={faPlus}
              click={() => Imprimir()}
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default PagosPendientes;
