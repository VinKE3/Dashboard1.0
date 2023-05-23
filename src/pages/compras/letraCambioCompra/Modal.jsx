import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroConcepto from "../../../components/filtros/FiltroConcepto";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
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
  & th:nth-child(3) {
    width: 90px;
    text-align: center;
  }
  & th:nth-child(5),
  & th:nth-child(6) {
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
  const [dataPlazos, setDataPlazos] = useState([]);
  const [dataTipoCompra, setDataTipoCompra] = useState([]);
  const [dataTipoPago, setDataTipoPago] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalProv, setModalProv] = useState(false);
  const [modalConcepto, setModalConcepto] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorNombre: dataProveedor.proveedorNombre,
        lugarGiro: dataProveedor.proveedorDireccion,
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (Object.entries(dataCabecera).length > 0) {
      setModalConcepto(false);
    }
  }, [dataCabecera]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (!modalConcepto) {
      //Calculos de precios según la moneda al cerrar el modal
      ConvertirPrecio();
    }
  }, [modalConcepto]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));

    if (target.name == "plazo") {
      let fecha = await FechaVencimiento(target.value);
      setData((prevState) => ({
        ...prevState,
        fechaVencimiento: fecha,
      }));
    }
  };
  const ProveedorVarios = async ({ target }) => {
    if (target.checked) {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: dataGlobal.proveedor.id,
        proveedorNumeroDocumentoIdentidad:
          dataGlobal.proveedor.numeroDocumentoIdentidad,
        proveedorNombre: dataGlobal.proveedor.nombre,
        proveedorDireccion: dataGlobal.proveedor.direccionPrincipal,
      }));
    } else {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: "",
        proveedorNumeroDocumentoIdentidad: "",
        proveedorNombre: "",
        proveedorDireccion: "",
        ordenesCompraRelacionadas: [],
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
  const FechaVencimiento = async (valor) => {
    let model = dataPlazos.find((map) => map.valor == valor);
    let fecha = moment(moment().format("YYYY-MM-DD"))
      .add(model.valor, "days")
      .format("YYYY-MM-DD");
    return fecha;
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Concepto
  const ValidarDataConcepto = async ({ target }) => {
    setDataCabecera((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataCabecera).length > 0) {
      if (data.monedaId != dataCabecera.monedaId) {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "compra",
          {
            precioCompra: dataCabecera.saldo,
            precioVenta1: dataCabecera.abono,
            precioVenta2: dataCabecera.abono,
            precioVenta3: dataCabecera.abono,
            precioVenta4: dataCabecera.abono,
          },
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataCabecera({
            ...dataCabecera,
            saldo: model.precioCompra,
            abono: model.precioVenta1,
          });
        }
      } else {
        setDataCabecera({
          ...dataCabecera,
          saldo: dataCabecera.saldo,
          abono: dataCabecera.abono,
        });
      }
    }
  };
  //Concepto
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      return [false, "Seleccione un Producto"];
    }
    //Valida montos
    if (Funciones.IsNumeroValido(dataCabecera.abono, false) != "") {
      document.getElementById("abono").focus();
      return [
        false,
        "Abono: " + Funciones.IsNumeroValido(dataCabecera.abono, false),
      ];
    }
    //Valida montos

    if (dataCabecera.abono > dataCabecera.saldo) {
      document.getElementById("abono").focus();
      return [false, "Abono: El importe a abonar no puede ser mayor al saldo."];
    }
    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0] > 0) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.documentoCompraId == dataCabecera.documentoCompraId) {
            return {
              detalleId: dataCabecera.detalleId,
              documentoCompraId: dataCabecera.documentoCompraId,
              concepto: dataCabecera.concepto,
              documentoCompraFechaEmision:
                dataCabecera.documentoCompraFechaEmision,
              abono: Number(dataCabecera.abono),
              saldo: dataCabecera.saldo,
              ordenCompraRelacionada: dataCabecera.ordenCompraRelacionada,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.documentoCompraId === dataCabecera.id;
        });
        if (model == undefined) {
          setDataDetalle((prevState) => [
            ...prevState,
            {
              detalleId: detalleId,
              documentoCompraId: dataCabecera.id,
              concepto: dataCabecera.concepto,
              documentoCompraFechaEmision: dataCabecera.fechaEmision,
              abono: Number(dataCabecera.abono),
              saldo: dataCabecera.saldo,
              ordenCompraRelacionada: dataCabecera.numeroDocumento,
            },
          ]);
          //Anidar Documento de referencia
          let conceptos = "";
          //Valida si contiene datos para mapearlo
          if (data.documentoReferencia == "") {
            conceptos = [
              ...data.documentoReferencia,
              dataCabecera.numeroDocumento,
            ];
          } else {
            conceptos = [
              ...[data.documentoReferencia],
              dataCabecera.numeroDocumento,
            ];
          }
          setData((prevState) => ({
            ...prevState,
            documentoReferencia: conceptos.toString(),
          }));
          //Anidar Documento de referencia

          setDetalleId(detalleId + 1);
          setRefrescar(true);
        } else {
          Swal.fire({
            title: "Aviso del sistema",
            text:
              "El Concepto " +
              model.concepto +
              " ya está registrado en el detalle, ¿Desea modificar los datos de venta del artículo?",
            icon: "error",
            iconColor: "#F7BF3A",
            showCancelButton: true,
            color: "#fff",
            background: "#1a1a2e",
            confirmButtonColor: "#eea508",
            confirmButtonText: "Aceptar",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
          }).then((res) => {
            if (res.isConfirmed) {
              CargarDetalle(model.documentoCompraId);
            }
          });
        }
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera([]);
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
  };
  const CargarDetalle = async (id) => {
    setDataCabecera(dataDetalle.find((map) => map.documentoCompraId === id));
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter(
      (map) => map.documentoCompraId !== id
    );
    let nuevoOrdenCompra = nuevoDetalle.map((map) => {
      return map.ordenCompraRelacionada;
    });
    if (nuevoDetalle.length > 0) {
      setDataDetalle(
        nuevoDetalle.map((map) => {
          return {
            ...map,
            detalleId: i++,
          };
        })
      );
      setDetalleId(i);
      setData((prevState) => ({
        ...prevState,
        documentoReferencia: nuevoOrdenCompra.toString(),
      }));
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      setDataDetalle(nuevoDetalle);
      setData((prevState) => ({
        ...prevState,
        documentoReferencia: "",
      }));
    }
    setRefrescar(true);
  };
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.abono;
    }, 0);

    setData((prevState) => ({
      ...prevState,
      total: Funciones.RedondearNumero(importeTotal, 2),
    }));
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy(
      `/api/Compra/LetraCambioCompra/FormularioTablas`
    );
    setDataPlazos(result.data.data.plazos);
    setDataTipoCompra(result.data.data.tiposCompra);
    setDataTipoPago(result.data.data.tiposPago);
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
        tipoCambio: result.data.data.precioCompra,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaEmision).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioCompra,
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
      OcultarMensajes();
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroProveedor = async () => {
    setModalProv(true);
  };
  const AbrirFiltroConcepto = async () => {
    setModalConcepto(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "documentoCompraId",
      accessor: "documentoCompraId",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Emisión",
      accessor: "documentoCompraFechaEmision",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Saldo",
      accessor: "saldo",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Importe",
      accessor: "abono",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Consultar" ? (
            ""
          ) : (
            <>
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={() => CargarDetalle(row.values.documentoCompraId)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.documentoCompraId);
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

  //#region Render
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Compra", "LetraCambioCompra"]}
            titulo="Letra de Cambio"
            tamañoModal={[Global.ModalFull, Global.Form]}
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
                <div className={Global.InputFull}>
                  <label htmlFor="numeroLetra" className={Global.LabelStyle}>
                    N° Letra
                  </label>
                  <input
                    type="text"
                    id="numeroLetra"
                    name="numeroLetra"
                    placeholder="N° Letra"
                    autoComplete="off"
                    autoFocus
                    disabled={modo == "Registrar" ? false : true}
                    value={data.numeroLetra ?? ""}
                    onChange={ValidarData}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="plazo" className={Global.LabelStyle}>
                    Plazo
                  </label>
                  <select
                    id="plazo"
                    name="plazo"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.plazo ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {dataPlazos.map((map) => (
                      <option key={map.valor} value={map.valor}>
                        {map.texto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaRegistro" className={Global.LabelStyle}>
                    Registro
                  </label>
                  <input
                    type="date"
                    id="fechaRegistro"
                    name="fechaRegistro"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={
                      moment(data.fechaRegistro).format("yyyy-MM-DD") ?? ""
                    }
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
                    onChange={ValidarData}
                    onBlur={FechaEmision}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaVencimiento"
                    className={Global.LabelStyle}
                  >
                    Vencimiento
                  </label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={
                      moment(data.fechaVencimiento).format("yyyy-MM-DD") ?? ""
                    }
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="proveedorNumeroDocumentoIdentidad"
                    className={Global.LabelStyle}
                  >
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="proveedorNumeroDocumentoIdentidad"
                    name="proveedorNumeroDocumentoIdentidad"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    disabled={true}
                    value={data.proveedorNumeroDocumentoIdentidad ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="proveedorNombre"
                    className={Global.LabelStyle}
                  >
                    Proveedor
                  </label>
                  <input
                    type="text"
                    id="proveedorNombre"
                    name="proveedorNombre"
                    placeholder="Proveedor"
                    autoComplete="off"
                    disabled={true}
                    value={data.proveedorNombre ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultar"
                    className={
                      Global.BotonBuscar +
                      Global.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar" ? true : false}
                    disabled={checkVarios ? true : false}
                    onClick={() => AbrirFiltroProveedor()}
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
                          ProveedorVarios(e);
                        }}
                        checked={checkVarios ? true : ""}
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={Global.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="lugarGiro" className={Global.LabelStyle}>
                    L. Giro
                  </label>
                  <input
                    type="text"
                    id="lugarGiro"
                    name="lugarGiro"
                    placeholder="Lugar Giro"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.lugarGiro ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="tipoCompraId" className={Global.LabelStyle}>
                    T. Compra
                  </label>
                  <select
                    id="tipoCompraId"
                    name="tipoCompraId"
                    disabled={true}
                    value={data.tipoCompraId ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {dataTipoCompra.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
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
                    disabled={true}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                    value={data.tipoPagoId ?? ""}
                  >
                    {dataTipoPago.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="documentoReferencia"
                    className={Global.LabelStyle}
                  >
                    Documento Referencia
                  </label>
                  <input
                    type="text"
                    id="documentoReferencia"
                    name="documentoReferencia"
                    placeholder="Documento Referencia"
                    autoComplete="off"
                    disabled={true}
                    value={data.documentoReferencia ?? ""}
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
                    disabled={modo == "Consultar" ? true : false}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                    value={data.monedaId ?? ""}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputFull}>
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
                      modo != "Consultar"
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="total" className={Global.LabelStyle}>
                    Total a Pagar
                  </label>
                  <input
                    type="text"
                    id="total"
                    name="total"
                    autoComplete="off"
                    value={data.total ?? ""}
                    disabled={modo == "Consultar" ? true : false}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorBasico}>
                <p className={Global.Subtitulo}>Aval Permanente</p>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="avalNombre" className={Global.LabelStyle}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="avalNombre"
                      name="avalNombre"
                      placeholder="Nombre Aval"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
                      value={data.avalNombre ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="avalNumeroDocumentoIdentidad"
                      className={Global.LabelStyle}
                    >
                      D.N.I
                    </label>
                    <input
                      type="text"
                      id="avalNumeroDocumentoIdentidad"
                      name="avalNumeroDocumentoIdentidad"
                      placeholder="N° Documento Aval"
                      autoComplete="off"
                      maxLength={14}
                      disabled={modo == "Consultar" ? true : false}
                      value={data.avalNumeroDocumentoIdentidad ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="avalDomicilio"
                      className={Global.LabelStyle}
                    >
                      Domicilio
                    </label>
                    <input
                      type="text"
                      id="avalDomicilio"
                      name="avalDomicilio"
                      placeholder="Domicilio Aval"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
                      value={data.avalDomicilio ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="avalTelefono" className={Global.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="avalTelefono"
                      name="avalTelefono"
                      placeholder="Teléfono Aval"
                      autoComplete="off"
                      maxLength={15}
                      disabled={modo == "Consultar" ? true : false}
                      value={data.avalTelefono ?? ""}
                      onChange={ValidarData}
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
                    placeholder="Observación"
                    autoComplete="off"
                    value={data.observacion ?? ""}
                    disabled={modo == "Consultar" ? true : false}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="concepto" className={Global.LabelStyle}>
                    Concepto
                  </label>
                  <input
                    type="text"
                    id="concepto"
                    name="concepto"
                    placeholder="Buscar Concepto"
                    autoComplete="off"
                    value={dataCabecera.concepto ?? ""}
                    onChange={ValidarDataConcepto}
                    disabled={true}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultar"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => {
                      setDataCabecera([]);
                      AbrirFiltroConcepto(e);
                    }}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="saldo" className={Global.LabelStyle}>
                    Saldo
                  </label>
                  <input
                    type="number"
                    id="saldo"
                    name="saldo"
                    placeholder="Saldo"
                    autoComplete="off"
                    min={0}
                    disabled={true}
                    value={dataCabecera.saldo ?? ""}
                    onChange={ValidarDataConcepto}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="abono" className={Global.LabelStyle}>
                    Abonar
                  </label>
                  <input
                    type="number"
                    id="abono"
                    name="abono"
                    placeholder="Abono"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar" ? true : false}
                    value={dataCabecera.abono ?? ""}
                    onChange={ValidarDataConcepto}
                    className={
                      modo != "Consultar"
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  <button
                    id="enviarDetalle"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => AgregarDetalle(e)}
                  >
                    <FaPlus></FaPlus>
                  </button>
                </div>
              </div>
            </div>
            {/* Detalles */}

            {/* Tabla Detalle */}
            <TablaStyle>
              <TableBasic
                columnas={columnas}
                datos={dataDetalle}
                estilos={[
                  "",
                  "",
                  "",
                  "border",
                  "",
                  "border border-b-0",
                  "border",
                ]}
              />
            </TablaStyle>
            {/* Tabla Detalle */}
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor
          setModal={setModalProv}
          setObjeto={setDataProveedor}
          foco={document.getElementById("lugarGiro")}
        />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataCabecera}
          foco={document.getElementById("abono")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
