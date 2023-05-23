import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCliente from "../../../components/filtros/FiltroCliente";
import FiltroArticulo from "../../../components/filtros/FiltroArticulo";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import {
  FaPlus,
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
  FaPaste,
} from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 90px;
    text-align: center;
  }

  & th:nth-child(6),
  & th:nth-child(7) {
    width: 130px;
    min-width: 130px;
    max-width: 130px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaInicio);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //?Data General
  const ValidarData = async ({ target }) => {
    if (
      target.name == "incluyeIGV" ||
      target.name == "afectarStock" ||
      target.name == "abonar"
    ) {
      if (target.name == "incluyeIGV") {
        setRefrescar(true);
      }
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
    if (target.name == "lugarEntrega") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
    if (target.name == "tipoDocumentoId") {
      if (target.value == "03") {
        setData((prevState) => ({
          ...prevState,
          incluyeIGV: true,
        }));
        return;
      }
      if (target.value != "03") {
        setData((prevState) => ({
          ...prevState,
          incluyeIGV: false,
        }));
      }
      if (target.value != "07" || target.value != "08") {
        setData((prevState) => ({
          ...prevState,
          documentoReferenciaId: "",
          motivoNotaId: "",
          motivoSustento: "",
        }));
      }
    }
    if (
      target.name == "porcentajeIGV" ||
      target.name == "porcentajeRetencion" ||
      target.name == "porcentajePercepcion"
    ) {
      setRefrescar(true);
    }
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      //Obtiene el personal default de Clientes Varios
      let personal = dataGlobal.cliente.personal.find(
        (map) => map.default == true
      );
      //Obtiene el personal default de Clientes Varios

      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: dataGlobal.cliente.id,
        clienteTipoDocumentoIdentidadId:
          dataGlobal.cliente.tipoDocumentoIdentidadId,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        tipoVentaId: dataGlobal.cliente.tipoVentaId,
        tipoCobroId: dataGlobal.cliente.tipoCobroId,
        clienteDireccionId: dataGlobal.cliente.direccionPrincipalId,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
        personalId: personal.personalId,
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteTipoDocumentoIdentidadId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        clienteDireccionId: 0,
        clienteDireccion: "",
        personalId: dataGlobal.personalId,
      }));
    }
  };
  const FechaEmision = async () => {
    if (modo != "Consultar") {
      toast(
        "Si la fecha de emisión ha sido cambiada, no olvide consultar el tipo de cambio.",
        {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };
  const Numeracion = async (e) => {
    if (e.target.name == "numero") {
      let num = e.target.value;
      if (num.length < 10) {
        num = ("0000000000" + num).slice(-10);
      }
      setData((prevState) => ({
        ...prevState,
        numero: num,
      }));
    }
    if (e.target.name == "serie") {
      let num = e.target.value;
      if (num.length < 4) {
        num = ("0000000000" + num).slice(-4);
      }
      setData((prevState) => ({
        ...prevState,
        serie: num,
      }));
    }
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion
  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };
  //#endregion
  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
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
    } else {
      setData({
        ...data,
        tipoCambio: result.data.data.precioVenta,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaEmision).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioVenta,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: "toastTipoCambio",
        }
      );
      OcultarMensajes();
    }
  };
  //#endregion
  return (
    <>
      <ModalCrud
        setModal={setModal}
        objeto={data}
        modo={modo}
        menu={["Almacen", "SalidaAlmacen"]}
        titulo="Salida de Articulos"
        tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
        cerrar={false}
      >
        {tipoMensaje > 0 && (
          <Mensajes
            tipoMensaje={tipoMensaje}
            mensaje={mensaje}
            Click={() => OcultarMensajes()}
          />
        )}
        {/* Cabecera */}
        <div
          className={
            Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
          }
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputTercio}>
              <label htmlFor="serie" className={Global.LabelStyle}>
                Serie
              </label>
              <input
                type="text"
                id="serie"
                name="serie"
                placeholder="Serie"
                maxLength="4"
                autoComplete="off"
                s
                autoFocus
                disabled={modo == "Registrar" ? false : true}
                value={data.serie ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={
                  modo == "Registrar" ? Global.InputStyle : Global.InputStyle
                }
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                Número
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                maxLength="10"
                autoComplete="off"
                disabled={modo == "Registrar" ? false : true}
                value={data.numero ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={
                  modo == "Registrar" ? Global.InputStyle : Global.InputStyle
                }
              />
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                F. Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={moment(data.fechaInicio ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                onBlur={FechaEmision}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="fechaTerminacion" className={Global.LabelStyle}>
                F. Terminación
              </label>
              <input
                type="date"
                id="fechaTerminacion"
                name="fechaTerminacion"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={moment(data.fechaTerminacion ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="clienteNombre" className={Global.LabelStyle}>
                Cliente
              </label>
              <input
                type="text"
                id="clienteNombre"
                name="clienteNombre"
                placeholder="Buscar Cliente"
                autoComplete="off"
                disabled={true}
                value={data.clienteNombre ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="consultar"
                className={
                  Global.BotonBuscar + Global.BotonPrimary + " !rounded-none"
                }
                hidden={modo == "Consultar" ? true : false}
                disabled={checkVarios ? true : false}
                onClick={() => AbrirFiltroCliente()}
              >
                <FaSearch></FaSearch>
              </button>
              <div className={Global.Input + " w-20"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="varios"
                    name="varios"
                    disabled={modo == "Consultar" ? true : false}
                    onChange={(e) => {
                      setCheckVarios(e.checked);
                      ClientesVarios(e);
                    }}
                    checked={checkVarios ? true : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="varios" className={Global.LabelCheckStyle}>
                  Varios
                </label>
              </div>
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="monedaId" className={Global.LabelStyle}>
                Moneda
              </label>
              <select
                id="monedaId"
                name="monedaId"
                value={data.monedaId ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              >
                {dataMoneda.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
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
                disabled={modo == "Consultar" ? true : false}
                value={data.tipoCambio ?? ""}
                onChange={ValidarData}
                className={
                  modo != "Consultar" ? Global.InputBoton : Global.InputStyle
                }
              />
              <button
                id="consultarTipoCambio"
                className={
                  Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                }
                hidden={modo == "Consultar" ? true : false}
                onClick={() => {
                  GetPorIdTipoCambio(data.fechaInicio);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Responsable
            </label>
            <select
              id="personalId"
              name="personalId"
              value={data.personalId ?? ""}
              onChange={ValidarData}
              disabled={modo == "Consultar" ? true : false}
              className={Global.InputStyle}
            >
              {dataVendedor.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="lineaProduccion" className={Global.LabelStyle}>
              Linea de Producción
            </label>
            <input
              type="text"
              id="lineaProduccion"
              name="lineaProduccion"
              placeholder="Linea de Producción"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.lineaProduccion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="envasado" className={Global.LabelStyle}>
              Envasado
            </label>
            <input
              type="text"
              id="envasado"
              name="envasado"
              placeholder="Envasado"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.envasado ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="numeroLote" className={Global.LabelStyle}>
                N° Lote
              </label>
              <input
                type="text"
                id="numeroLote"
                name="numeroLote"
                placeholder="N° Lote"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.numeroLote ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="guiaRemision" className={Global.LabelStyle}>
                Guia Remision
              </label>
              <input
                type="text"
                id="guiaRemision"
                name="guiaRemision"
                placeholder="Guia Remision"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.guiaRemision ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="observacion" className={Global.LabelStyle}>
              Linea de Producción
            </label>
            <input
              type="text"
              id="observacion"
              name="observacion"
              placeholder="Observación"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.ContenedorInputs}></div>
        </div>
        {/* Cabecera */}
      </ModalCrud>
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("monedaId")}
        />
      )}
    </>
  );
};

export default Modal;
