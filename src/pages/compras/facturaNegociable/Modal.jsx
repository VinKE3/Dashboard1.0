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
  const [dataTipoComp, setDataTipoComp] = useState([]);
  const [dataTipoPag, setDataTipoPag] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataConcepto, setDataConcepto] = useState([]);
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
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (Object.entries(dataConcepto).length > 0) {
      setModalConcepto(false);
    }
  }, [dataConcepto]);
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
      ActualizarImportesTotales();
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
    setDataConcepto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataConcepto).length > 0) {
      if (data.monedaId != dataConcepto.monedaId) {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "compra",
          {
            precioCompra: dataConcepto.saldo,
            precioVenta1: dataConcepto.abono,
            precioVenta2: dataConcepto.abono,
            precioVenta3: dataConcepto.abono,
            precioVenta4: dataConcepto.abono,
          },
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataConcepto({
            ...dataConcepto,
            saldo: model.precioCompra,
            abono: model.precioVenta1,
          });
        }
      } else {
        setDataConcepto({
          ...dataConcepto,
          saldo: dataConcepto.saldo,
          abono: dataConcepto.abono,
        });
      }
    }
  };
  //Concepto
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataConcepto).length == 0) {
      return [false, "Seleccione un Producto"];
    }
    //Valida montos
    if (Funciones.IsNumeroValido(dataConcepto.abono, false) != "") {
      document.getElementById("abono").focus();
      return [
        false,
        "Abono: " + Funciones.IsNumeroValido(dataConcepto.abono, false),
      ];
    }
    //Valida montos

    return [true, ""];
  };
  const AgregarDetalleArticulo = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0] > 0) {
      //Si tiene detalleId entonces modifica registro
      if (dataConcepto.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.documentoCompraId == dataConcepto.documentoCompraId) {
            return {
              detalleId: dataConcepto.detalleId,
              documentoCompraId: dataConcepto.documentoCompraId,
              concepto: dataConcepto.concepto,
              documentoCompraFechaEmision:
                dataConcepto.documentoCompraFechaEmision,
              abono: dataConcepto.abono,
              saldo: dataConcepto.saldo,
              ordenCompraRelacionada: dataConcepto.ordenCompraRelacionada,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.documentoCompraId === dataConcepto.id;
        });
        if (model == undefined) {
          setDataDetalle((prevState) => [
            ...prevState,
            {
              detalleId: detalleId,
              documentoCompraId: dataConcepto.id,
              concepto: dataConcepto.concepto,
              documentoCompraFechaEmision: dataConcepto.fechaEmision,
              abono: dataConcepto.abono,
              saldo: dataConcepto.saldo,
              ordenCompraRelacionada: dataConcepto.numeroDocumento,
            },
          ]);
          //Anidar Documento de referencia
          let conceptos = "";
          //Valida si contiene datos para mapearlo
          if (data.documentoReferencia == "") {
            conceptos = [
              ...data.documentoReferencia,
              dataConcepto.numeroDocumento,
            ];
          } else {
            conceptos = [
              ...[data.documentoReferencia],
              dataConcepto.numeroDocumento,
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
      setDataConcepto([]);
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
    setDataConcepto(dataDetalle.find((map) => map.documentoCompraId === id));
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
  const ActualizarImportesTotales = async () => {
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
      `/api/Compra/FacturaNegociable/FormularioTablas`
    );
    setDataPlazos(result.data.data.plazos);
    setDataTipoComp(result.data.data.tiposCompra);
    setDataTipoPag(result.data.data.tiposPago);
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
                  id="boton-modificar"
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
            menu={["Compra", "FacturaNegociable"]}
            titulo="Factura Negociable"
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
                <div className={Global.InputFull}>
                  <label htmlFor="numeroFactura" className={Global.LabelStyle}>
                    N° Factura
                  </label>
                  <input
                    type="text"
                    id="numeroFactura"
                    name="numeroFactura"
                    autoComplete="off"
                    placeholder="N° Factura"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.numeroFactura ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
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
                    maxLength="2"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
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
                    maxLength="2"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
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
                    maxLength="2"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
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
                    readOnly={true}
                    value={data.proveedorNumeroDocumentoIdentidad ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle + Global.Disabled}
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
                    readOnly={true}
                    value={data.proveedorNombre ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton + Global.Disabled}
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
                        readOnly={modo == "Consultar" ? true : false}
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
                    autoComplete="off"
                    placeholder="Lugar Giro"
                    readOnly={modo == "Consultar" ? true : false}
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
                    {dataTipoComp.map((map) => (
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
                    {dataTipoPag.map((map) => (
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
                    autoComplete="off"
                    placeholder="Documento Referencia"
                    readOnly={true}
                    value={data.documentoReferencia ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle + Global.Disabled}
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
                    maxLength="8"
                    placeholder="Tipo de Cambio"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
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
                    readOnly={modo == "Consultar" ? true : false}
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
                    autoComplete="off"
                    readOnly={true}
                    placeholder="Busar Concepto"
                    value={dataConcepto.concepto ?? ""}
                    onChange={ValidarDataConcepto}
                    className={Global.InputBoton + Global.Disabled}
                  />
                  <button
                    id="consultar"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => {
                      setDataConcepto([]);
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
                    autoComplete="off"
                    placeholder="Saldo"
                    readOnly={true}
                    value={dataConcepto.saldo ?? ""}
                    onChange={ValidarDataConcepto}
                    className={Global.InputStyle + Global.Disabled}
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
                    autoComplete="off"
                    placeholder="Abono"
                    readOnly={modo == "Consultar" ? true : false}
                    value={dataConcepto.abono ?? ""}
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
                    onClick={(e) => AgregarDetalleArticulo(e)}
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
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataConcepto}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
