import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroDocumentoVenta from "../../../components/filtro/FiltroDocumentoVenta";
import Mensajes from "../../../components/funciones/Mensajes";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import moment from "moment";
import {
  FaPlus,
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
  FaPaste,
} from "react-icons/fa";
import "primeicons/primeicons.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataGlobal] = useState(store.session.get("global"));
  const [dataDocumentoVenta, setDataDocumentoVenta] = useState([]);
  //Data General
  //GetTablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoGastos, setDataTipoGastos] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  //GetTablas
  //Modales de Ayuda
  const [modalDocVenta, setModalDocVenta] = useState(false);
  //Modales de Ayuda
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  useEffect(() => {
    dataDocumentoVenta;
    console.log(dataDocumentoVenta);
  }, [dataDocumentoVenta]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (modo == "Nuevo") {
      TipoCambio(data.fechaEmision);
    }
    GetTablas();
  }, []);

  useEffect(() => {
    if (Object.keys(dataDocumentoVenta).length > 0) {
      setData({
        ...data,
        documentoVentaId: dataDocumentoVenta.id,
        documentoVentaNumeroDocumento: dataDocumentoVenta.numeroDocumento,
        documentoVentaFecha: moment(dataDocumentoVenta.fechaEmision).format(
          "yyyy-MM-DD"
        ),
        total: dataDocumentoVenta.total,
        glosa: "N° Operacion: " + dataDocumentoVenta.numeroDocumento.slice(11),
        observacion:
          "N° Operacion: " +
          dataDocumentoVenta.id.slice(8) +
          ", " +
          dataDocumentoVenta.numeroDocumento.slice(0, 2) +
          "/" +
          dataDocumentoVenta.numeroDocumento.slice(8) +
          ", " +
          "FECHA: " +
          " " +
          moment(dataDocumentoVenta.fechaEmision).format("yyyy-MM-DD"),
      });
    }
  }, [dataDocumentoVenta]);

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
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

  //Data General
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Tesoreria/ReciboEgreso/FormularioTablas`
    );
    setDataTipoGastos(result.data.data.tiposGasto);
    setDataMoneda(result.data.data.monedas);
    setDataPersonal(
      result.data.data.personal.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    if (modo == "Nuevo") {
      //Datos Iniciales
      let tipoGastoId = result.data.data.tiposGasto.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      let personal = result.data.data.personal.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoGastoId: tipoGastoId.id,
        personalId: personal.id,
        monedaId: monedas.id,
      }));
    }
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "compra",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroDocVenta = async () => {
    setModalDocVenta(true);
  };

  //#endregion
  //#region Render
  return (
    <>
      <>
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Tesoreria/ReciboEgreso"}
          titulo="Recibo Egreso"
          cerrar={false}
          foco={document.getElementById("tablaReciboEgreso")}
          tamañoModal={[G.ModalFull, G.Form]}
        >
          {tipoMensaje > 0 && (
            <Mensajes
              tipoMensaje={tipoMensaje}
              mensaje={mensaje}
              Click={() =>
                Funciones.OcultarMensajes(setTipoMensaje, setMensaje)
              }
            />
          )}

          {/* Cabecera */}
          <div className={G.ContenedorBasico + " mb-4 " + G.FondoContenedor}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputMitad}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Recibo Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número"
                  autoComplete="off"
                  maxLength="10"
                  disabled={true}
                  value={data.numero ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="fechaEmision" className={G.LabelStyle}>
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  id="fechaEmision"
                  name="fechaEmision"
                  autoComplete="off"
                  autoFocus
                  disabled={modo == "Consultar"}
                  value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                  onChange={HandleData}
                  onBlur={FechaEmision}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="tipoGastoId" className={G.LabelStyle}>
                  T. Gasto
                </label>
                <select
                  id="tipoGastoId"
                  name="tipoGastoId"
                  value={data.tipoGastoId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataTipoGastos.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="personalId" className={G.LabelStyle}>
                  Personal
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  value={data.personalId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataPersonal.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputFull}>
                <label htmlFor="documentoVentaId" className={G.LabelStyle}>
                  Documento Venta
                </label>
                <input
                  type="text"
                  id="documentoVentaId"
                  name="documentoVentaId"
                  placeholder="Buscar Documento Venta"
                  autoComplete="off"
                  disabled={true}
                  value={data.documentoVentaNumeroDocumento ?? ""}
                  onChange={HandleData}
                  className={G.InputBoton}
                />
                <button
                  id="consultarDocumentoVenta"
                  className={G.BotonBuscar + G.BotonPrimary + " !rounded-none"}
                  hidden={modo == "Consultar"}
                  onKeyDown={(e) => Funciones.KeyClick(e)}
                  onClick={() => AbrirFiltroDocVenta()}
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="concepto" className={G.LabelStyle}>
                  Concepto
                </label>
                <input
                  type="text"
                  id="concepto"
                  name="concepto"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  placeholder="Concepto"
                  value={data.concepto}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputTercio}>
                <label htmlFor="monedaId" className={G.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  value={data.monedaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataMoneda.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="tipoCambio" className={G.LabelStyle}>
                  Tipo Cambio
                </label>
                <input
                  type="number"
                  id="tipoCambio"
                  name="tipoCambio"
                  placeholder="Tipo de Cambio"
                  autoComplete="off"
                  min={0}
                  disabled={modo == "Consultar"}
                  value={data.tipoCambio ?? ""}
                  onChange={HandleData}
                  className={modo == "Consultar" ? G.InputStyle : G.InputBoton}
                />
                <button
                  id="consultarTipoCambio"
                  className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                  hidden={modo == "Consultar"}
                  onKeyDown={(e) => Funciones.KeyClick(e)}
                  onClick={() => {
                    TipoCambio(data.fechaEmision);
                  }}
                >
                  <FaUndoAlt></FaUndoAlt>
                </button>
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="total" className={G.LabelStyle}>
                  Importe
                </label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.total ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>

            <div className={G.InputFull}>
              <label htmlFor="glosa" className={G.LabelStyle}>
                Glosario
              </label>
              <input
                type="text"
                id="glosa"
                name="glosa"
                autoComplete="off"
                disabled={modo == "Consultar"}
                placeholder="Glosario"
                value={data.glosa}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputFull}>
              <label htmlFor="observacion" className={G.LabelStyle}>
                Observación
              </label>
              <input
                type="text"
                id="observacion"
                name="observacion"
                autoComplete="off"
                disabled={modo == "Consultar"}
                placeholder="Observación"
                value={data.observacion}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
          </div>
          {/* Cabecera */}
        </ModalCrud>
      </>

      {modalDocVenta && (
        <FiltroDocumentoVenta
          setModal={setModalDocVenta}
          setObjeto={setDataDocumentoVenta}
          foco={document.getElementById("concepto")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
