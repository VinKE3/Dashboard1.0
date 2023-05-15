import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import * as Funciones from "../../../components/Funciones";
import FiltroConcepto from "../../../components/filtros/FiltroConcepto";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 100px;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    text-align: center;
    width: 110px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [plazos, setPlazos] = useState([]);
  const [tiposCompra, setTiposCompra] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [checkVarios, setCheckVarios] = useState(false);
  const [modalProv, setModalProv] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [plazoSeleccionado, setPlazoSeleccionado] = useState(0);
  const [fechaVencimientoOriginal, setFechaVencimientoOriginal] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [modalConcepto, setModalConcepto] = useState(false);
  const [dataConcepto, setDataConcepto] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [usedIds, setUsedIds] = useState([]);
  //#endregion

  //#region useEffect

  useEffect(() => {
    data, console.log("data", data);
  }, [data]);

  useEffect(() => {
    dataDetalle, console.log("dataDetalle", dataDetalle);
  }, [dataDetalle]);

  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorDireccion: dataProveedor.proveedorDireccion ?? "",
      });
    }
  }, [dataProveedor]);

  useEffect(() => {
    if (modo != "Registrar") {
      GetPorId(data.proveedorId);
    } else {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    GetTablas();
  }, []);

  useEffect(() => {
    if (plazoSeleccionado > 0) {
      const fechaVencimientoNueva = moment(fechaVencimientoOriginal)
        .add(plazoSeleccionado, "days")
        .format("yyyy-MM-DD");
      setData({ ...data, fechaVencimiento: fechaVencimientoNueva });
    } else {
      setData({ ...data, fechaVencimiento: fechaVencimientoOriginal });
    }
  }, [plazoSeleccionado]);

  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);

  useEffect(() => {
    if (Object.entries(dataConcepto).length > 0) {
      setModalConcepto(false);
    }
  }, [dataConcepto]);

  useEffect(() => {
    if (refrescar) {
      setDataConcepto([]);
      SumarDetalles();
      setRefrescar(false);
    }
  }, [refrescar]);

  useEffect(() => {
    if (!modalConcepto) {
      if (Object.entries(dataConcepto).length > 0) {
        if (
          data.monedaId != dataConcepto.monedaId &&
          dataConcepto.Id != "000000"
        ) {
          ConvertirPreciosAMoneda(dataConcepto, data.monedaId, data.tipoCambio);
        }
      }
    }
  }, [modalConcepto]);

  //#endregion

  //#region Funciones
  //?Data General
  const ValidarData = async ({ target }) => {
    if (target.name != "varios") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    } else {
      if (target.checked) {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "000000",
          proveedorNumeroDocumentoIdentidad: "00000000000",
          proveedorDireccion: null,
          proveedorNombre: "CLIENTES VARIOS",
        }));
      } else {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "",
          proveedorNumeroDocumentoIdentidad: "",
          proveedorDireccion: "",
          proveedorNombre: "",
        }));
      }
    }
  };
  const handlePlazoChange = (event) => {
    const plazo = parseInt(event.target.value);

    setData((prevData) => ({
      ...prevData,
      plazo: plazo,
    }));
    const today = moment().format("YYYY-MM-DD");
    const newFechaVencimiento = moment(today)
      .add(plazo, "days")
      .format("YYYY-MM-DD");
    setData((prevData) => ({
      ...prevData,
      fechaVencimiento: newFechaVencimiento,
    }));
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };

  //?Concepto
  const ValidarDataConcepto = async ({ target }) => {
    setDataConcepto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ConvertirPreciosAMoneda = async (
    data,
    monedaId,
    tipoCambio,
    precisionRedondeo = 2
  ) => {
    if (monedaId != "D" && monedaId != "S") {
      toast.error("No es posible hacer la conversión a la moneda ingresada", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return null;
    }
    if (tipoCambio == 0) {
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
    Swal.fire({
      title:
        "La deuda esta en una moneda distinta a la letra de cambio, El sistema calculara el monto de la deuda de acuerdo al tipo de cambio",
      icon: "warning",
    }).then(() => {
      let saldo = 0;
      let abono = 0;
      if (monedaId == "D") {
        saldo = Funciones.RedondearNumero(
          data.saldo / tipoCambio,
          precisionRedondeo
        );
        abono = Funciones.RedondearNumero(
          data.abono / tipoCambio,
          precisionRedondeo
        );
      } else {
        saldo = Funciones.RedondearNumero(
          data.saldo * tipoCambio,
          precisionRedondeo
        );
        abono = Funciones.RedondearNumero(
          data.abono * tipoCambio,
          precisionRedondeo
        );
      }
      setDataConcepto({ ...dataConcepto, saldo: saldo, abono: abono });
    });
  };

  //?Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataConcepto).length == 0) {
      return [false, "Seleccione un concepto"];
    } else {
      return [true, ""];
    }
  };
  const EnviarDetalle = async (e) => {
    let resultado = await ValidarDetalle();
    if (resultado[0] > 0) {
      if (dataConcepto.detalleId > -1) {
        let dataDetalleModificado = dataDetalle.map((map) => {
          if (map.detalleId == dataConcepto.detalleId) {
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
        setDataDetalle(dataDetalleModificado);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.concepto === dataConcepto.concepto;
        });
        if (model == undefined) {
          const newId = getNextAvailableId();
          setDataDetalle((prevState) => [
            ...prevState,
            {
              detalleId: newId,
              documentoCompraId: dataConcepto.id,
              concepto: dataConcepto.concepto,
              documentoCompraFechaEmision: dataConcepto.fechaEmision,
              abono: dataConcepto.abono,
              saldo: dataConcepto.saldo,
              ordenCompraRelacionada: dataConcepto.numeroDocumento,
            },
          ]);
          setUsedIds([...usedIds, newId]);
          // //?anidar Documento de referencia
          //Anidar Facturas
          let conceptos = "";
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
          //Anidar Facturas
          setData((prevState) => ({
            ...prevState,
            documentoReferencia: conceptos.toString(),
          }));
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
              CargarDetalle(model.detalleId);
            }
          });
        }
      }
      setDataConcepto({});
      setRefrescar(true);
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
    setDataConcepto(dataDetalle.find((map) => map.detalleId === id));
  };
  const EliminarDetalle = async (id) => {
    if (id != "") {
      setDataDetalle(dataDetalle.filter((map) => map.detalleId !== id));
      resetDetalleIds();
      SumarDetalles();
      const Eliminar = dataDetalle.filter((map) => map.detalleId !== id);
      const NuevoDocumento = Eliminar.map((map) => {
        return map.ordenCompraRelacionada;
      });
      setData((prevState) => ({
        ...prevState,
        documentoReferencia: NuevoDocumento.toString(),
      }));
    }
  };

  const getNextAvailableId = () => {
    let newId = 1;
    const usedIds = dataDetalle.map((detalle) => detalle.detalleId);
    while (usedIds.includes(newId)) {
      newId++;
    }
    return newId;
  };
  const resetDetalleIds = () => {
    setDataDetalle((prevState) =>
      prevState.map((detalle, index) => ({
        ...detalle,
        detalleId: index + 1,
      }))
    );
    setDetalleId(1);
  };
  const SumarDetalles = async () => {
    let total = 0;
    if (dataDetalle.length === 1) {
      total = dataDetalle[0].abono;
    } else if (dataDetalle.length > 1) {
      total = dataDetalle.reduce((sum, detalle) => sum + detalle.abono, 0);
    }
    setData((prevState) => ({
      ...prevState,
      total: Funciones.RedondearNumero(total, 2),
    }));
  };

  //?Tablas
  const GetTablas = async () => {
    const result = await ApiMasy(`/api/Compra/Cheque/FormularioTablas`);
    setPlazos(result.data.data.plazos);
    setTiposCompra(result.data.data.tiposCompra);
    setTiposPago(result.data.data.tiposPago);
    setMonedas(result.data.data.monedas);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/${id}`);
    setDataProveedor({
      proveedorId: result.data.data.id,
      proveedorNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      proveedorDireccion: result.data.data.direccionPrincipal,
      proveedorNombre: result.data.data.nombre,
    });
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
      setTipoMensaje(-1);
      setMensaje([]);
    }
  };

  //?Modales
  const AbrirFiltroConcepto = async (e) => {
    e.preventDefault();
    setModalConcepto(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "detalleId",
    },
    {
      Header: "Emisión",
      accessor: "documentoCompraFechaEmision",
      Cell: ({ row }) =>
        moment(row.values.documentoCompraFechaEmision).format("DD/MM/YYYY"),
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Saldo",
      accessor: "saldo",
      Cell: ({ value }) => {
        return <p className="text-right">{value}</p>;
      },
    },
    {
      Header: "Importe",
      accessor: "abono",
      Cell: ({ value }) => {
        return <p className="text-right">{value}</p>;
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
                  onClick={() => CargarDetalle(row.values.detalleId)}
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
                    EliminarDetalle(row.values.detalleId);
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

  //#region Funciones Modal
  const AbrirFiltroProveedor = async (e) => {
    e.preventDefault();
    setModalProv(true);
  };

  //#endregion
  return (
    <>
      {Object.entries(monedas).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Compra", "Cheque"]}
            titulo="Cheque"
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
            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-3"
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="numeroFactura" className={Global.LabelStyle}>
                    N° De Letra
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
            </div>

            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-3"
              }
            >
              <div className={Global.ContenedorInputs}>
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
                    value={dataProveedor.proveedorNombre ?? ""}
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
                    onClick={(e) => AbrirFiltroProveedor(e)}
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
                          ValidarData(e);
                        }}
                        checked={checkVarios ? true : ""}
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={Global.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
                <div className={Global.Input25pct}>
                  <label htmlFor="plazo" className={Global.LabelStyle}>
                    Plazo
                  </label>
                  <select
                    id="plazo"
                    name="plazo"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.plazo ?? ""}
                    onChange={handlePlazoChange}
                    className={Global.InputStyle}
                  >
                    {plazos.map((item, index) => (
                      <option key={index} value={item.valor}>
                        {item.texto}
                      </option>
                    ))}
                  </select>
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
                <div className={Global.Input25pct}>
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
                    {tiposCompra.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
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
                    disabled={true}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                    value={data.tipoPagoId ?? ""}
                  >
                    {tiposPago.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {monedas.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.descripcion}
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
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.tipoCambio ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarTipoCambio"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => {
                      e.preventDefault();
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
              <div className={Global.ContenedorInputs}>
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
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.documentoReferencia ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>

            <div className={Global.ContenedorBasico + Global.FondoContenedor}>
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
                    placeholder="Concepto"
                    value={dataConcepto.concepto ?? ""}
                    onChange={ValidarDataConcepto}
                    className={Global.InputBoton}
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
                <div className={Global.Input25pct}>
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
                <div className={Global.Input25pct}>
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
                    className={Global.InputBoton}
                  />
                  <button
                    id="enviarDetalle"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => EnviarDetalle(e)}
                  >
                    <FaPlus></FaPlus>
                  </button>
                </div>
              </div>

              {/* Tabla */}
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
              {/* Tabla */}
            </div>
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
      <ToastContainer />
    </>
  );
};

export default Modal;