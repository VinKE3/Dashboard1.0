import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/Modal/ModalCrud";
import Mensajes from "../../../components/Funciones/Mensajes";
import TableBasic from "../../../components/Tabla/TableBasic";
import BotonBasico from "../../../components/Boton/BotonBasico";
import { toast } from "react-toastify";
import moment from "moment";
import { FaPlus, FaUndoAlt, FaTrashAlt, FaEye } from "react-icons/fa";
import styled from "styled-components";
import { faPlus, faCancel } from "@fortawesome/free-solid-svg-icons";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:nth-child(1),
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3) {
    width: 120px;
  }
  & th:nth-child(5) {
    width: 40px;
    text-align: center;
  }

  & th:nth-child(6) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    text-align: center;
  }
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
  const [dataDetalle, setDataDetalle] = useState(objeto.abonos);
  //Data General
  //Tablas
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoPago, setDataTipoPago] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataAbono, setDataAbono] = useState([]);
  //Tablas

  const [totalSaldo, setTotalSaldo] = useState(objeto.saldo);
  const [nuevo, setNuevo] = useState(false);
  const [habilitarCampo, setHabilitarCampo] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    GetIsPermitido(data.id, 0, 0);
    setDataTipoDoc([data.tipoDocumento]);
    TablasAbono();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarDataAbono = async ({ target }) => {
    setDataAbono((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));

    if (target.name == "tipoPagoId") {
      if (target.value != "EF") {
        let model = dataCtacte.find((map) => {
          return map;
        });
        setDataAbono((prevData) => ({
          ...prevData,
          cuentaCorrienteId: model.cuentaCorrienteId,
        }));
      } else {
        setDataAbono((prevData) => ({
          ...prevData,
          cuentaCorrienteId: null,
        }));
      }
    }
  };
  const CalcularTotal = async ({ target }) => {
    if (dataAbono.tipoCambio == 0) {
      toast.error(
        "No es posible hacer la conversión si el tipo de cambio es cero (0.00)",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return null;
    }
    let tipoCambio = dataAbono.tipoCambio;
    if (data.monedaId != target.value) {
      if (target.value == "D") {
        const total = totalSaldo / tipoCambio;
        setTotalSaldo(Funciones.RedondearNumero(total, 2));
      }
      if (target.value == "S") {
        const total = totalSaldo * tipoCambio;
        setTotalSaldo(Funciones.RedondearNumero(total, 2));
      }
    } else {
      if (target.value == "S") {
        const total = totalSaldo * tipoCambio;
        setTotalSaldo(Funciones.RedondearNumero(total, 2));
      }
      if (target.value == "D") {
        const total = totalSaldo / tipoCambio;
        setTotalSaldo(Funciones.RedondearNumero(total, 2));
      }
    }
    setDataAbono((prevState) => ({
      ...prevState,
      monedaId: target.value,
    }));
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General
  //Abonos
  const Abono = async (modo = "agregar") => {
    if (modo == "agregar") {
      setHabilitarCampo(true);
      let tipoCambio = await GetPorIdTipoCambio(moment().format("yyyy-MM-DD"));
      let ultimoId = dataDetalle[dataDetalle.length - 1];
      setDetalleId(ultimoId.abonoId);
      setDataAbono({
        abonoId: ultimoId.abonoId + 1,
        empresaId: data.empresaId,
        proveedorId: data.proveedorId,
        tipoDocumentoId: data.tipoDocumentoId,
        serie: data.serie,
        numero: data.numero,
        fecha: moment().format("yyyy-MM-DD"),
        concepto: "AMORTIZACION DE LA DEUDA",
        monedaId: data.monedaId,
        tipoCambio: tipoCambio,
        monto: data.saldo,
        montoPEN: 0,
        montoUSD: 0,
        documentoCompraId:
          data.tipoDocumentoId + "-" + data.serie + "-" + data.numero,
        tipoPagoId: "EF",
        cuentaCorrienteId: null,
        numeroOperacion: "",
      });
      setTotalSaldo(data.saldo);
      document.getElementById("fechaAbono").focus();
    } else {
      setHabilitarCampo(false);
      setDataAbono([]);
      setTotalSaldo(0);
    }
  };
  //Abonos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (dataAbono.monto == 0) {
      return [false, "No se ha ingresado ningún monto"];
    }
    if (dataAbono.tipoCambio == 0) {
      return [false, "No se ha ingresado ningún tipo de cambio"];
    }
    if (dataAbono.monto > totalSaldo) {
      return [false, "El monto ingresado es mayor al saldo"];
    }
    return [true, ""];
  };
  const CargarDetalle = async (abonoId) => {
    const result = await ApiMasy.get(
      `/api/Finanzas/AbonoCompra/${data.id}/${abonoId}`
    );
    setHabilitarCampo(false);
    setDataAbono(result.data.data);
  };
  const AgregarAbonoDetalle = async () => {
    let resultado = await ValidarDetalle();
    if (resultado[0]) {
      const montoPEN = dataAbono.monedaId === "S" ? dataAbono.monto : 0;
      const montoUSD = dataAbono.monedaId === "D" ? dataAbono.monto : 0;
      const result = await ApiMasy.post(`/api/Finanzas/AbonoCompra/`, {
        ...dataAbono,
        montoPEN: montoPEN,
        montoUSD: montoUSD,
      });
      if (result.status == 201) {
        toast.success(String(result.data.messages[0].textos), {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setDetalleId(detalleId + 1);
        Abono("cancelar");
      } else {
        toast.error(String("error"), {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error(resultado[1], {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    await GetPorId(data.id);
  };
  const EliminarDetalle = async (abonoId) => {
    let permiso = await GetIsPermitido(data.id, abonoId, 2);
    if (permiso) {
      const result = await ApiMasy.delete(
        `/api/Finanzas/AbonoCompra/${data.id}/${abonoId}`
      );
      toast.success(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      await GetPorId(data.id);
    }
  };
  //#endregion

  //#region API
  const TablasAbono = async () => {
    const result = await ApiMasy(`/api/Finanzas/AbonoCompra/FormularioTablas`);
    setDataMoneda(result.data.data.monedas);
    setDataCtacte(
      result.data.data.cuentasCorrientes.map((res) => ({
        cuentaCorrienteDescripcion:
          res.numero +
          " | " +
          res.entidadBancariaNombre +
          " |  " +
          "[" +
          res.monedaId +
          "/.]",
        ...res,
      }))
    );
    setDataTipoPago(result.data.data.tiposPago);
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
      return 0;
    } else {
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
      return result.data.data.precioVenta;
    }
  };
  const GetIsPermitido = async (compraId, abonoId, accion) => {
    const result = await ApiMasy.get(
      `/api/Finanzas/AbonoCompra/IsPermitido?accion=${accion}&compraId=${compraId}&abonoId=${abonoId}`
    );
    if (!result.data.data) {
      toast.error(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    if (accion == 0) {
      setNuevo(result.data.data);
    } else {
      return result.data.data;
    }
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/CuentaPorPagar/${id}`);
    setData(result.data.data);
    setDataDetalle(result.data.data.abonos);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "Item",
      accessor: "abonoId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Fecha",
      accessor: "fecha",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Tipo de Pago",
      accessor: "tipoPagoId",
      Cell: ({ value }) => {
        let comprobante = "";
        switch (value) {
          case "EF":
            comprobante = "EFECTIVO";
            break;
          case "DE":
            comprobante = "DEPÓSITO";
            break;
          case "TR":
            comprobante = "TRANSFERENCIA";
          default:
            comprobante = value;
        }
        return <p>{comprobante}</p>;
      },
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "T.C",
      accessor: "tipoCambio",

      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-5">{value}</p>;
      },
    },
    {
      Header: "Monto",
      accessor: "monto",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-5">{value}</p>;
      },
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Registrar" ? (
            ""
          ) : (
            <>
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-consultar"
                  onClick={() => CargarDetalle(row.values.abonoId)}
                  className="p-0 px-1"
                  title="Click para consultar registro"
                >
                  <FaEye></FaEye>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.abonoId);
                  }}
                  className="p-0 px-1"
                  title="Click para eliminar registro"
                >
                  <FaTrashAlt></FaTrashAlt>
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Finanzas", "CuentaPorPagar"]}
          titulo="Cuentas Por Pagar"
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

          {/*Cabecera*/}
          <div
            className={
              Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
            }
          >
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="tipoDocumentoId" className={Global.LabelStyle}>
                  Tipo Doc.
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
                  autoFocus
                  value={data.tipoDocumentoId ?? ""}
                  disabled={modo == "Registrar" ? false : true}
                  className={
                    modo == "Registrar" ? Global.InputStyle : Global.InputStyle
                  }
                >
                  {dataTipoDoc.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="serie" className={Global.LabelStyle}>
                  Serie
                </label>
                <input
                  type="text"
                  id="serie"
                  name="serie"
                  placeholder="Número"
                  autoComplete="off"
                  maxLength="4"
                  disabled={true}
                  value={data.serie ?? ""}
                  className={Global.InputStyle}
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
                  autoComplete="off"
                  maxLength="10"
                  disabled={true}
                  value={data.numero ?? ""}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="fechaContable" className={Global.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="text"
                  id="fechaContable"
                  name="fechaContable"
                  autoComplete="off"
                  placeholder="fechaContable"
                  disabled={true}
                  value={moment(data.fechaContable).format("DD/MM/YYYY") ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="monedaId" className={Global.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  className={Global.InputStyle}
                  disabled={true}
                  value={data.monedaId ?? ""}
                >
                  {dataMoneda.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="totalSaldo" className={Global.LabelStyle}>
                  Total a Pagar
                </label>
                <input
                  type="text"
                  id="totalSaldo"
                  name="total"
                  autoComplete="off"
                  placeholder="Total a Pagar"
                  disabled={true}
                  value={data.total ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="abonado" className={Global.LabelStyle}>
                  Abonado
                </label>
                <input
                  type="text"
                  id="abonado"
                  name="abonado"
                  autoComplete="off"
                  placeholder="Abonado"
                  disabled={true}
                  value={data.abonado ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="saldo" className={Global.LabelStyle}>
                  Saldo Total
                </label>
                <input
                  type="text"
                  id="saldo"
                  name="saldo"
                  autoComplete="off"
                  placeholder="Saldo Total"
                  disabled={true}
                  value={data.saldo ?? ""}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="observacion" className={Global.LabelStyle}>
                  Observación
                </label>
                <input
                  type="text"
                  id="observacion"
                  name="observacion"
                  autoComplete="off"
                  placeholder="Observación"
                  disabled={true}
                  value={data.observacion ?? ""}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
          {/*Cabecera*/}

          {/*Detalle*/}
          <div
            className={
              Global.ContenedorBasico + Global.FondoContenedor + " mb-3"
            }
          >
            <div className="flex justify-between">
              <p className={Global.Subtitulo + " h-full flex items-center"}>
                Detalles de Abono
              </p>
              {/* Boton */}
              <div className="flex gap-x-2">
                {nuevo && (
                  <BotonBasico
                    botonText="Nuevo"
                    botonClass={Global.BotonAgregar + " !py-1.5 !my-0"}
                    botonIcon={faPlus}
                    click={() => Abono()}
                    containerClass=""
                  />
                )}
                {habilitarCampo && (
                  <BotonBasico
                    botonText="Cancelar"
                    botonClass={Global.BotonEliminar + " !py-1.5 !px-2 !my-0"}
                    botonIcon={faCancel}
                    click={() => Abono("cancelar")}
                    containerClass=""
                  />
                )}
              </div>
              {/* Boton */}
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputTercio}>
                <label htmlFor="abonoId" className={Global.LabelStyle}>
                  Abono N°
                </label>
                <input
                  type="text"
                  id="abonoId"
                  name="abonoId"
                  autoComplete="off"
                  placeholder="Abono Número"
                  disabled={true}
                  value={dataAbono.abonoId ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputTercio}>
                <label htmlFor="fecha" className={Global.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="date"
                  id="fechaAbono"
                  name="fecha"
                  autoComplete="off"
                  disabled={!habilitarCampo ? true : ""}
                  value={moment(dataAbono.fecha).format("yyyy-MM-DD") ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputStyle}
                />
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
                  disabled={!habilitarCampo ? true : ""}
                  value={dataAbono.tipoCambio ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputBoton}
                />
                <button
                  id="consultarTipoCambio"
                  disabled={!habilitarCampo ? true : ""}
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                  onClick={() => {
                    GetPorIdTipoCambio(dataAbono.fecha);
                  }}
                >
                  <FaUndoAlt></FaUndoAlt>
                </button>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputMitad}>
                <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
                  Tipo Pago
                </label>
                <select
                  id="tipoPagoId"
                  name="tipoPagoId"
                  disabled={!habilitarCampo ? true : ""}
                  value={dataAbono.tipoPagoId ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputStyle}
                >
                  {dataTipoPago.map((map) => (
                    <option key={map.valor} value={map.valor}>
                      {map.texto}
                    </option>
                  ))}
                </select>
              </div>
              {dataAbono.tipoPagoId == "TR" || dataAbono.tipoPagoId == "DE" ? (
                <>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="cuentaCorrienteId"
                      className={Global.LabelStyle}
                    >
                      Cta. Cte.
                    </label>
                    <select
                      id="cuentaCorrienteId"
                      name="cuentaCorrienteId"
                      disabled={!habilitarCampo ? true : ""}
                      value={dataAbono.cuentaCorrienteId ?? ""}
                      onChange={ValidarDataAbono}
                      className={Global.InputStyle}
                    >
                      {dataCtacte.map((map) => (
                        <option
                          key={map.cuentaCorrienteDescripcion}
                          value={map.cuentaCorrienteDescripcion}
                        >
                          {map.cuentaCorrienteDescripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div
                className={
                  dataAbono.tipoPagoId == "TR" || dataAbono.tipoPagoId == "DE"
                    ? Global.InputMitad
                    : Global.InputFull
                }
              >
                <label htmlFor="numeroOperacion" className={Global.LabelStyle}>
                  N° Operación
                </label>
                <input
                  type="text"
                  id="numeroOperacion"
                  name="numeroOperacion"
                  placeholder="N° Operación"
                  autoComplete="off"
                  disabled={!habilitarCampo ? true : ""}
                  value={dataAbono.numeroOperacion ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="monedaId" className={Global.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  onChange={CalcularTotal}
                  className={Global.InputStyle}
                  disabled={
                    !habilitarCampo || dataAbono.tipoCambio == 0 ? true : ""
                  }
                  value={dataAbono.monedaId ?? ""}
                >
                  {dataMoneda.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="total" className={Global.LabelStyle}>
                  Total A Pagar
                </label>
                <input
                  type="text"
                  id="total"
                  name="total"
                  autoComplete="off"
                  placeholder="Total A PAgar"
                  disabled={true}
                  value={totalSaldo ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="monto" className={Global.LabelStyle}>
                  Monto a Abonar
                </label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  autoComplete="off"
                  placeholder="Monto"
                  min={0}
                  disabled={!habilitarCampo ? true : ""}
                  value={dataAbono.monto ?? ""}
                  onChange={ValidarDataAbono}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="concepto" className={Global.LabelStyle}>
                Concepto
              </label>
              <input
                type="text"
                id="concepto"
                name="concepto"
                autoComplete="off"
                placeholder="Concepto"
                disabled={!habilitarCampo ? true : ""}
                value={dataAbono.concepto ?? ""}
                onChange={ValidarDataAbono}
                className={
                  !habilitarCampo ? Global.InputStyle : Global.InputBoton
                }
              />
              <button
                id="enviarDetalle"
                hidden={!habilitarCampo ? true : ""}
                className={Global.BotonBuscar + Global.BotonPrimary}
                onClick={(e) => AgregarAbonoDetalle(e)}
              >
                <FaPlus></FaPlus>
              </button>
            </div>
          </div>
          {/*Detalle*/}

          {/* Tabla Detalle */}
          <TablaStyle>
            <TableBasic
              columnas={columnas}
              datos={dataDetalle}
              estilos={[
                "",
                "",
                "",
                "border ",
                "",
                "border border-b-0",
                "border",
              ]}
            />
          </TablaStyle>
          {/* Tabla Detalle */}
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;