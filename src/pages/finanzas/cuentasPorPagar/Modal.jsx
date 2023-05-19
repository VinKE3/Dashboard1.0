import React, { useState } from "react";
import styled from "styled-components";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { useEffect } from "react";
import moment from "moment";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaPlus, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import Mensajes from "../../../components/Mensajes";
import ApiMasy from "../../../api/ApiMasy";
import TableBasic from "../../../components/tablas/TableBasic";
import { toast } from "react-toastify";
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
  const [data, setData] = useState(objeto);
  const [totalAbono, setTotalAbono] = useState(objeto.saldo);
  const [dataDetalle, setDetalle] = useState(objeto.abonos);
  const [abono, setAbono] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [tipoPagos, setTipoPagos] = useState([]);
  const [cuentasCorrientes, setCuentasCorrientes] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [abonoId, setabonoId] = useState(dataDetalle.length + 1);
  const [habilitarNuevo, setHabilitarNuevo] = useState(false);
  const [habilitarCampo, setHabilitarCampo] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
    GetPorId(data.id);
    BotonNuevo(0, data.id);
  }, []);

  useEffect(() => {
    if (habilitarNuevo) {
      NuevoAbono();
    }
  }, [data.saldo]);

  useEffect(() => {
    abono;
    console.log(abono);
  }, [abono]);

  useEffect(() => {
    if (refrescar) {
      totalAbono;
      setRefrescar(false);
    }
  }, [refrescar]);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setAbono((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const HandleConvertirPrecio = async ({ target }) => {
    //?validaciones
    if (abono.tipoCambio == 0) {
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
    let tipoCambio = abono.tipoCambio;
    if (data.monedaId != target.value) {
      if (target.value == "D") {
        const total = totalAbono / tipoCambio;
        setTotalAbono(Funciones.RedondearNumero(total, 2));
      }
      if (target.value == "S") {
        const total = totalAbono * tipoCambio;
        setTotalAbono(Funciones.RedondearNumero(total, 2));
      }
      setRefrescar(true);
    } else {
      if (target.value == "S") {
        const total = totalAbono * tipoCambio;
        setTotalAbono(Funciones.RedondearNumero(total, 2));
      }
      if (target.value == "D") {
        const total = totalAbono / tipoCambio;
        setTotalAbono(Funciones.RedondearNumero(total, 2));
      }
      setRefrescar(true);
    }
    setAbono((prevState) => ({
      ...prevState,
      monedaId: target.value,
    }));
  };

  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };

  const BotonNuevo = async (abonoId, accion = "0") => {
    let permiso = await GetIsPermitido(accion, abonoId);
    if (permiso) {
      setHabilitarNuevo(permiso);
    } else {
      setHabilitarNuevo(false);
    }
  };

  const NuevoAbono = async () => {
    setHabilitarCampo(true);
    await GetPorIdTipoCambio(moment().format("yyyy-MM-DD"));
    setAbono({
      empresaId: data.empresaId,
      proveedorId: data.proveedorId,
      tipoDocumentoId: data.tipoDocumentoId,
      serie: data.serie,
      numero: data.numero,
      abonoId: abonoId,
      fecha: moment().format("yyyy-MM-DD"),
      concepto: "AMORTIZACION DE LA DEUDA",
      monedaId: data.monedaId,
      tipoCambio: 0,
      monto: data.saldo,
      montoPEN: 0,
      montoUSD: 0,
      documentoCompraId:
        data.tipoDocumentoId + "-" + data.serie + "-" + data.numero,
      tipoPagoId: "EF",
      cuentaCorrienteId: null,
      numeroOperacion: "",
    });
  };

  const ValidarDetalle = async () => {
    if (abono.monto == 0) {
      return [false, "No se ha ingresado ningún monto"];
    }
    if (abono.tipoCambio == 0) {
      return [false, "No se ha ingresado ningún tipo de cambio"];
    }
    if (abono.monto > totalAbono) {
      return [false, "El monto ingresado es mayor al saldo"];
    }
    return [true, ""];
  };

  const CargarDetalle = async (abonoId) => {
    const result = await ApiMasy.get(
      `/api/Finanzas/AbonoCompra/${data.id}/${abonoId}`
    );
    setAbono(result.data.data);
  };

  const EliminarDetalle = async (abonoId, accion = "2") => {
    let permiso = await GetIsPermitido(accion, abonoId);
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
      let i = 1;
      let nuevoDetalle = dataDetalle.filter((item) => item.abonoId != abonoId);
      if (nuevoDetalle.length > 0) {
        setDetalle(
          nuevoDetalle.map((item) => {
            return {
              ...item,
              abonoId: i++,
            };
          })
        );
        setabonoId(i);
      } else {
        setabonoId(nuevoDetalle.length + 1);
        setDetalle(nuevoDetalle);
      }
      setRefrescar(true);
    }
    await GetPorId(data.id);
  };

  const AgregarAbonoDetalle = async () => {
    let resultado = await ValidarDetalle();
    if (resultado[0]) {
      const montoPEN = abono.monedaId === "S" ? abono.monto : 0;
      const montoUSD = abono.monedaId === "D" ? abono.monto : 0;
      const result = await ApiMasy.post(`/api/Finanzas/AbonoCompra/`, {
        ...abono,
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
        setDetalle((prevState) => [
          ...prevState,
          {
            abonoId: abonoId,
            fecha: abono.fecha,
            concepto: abono.concepto,
            monedaId: abono.monedaId,
            tipoCambio: abono.tipoCambio,
            monto: Funciones.RedondearNumero(abono.monto, 2),
            montoPEN: abono.montoPEN,
            montoUSD: abono.montoUSD,
            tipoPagoId: abono.tipoPagoId,
            documentoCompraId: abono.documentoCompraId,
          },
        ]);
        setabonoId(abonoId + 1);
        setRefrescar(true);
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

  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/CuentaPorPagar/${id}`);
    setData(result.data.data);
  };

  const GetIsPermitido = async (accion, abonoId) => {
    const result = await ApiMasy.get(
      `/api/Finanzas/AbonoCompra/IsPermitido?accion=${accion}&compraId=${data.id}&abonoId=${abonoId}`
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
      return false;
    } else {
      return true;
    }
  };

  const GetTablas = async () => {
    const result = await ApiMasy(`/api/Finanzas/AbonoCompra/FormularioTablas`);
    let model = result.data.data.cuentasCorrientes.map((res) => ({
      cuentaCorrienteDescripcion:
        res.numero +
        " | " +
        res.entidadBancariaNombre +
        " |  " +
        "[" +
        res.monedaId +
        "/.]",
      ...res,
    }));
    setMonedas(result.data.data.monedas);
    setCuentasCorrientes(model);
    setTipoPagos(result.data.data.tiposPago);
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
      setAbono({
        ...abono,
        tipoCambio: 0,
      });
    } else {
      setAbono((prevState) => ({
        ...prevState,
        tipoCambio: result.data.data.precioCompra,
      }));
      setTipoMensaje(-1);
      setMensaje([]);
    }
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "abonoId",
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
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Tipo Cambio",
      accessor: "tipoCambio",
    },
    {
      Header: "Monto",
      accessor: "monto",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Registrar" ? (
            ""
          ) : (
            <>
              {setHabilitarNuevo ? (
                <></>
              ) : (
                <div className={Global.TablaBotonModificar}>
                  <button
                    id="boton-modificar"
                    onClick={() => CargarDetalle(row.values.abonoId)}
                    className="p-0 px-1"
                    title="Click para modificar registro"
                  >
                    <FaPen></FaPen>
                  </button>
                </div>
              )}

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
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Finanzas", "CuentaPorPagar"]}
      titulo="Cuentas Por Pagar"
      tamañoModal={[Global.ModalGrande, Global.Form]}
    >
      {tipoMensaje > 0 && (
        <Mensajes
          tipoMensaje={tipoMensaje}
          mensaje={mensaje}
          Click={() => OcultarMensajes()}
        />
      )}
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="tipoDocumento" className={Global.LabelStyle}>
              Tipo Documento
            </label>
            <input
              type="text"
              id="tipoDocumento"
              name="tipoDocumento"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              value={data.tipoDocumento.descripcion ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Serie
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              autoComplete="off"
              placeholder="Serie"
              disabled={true}
              value={data.serie ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              autoComplete="off"
              placeholder="numero"
              disabled={true}
              value={data.numero ?? ""}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
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
            <input
              type="text"
              id="monedaId"
              name="monedaId"
              autoComplete="off"
              placeholder="monedaId"
              disabled={true}
              value={data.monedaId ?? ""}
              className={Global.InputStyle}
            />
          </div>
        </div>

        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="total" className={Global.LabelStyle}>
              Total a Pagar
            </label>
            <input
              type="text"
              id="total"
              name="total"
              autoComplete="off"
              placeholder="total"
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
              placeholder="abonado"
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
              placeholder="saldo"
              disabled={true}
              value={data.saldo ?? ""}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.InputFull}>
          <label htmlFor="observacion" className={Global.LabelStyle}>
            Observación
          </label>
          <input
            type="text"
            id="observacion"
            name="observacion"
            autoComplete="off"
            placeholder="observacion"
            disabled={true}
            value={data.observacion ?? ""}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div
        className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
      >
        <div className={Global.ContenedorInputs}>
          {habilitarNuevo ? (
            <BotonBasico
              botonText="Nuevo"
              botonClass={Global.BotonAgregar}
              botonIcon={faPlus}
              click={() => NuevoAbono()}
              containerClass=""
            />
          ) : (
            <></>
          )}
        </div>
        {habilitarCampo ? (
          <>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="abonoId" className={Global.LabelStyle}>
                  Abono N°
                </label>
                <input
                  type="text"
                  id="abonoId"
                  name="abonoId"
                  autoComplete="off"
                  onChange={ValidarData}
                  placeholder="abonoId"
                  disabled={true}
                  value={abono.abonoId ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="fecha" className={Global.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  maxLength="2"
                  autoComplete="off"
                  value={moment(abono.fecha).format("yyyy-MM-DD") ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                  T. Cambio
                </label>
                <input
                  type="number"
                  id="tipoCambio"
                  name="tipoCambio"
                  maxLength="8"
                  autoComplete="off"
                  value={abono.tipoCambio ?? ""}
                  onChange={ValidarData}
                  className={Global.InputBoton}
                />
                <button
                  id="consultarTipoCambio"
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    GetPorIdTipoCambio(abono.fecha);
                  }}
                >
                  <FaUndoAlt></FaUndoAlt>
                </button>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
                  Tipo Pago
                </label>
                <select
                  id="tipoPagoId"
                  name="tipoPagoId"
                  onChange={ValidarData}
                  className={Global.InputStyle}
                  value={abono.tipoPagoId ?? ""}
                >
                  {tipoPagos.map((item, index) => (
                    <option key={index} value={item.valor}>
                      {item.texto}
                    </option>
                  ))}
                </select>
              </div>
              {abono.tipoPagoId == "TR" || abono.tipoPagoId == "DE" ? (
                <>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="cuentaCorrienteId"
                      className={Global.LabelStyle}
                    >
                      Cuenta Corriente
                    </label>
                    <select
                      id="cuentaCorrienteId"
                      name="cuentaCorrienteId"
                      onChange={ValidarData}
                      className={Global.InputStyle}
                      value={abono.cuentaCorrienteId ?? ""}
                    >
                      {cuentasCorrientes.map((item, index) => (
                        <option
                          key={index}
                          value={item.cuentaCorrienteDescripcion}
                        >
                          {item.cuentaCorrienteDescripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className={Global.InputFull}>
                <label htmlFor="numeroOperacion" className={Global.LabelStyle}>
                  Numero Operacion
                </label>
                <input
                  type="text"
                  id="numeroOperacion"
                  name="numeroOperacion"
                  autoComplete="off"
                  value={abono.numeroOperacion ?? ""}
                  onChange={ValidarData}
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
                  onChange={HandleConvertirPrecio}
                  className={Global.InputStyle}
                  disabled={abono.tipoCambio > 0 ? false : true}
                  value={abono.monedaId ?? ""}
                >
                  {monedas.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.descripcion}
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
                  placeholder="Total"
                  disabled={true}
                  onChange={ValidarData}
                  value={totalAbono ?? ""}
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
                  value={abono.monto ?? ""}
                  onChange={ValidarData}
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
                value={abono.concepto ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="enviarDetalle"
                className={Global.BotonBuscar + Global.BotonPrimary}
                onClick={(e) => AgregarAbonoDetalle(e)}
              >
                <FaPlus></FaPlus>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="abonoId" className={Global.LabelStyle}>
                  Abono N°
                </label>
                <input
                  type="text"
                  id="abonoId"
                  name="abonoId"
                  autoComplete="off"
                  onChange={ValidarData}
                  placeholder="abonoId"
                  disabled={true}
                  value={abono.abonoId ?? ""}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="fecha" className={Global.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  maxLength="2"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={moment(abono.fecha).format("yyyy-MM-DD") ?? ""}
                  onChange={ValidarData}
                  className={
                    modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                  }
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                  T. Cambio
                </label>
                <input
                  type="number"
                  id="tipoCambio"
                  name="tipoCambio"
                  maxLength="8"
                  autoComplete="off"
                  disabled={modo == "Consultar" ? true : false}
                  value={abono.tipoCambio ?? ""}
                  onChange={ValidarData}
                  className={
                    modo == "Consultar" ? Global.InputBoton : Global.InputBoton
                  }
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
                  Tipo Pago
                </label>
                <select
                  id="tipoPagoId"
                  name="tipoPagoId"
                  onChange={ValidarData}
                  className={
                    modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                  }
                  disabled={modo == "Consultar" ? true : false}
                  value={abono.tipoPagoId ?? ""}
                >
                  {tipoPagos.map((item, index) => (
                    <option key={index} value={item.valor}>
                      {item.texto}
                    </option>
                  ))}
                </select>
              </div>
              {abono.tipoPagoId == "TRANSFERENCIA" ||
              abono.tipoPagoId == "DEPOSITO" ? (
                <>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="cuentaCorrienteId"
                      className={
                        modo == "Consultar"
                          ? Global.InputStyle
                          : Global.InputStyle
                      }
                    >
                      Cuenta Corriente
                    </label>
                    <select
                      id="cuentaCorrienteId"
                      name="cuentaCorrienteId"
                      onChange={ValidarData}
                      className={Global.InputStyle}
                      value={abono.cuentaCorrienteId ?? ""}
                    >
                      {cuentasCorrientes.map((item, index) => (
                        <option
                          key={index}
                          value={item.cuentaCorrienteDescripcion}
                        >
                          {item.cuentaCorrienteDescripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className={Global.InputFull}>
                <label htmlFor="numeroOperacion" className={Global.LabelStyle}>
                  Numero Operacion
                </label>
                <input
                  type="text"
                  id="numeroOperacion"
                  name="numeroOperacion"
                  autoComplete="off"
                  value={abono.numeroOperacion ?? ""}
                  disabled={modo == "Consultar" ? true : false}
                  onChange={ValidarData}
                  className={
                    modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                  }
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
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={
                    modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                  }
                  value={abono.monedaId ?? ""}
                >
                  {monedas.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="totalAbono"
                  className={
                    modo == "Consultar"
                      ? Global.LabelStyle + Global.Disabled
                      : Global.LabelStyle
                  }
                >
                  Total A Pagar
                </label>
                <input
                  type="text"
                  id="totalAbono"
                  name="totalAbono"
                  autoComplete="off"
                  placeholder="totalAbono"
                  disabled={true}
                  value={totalAbono ?? ""}
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
                  value={abono.monto ?? ""}
                  onChange={ValidarData}
                  className={
                    modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                  }
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
                value={abono.concepto ?? ""}
                onChange={ValidarData}
                className={
                  modo == "Consultar" ? Global.InputStyle : Global.InputStyle
                }
              />
            </div>
          </>
        )}
      </div>
      {/* Tabla Detalle */}
      <TablaStyle>
        <TableBasic
          columnas={columnas}
          datos={dataDetalle}
          estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
        />
      </TablaStyle>
      {/* Tabla Detalle */}
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
