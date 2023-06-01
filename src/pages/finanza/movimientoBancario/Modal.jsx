import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import FiltroProveedor from "../../../components/filtro/FiltroProveedor";
import FiltroConcepto from "../../../components/filtro/FiltroConcepto";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

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
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataMoneda, setdataMoneda] = useState([]);
  const [dataTipoMovimiento, setDataTipoMovimiento] = useState([]);
  const [dataTipoOperacion, setDataTipoOperacion] = useState([]);
  const [dataTipoBenef, setDataTipoBenef] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalConcepto, setModalConcepto] = useState(false);
  //Modales de Ayuda
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      setData({
        ...data,
        clienteProveedorId: dataCliente.clienteId,
        clienteProveedorNombre: dataCliente.clienteNombre,
      });
    }
  }, [dataCliente]);
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        clienteProveedorId: dataProveedor.proveedorId,
        clienteProveedorNombre: dataProveedor.proveedorNombre,
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (Object.entries(dataCabecera).length > 0) {
      setModalConcepto(false);
    }
  }, [dataCabecera]);
  useEffect(() => {
    setData({
      ...data,
      detalles: dataDetalle.map((map) => {
        return {
          detalleId: map.detalleId,
          documentoVentaCompraId: map.documentoVentaCompraId,
          documentoVentaCompraFechaEmision:
            map.documentoVentaCompraFechaEmision,
          concepto: map.concepto,
          abono: Number(map.abono),
          saldo: map.saldo,
        };
      }),
    });
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
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
    if (target.name == "tieneCuentaDestino" || target.name == "isCierreCaja") {
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

    if (target.name == "plazo") {
      let fecha = await FechaVencimiento(target.value);
      setData((prevState) => ({
        ...prevState,
        fechaVencimiento: fecha,
      }));
    }

    if (target.name == "tipoMovimientoId") {
      let model = dataTipoBenef.find(
        (map) => map.tipoMovimientoId == target.value
      );
      setData((prevData) => ({
        ...prevData,
        tipoBeneficiarioId: model.tipoBeneficiarioId,
        clienteProveedorId: null,
        clienteProveedorNombre: "",
        concepto: "",
        documentoReferencia: "",
      }));
      setDataDetalle([]);
      setDataCabecera([]);
      setRefrescar(true);
    }

    if (target.name == "tipoBeneficiarioId") {
      setData((prevData) => ({
        ...prevData,
        clienteProveedorId: null,
        clienteProveedorNombre: "",
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
  const CuentaDestino = async (valor) => {
    if (!valor) {
      setData((prevState) => ({
        ...prevState,
        cuentaDestinoId: null,
      }));
    }
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
          toast.info("Abonar ha sido convertido al tipo de cambio actual", {
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
      document.getElementById("consultarConcepto").focus();
      return [false, "Seleccione un Item"];
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
          if (
            map.documentoVentaCompraId == dataCabecera.documentoVentaCompraId
          ) {
            return {
              detalleId: dataCabecera.detalleId,
              documentoVentaCompraId: dataCabecera.documentoVentaCompraId,
              documentoVentaCompraFechaEmision: dataCabecera.fechaEmision,
              concepto: dataCabecera.concepto,
              abono: Number(dataCabecera.abono),
              saldo: dataCabecera.saldo,
              //Para concatenaciones
              documentoReferencia: dataCabecera.documentoRelacionado,
              numeroDocumento: dataCabecera.numeroDocumento,
              //Para concatenaciones
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.documentoVentaCompraId === dataCabecera.id;
        });
        if (model == undefined) {
          setDataDetalle((prevState) => [
            ...prevState,
            {
              detalleId: detalleId,
              documentoVentaCompraId: dataCabecera.id,
              documentoVentaCompraFechaEmision: dataCabecera.fechaEmision,
              concepto: dataCabecera.concepto,
              abono: Number(dataCabecera.abono),
              saldo: dataCabecera.saldo,
              //Para concatenaciones
              documentoReferencia: dataCabecera.documentoRelacionado,
              numeroDocumento: dataCabecera.numeroDocumento,
              //Para concatenaciones
            },
          ]);

          //Concepto
          let nuevoConcepto = "";
          let texto =
            data.tipoMovimientoId == "EG" ? ["PAGO DE "] : ["COBRO DE "];

          //Valida si contiene datos para mapearlo
          if (data.concepto == "") {
            nuevoConcepto = [...data.concepto, dataCabecera.numeroDocumento];
          } else {
            nuevoConcepto = [...[data.concepto], dataCabecera.numeroDocumento];
          }
          //Concepto

          //Documento de referencia
          let nuevoDocumentoReferencia = data.documentoReferencia;
          //Valida si contiene datos para mapearlo
          if (
            dataCabecera.id.includes("LC") ||
            dataCabecera.id.includes("CH") ||
            dataCabecera.id.includes("CF")
          ) {
            if (nuevoDocumentoReferencia == "") {
              nuevoDocumentoReferencia = [
                ...data.documentoReferencia,
                dataCabecera.documentoRelacionado,
              ];
            } else {
              nuevoDocumentoReferencia = [
                ...[data.documentoReferencia],
                dataCabecera.documentoRelacionado,
              ];
            }
          }
          //Documento de referencia

          //Concatena texto a los conceptos
          let conceptoConcatenado =
            data.concepto == "" || data.concepto.length == 1
              ? texto + nuevoConcepto.toString()
              : nuevoConcepto.toString();
          //Concatena texto a los conceptos

          //Concepto y Documento Referencia
          setData((prevState) => ({
            ...prevState,
            concepto: conceptoConcatenado,
            documentoReferencia: nuevoDocumentoReferencia.toString(),
          }));
          //Concepto y Documento Referencia

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
              CargarDetalle(model.documentoVentaCompraId);
            }
          });
        }
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera([]);
      document.getElementById("consultarConcepto").focus();
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
  const CargarDetalle = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        setDataCabecera(
          dataDetalle.find((map) => map.documentoVentaCompraId === id)
        );
      } else {
        setDataCabecera(
          dataDetalle.find((map) => map.documentoVentaCompraId === value)
        );
      }
      document.getElementById("abono").focus();
    }
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    //Filtra el detalle
    let nuevoDetalle = dataDetalle.filter(
      (map) => map.documentoVentaCompraId !== id
    );
    //Filtra el detalle

    //Concepto
    let nuevoConcepto = nuevoDetalle.map((map) => {
      return map.numeroDocumento;
    });
    let texto = data.tipoMovimientoId == "EG" ? ["PAGO DE "] : ["COBRO DE "];

    //Concatena texto a los conceptos
    let conceptoConcatenado = texto + nuevoConcepto.toString();
    //Concatena texto a los conceptos
    //Concepto

    //Documento Referencia
    let nuevoDocumentoReferencia = nuevoDetalle.map((map) => {
      return map.documentoReferencia;
    });
    //Documento Referencia

    if (nuevoDetalle.length > 0) {
      //Detalle
      setDataDetalle(
        nuevoDetalle.map((map) => {
          return {
            ...map,
            detalleId: i++,
          };
        })
      );
      setDetalleId(i);
      //Detalle

      //Concepto y Documento Referencia
      setData((prevState) => ({
        ...prevState,
        concepto: conceptoConcatenado,
        documentoReferencia: nuevoDocumentoReferencia.toString(),
      }));
      //Concepto y Documento Referencia
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      //Detalle
      setDataDetalle(nuevoDetalle);
      //Detalle

      //Concepto y Documento Referencia
      setData((prevState) => ({
        ...prevState,
        concepto: "",
        documentoReferencia: "",
      }));
      //Concepto y Documento Referencia
    }
    setRefrescar(true);
  };
  const ActualizarTotales = async (foco = "") => {
    //Obtiene los values
    let monto = 0;
    if (foco != "") {
      monto = Number(document.getElementById("monto").value);
    } else {
      monto = dataDetalle.reduce((i, map) => {
        return i + map.abono;
      }, 0);
    }

    let porcentajeITF = Number(document.getElementById("porcentajeITF").value);
    let montoInteres = Number(document.getElementById("montoInteres").value);
    let montoITF = Number(document.getElementById("montoITF").value);
    let total = Number(document.getElementById("total").value);
    //Obtiene los values

    if (foco == "porcentajeITF" || foco == "") {
      if (!isNaN(porcentajeITF) && !isNaN(montoITF) && !isNaN(monto)) {
        montoITF = Funciones.RedondearNumero(monto * (porcentajeITF / 100), 2);
        total = Funciones.RedondearNumero(montoITF + montoInteres + monto, 2);
      }
    }

    if (foco == "montoInteres" || foco == "monto") {
      if (!isNaN(montoITF) && !isNaN(montoInteres) && !isNaN(monto)) {
        montoITF = Funciones.RedondearNumero(monto * (porcentajeITF / 100), 2);
        total = Funciones.RedondearNumero(montoITF + montoInteres + monto, 2);
      }
    }

    setData((prevState) => ({
      ...prevState,
      porcentajeITF: porcentajeITF,
      montoITF: Funciones.RedondearNumero(montoITF, 2),
      montoInteres: Funciones.RedondearNumero(montoInteres, 2),
      monto: Funciones.RedondearNumero(monto, 2),
      total: Funciones.RedondearNumero(total, 2),
    }));
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Finanzas/MovimientoBancario/FormularioTablas`
    );
    setDataCtacte(
      result.data.data.cuentasCorrientes.map((res) => ({
        id: res.cuentaCorrienteId,
        descripcion:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
    setDataTipoMovimiento(result.data.data.tiposMovimiento);
    setDataTipoBenef(result.data.data.tiposBeneficiario);
    setDataTipoOperacion(result.data.data.tiposOperacion);
    setdataMoneda([
      { abreviatura: "S/", descripcion: "SOLES", id: "S" },
      {
        abreviatura: "US$",
        descripcion: "DÓLARES AMERICANOS",
        id: "D",
      },
    ]);
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

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroProveedor = async () => {
    setModalProveedor(true);
  };
  const AbrirFiltroConcepto = async () => {
    setModalConcepto(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "documentoVentaCompraId",
      accessor: "documentoVentaCompraId",
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
                  onClick={() =>
                    CargarDetalle(row.values.documentoVentaCompraId)
                  }
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
                    EliminarDetalle(row.values.documentoVentaCompraId);
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
      {Object.entries(dataCtacte).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Finanzas", "MovimientoBancario"]}
            titulo="Movimiento Bancario"
            cerrar={false}
            foco={document.getElementById("tablaMovimientoBancario")}
            tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
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
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="cuentaCorrienteId"
                      className={Global.LabelStyle}
                    >
                      Cuenta
                    </label>
                    <select
                      id="cuentaCorrienteId"
                      name="cuentaCorrienteId"
                      value={data.cuentaCorrienteId ?? ""}
                      onChange={ValidarData}
                      disabled={true}
                      className={Global.InputStyle}
                      // className={
                      //   data.tipoMovimientoId == "IN"
                      //     ? Global.InputBoton
                      //     : Global.InputStyle
                      // }
                    >
                      {dataCtacte.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* {data.tipoMovimientoId == "IN" ? (
                    <div className={Global.Input + "w-24"}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <Checkbox
                          inputId="isCierreCaja"
                          name="isCierreCaja"
                          disabled={modo == "Consultar"}
                          onChange={(e) => {
                            ValidarData(e);
                          }}
                          checked={data.isCierreCaja ? true : ""}
                        ></Checkbox>
                      </div>
                      <label
                        htmlFor="isCierreCaja"
                        className={Global.LabelCheckStyle}
                      >
                        Caja
                      </label>
                    </div>
                  ) : (
                    <></>
                  )} */}
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    autoFocus
                    value={data.monedaId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar"}
                    className={Global.InputStyle}
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
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    Fecha Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    onBlur={() => {
                      FechaEmision();
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoCambio" className={Global.LabelStyle}>
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
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="tipoMovimientoId"
                    className={Global.LabelStyle}
                  >
                    Movimiento
                  </label>
                  <select
                    id="tipoMovimientoId"
                    name="tipoMovimientoId"
                    disabled={modo == "Consultar"}
                    value={data.tipoMovimientoId ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {dataTipoMovimiento.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="tipoOperacionId"
                    className={Global.LabelStyle}
                  >
                    Tipo
                  </label>
                  <select
                    id="tipoOperacionId"
                    name="tipoOperacionId"
                    disabled={modo == "Consultar"}
                    value={data.tipoOperacionId ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {dataTipoOperacion.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    data.tieneCuentaDestino
                      ? Global.InputTercio
                      : Global.Input66pct
                  }
                >
                  <label
                    htmlFor="numeroOperacion"
                    className={Global.LabelStyle}
                  >
                    Número
                  </label>
                  <input
                    type="text"
                    id="numeroOperacion"
                    name="numeroOperacion"
                    placeholder="Número"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.numeroOperacion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div
                  className={
                    data.tieneCuentaDestino
                      ? Global.InputFull
                      : Global.Input + "w-12"
                  }
                >
                  <div className={Global.Input + "w-36"}>
                    <div className={Global.CheckStyle}>
                      <Checkbox
                        inputId="tieneCuentaDestino"
                        name="tieneCuentaDestino"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          ValidarData(e);
                          CuentaDestino(e.target.value);
                        }}
                        checked={data.tieneCuentaDestino ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="tieneCuentaDestino"
                      className={
                        data.tieneCuentaDestino
                          ? Global.LabelCheckStyle + " rounded-r-none "
                          : Global.LabelCheckStyle
                      }
                    >
                      Destino
                    </label>
                  </div>

                  {data.tieneCuentaDestino ? (
                    <div className={Global.InputFull}>
                      <select
                        id="cuentaDestinoId"
                        name="cuentaDestinoId"
                        disabled={modo == "Consultar"}
                        value={data.cuentaDestinoId ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle + Global.Anidado}
                      >
                        <option key={-1} value={""}>
                          --SELECCIONAR--
                        </option>
                        {dataCtacte.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <div className={Global.InputTercio}>
                    <label
                      htmlFor="tipoBeneficiarioId"
                      className={Global.LabelStyle}
                    >
                      Nombres
                    </label>
                    <select
                      id="tipoBeneficiarioId"
                      name="tipoBeneficiarioId"
                      disabled={modo == "Consultar"}
                      value={data.tipoBeneficiarioId ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    >
                      {dataTipoBenef
                        .filter(
                          (model) =>
                            model.tipoMovimientoId == data.tipoMovimientoId
                        )
                        .map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>

                  {data.tipoBeneficiarioId != "INC" &&
                  data.tipoBeneficiarioId != "EGC" &&
                  data.tipoBeneficiarioId != "EGP" &&
                  data.tipoBeneficiarioId != "EGQ" ? (
                    <input
                      type="text"
                      id="clienteProveedorNombre"
                      name="clienteProveedorNombre"
                      placeholder="Nombre"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.clienteProveedorNombre ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle + Global.Anidado}
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        id="clienteProveedorNombre"
                        name="clienteProveedorNombre"
                        placeholder="Buscar"
                        autoComplete="off"
                        disabled={true}
                        value={data.clienteProveedorNombre ?? ""}
                        onChange={ValidarData}
                        className={Global.InputBoton}
                      />
                      <button
                        id="consultarProveedor"
                        className={Global.BotonBuscar + Global.BotonPrimary}
                        hidden={modo == "Consultar"}
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() =>
                          data.tipoBeneficiarioId == "INC" ||
                          data.tipoBeneficiarioId == "EGC"
                            ? AbrirFiltroCliente()
                            : AbrirFiltroProveedor()
                        }
                      >
                        <FaSearch></FaSearch>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="concepto" className={Global.LabelStyle}>
                    Concepto
                  </label>
                  <input
                    type="text"
                    id="concepto"
                    name="concepto"
                    placeholder="Concepto"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.concepto ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              {data.tipoMovimientoId == "EG" ? (
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
                      placeholder="Documento Referencia"
                      autoComplete="off"
                      disabled={true}
                      value={data.documentoReferencia ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className={Global.ContenedorBasico + Global.FondoContenedor}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="porcentajeITF"
                      className={Global.LabelStyle}
                    >
                      ITF %
                    </label>
                    <input
                      type="number"
                      id="porcentajeITF"
                      name="porcentajeITF"
                      placeholder="ITF %"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={data.porcentajeITF ?? ""}
                      onChange={(e) => {
                        ValidarData(e);
                        ActualizarTotales(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="montoITF" className={Global.LabelStyle}>
                      Monto ITF
                    </label>
                    <input
                      type="number"
                      id="montoITF"
                      name="montoITF"
                      placeholder="Monto ITF"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={data.montoITF ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="montoInteres" className={Global.LabelStyle}>
                      Interes
                    </label>
                    <input
                      type="number"
                      id="montoInteres"
                      name="montoInteres"
                      placeholder="Interes"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={data.montoInteres ?? ""}
                      onChange={(e) => {
                        ValidarData(e);
                        ActualizarTotales(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="monto" className={Global.LabelStyle}>
                      Monto
                    </label>
                    <input
                      type="number"
                      id="monto"
                      name="monto"
                      placeholder="Monto"
                      autoComplete="off"
                      min={0}
                      disabled={
                        Object.entries(dataDetalle).length > 0 ||
                        modo == "Consultar"
                          ? true
                          : ""
                      }
                      value={data.monto ?? ""}
                      onChange={(e) => {
                        ValidarData(e);
                        ActualizarTotales(e.target.name);
                      }}
                      className={
                        Object.entries(dataDetalle).length > 0
                          ? Global.InputStyle
                          : Global.InputStyle
                      }
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="total" className={Global.LabelStyle}>
                      Total
                    </label>
                    <input
                      type="number"
                      id="total"
                      name="total"
                      placeholder="Total"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={data.total ?? ""}
                      onChange={(e) => {
                        ValidarData(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            {modo != "Consultar" && (
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
                      disabled={true}
                      onChange={ValidarDataConcepto}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultarConcepto"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
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
                      disabled={modo == "Consultar"}
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
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={(e) => AgregarDetalle(e)}
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                  "border ",
                  "",
                  "border border-b-0",
                  "border",
                ]}
                DobleClick={(e) => CargarDetalle(e, true)}
              />
            </TablaStyle>
            {/* Tabla Detalle */}
          </ModalCrud>
        </>
      )}
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("concepto")}
        />
      )}
      {modalProveedor && (
        <FiltroProveedor
          setModal={setModalProveedor}
          setObjeto={setDataProveedor}
          foco={document.getElementById("concepto")}
        />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataCabecera}
          modo={data.tipoMovimientoId}
          foco={document.getElementById("abono")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
