import React, { useState, useEffect, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCotizacion from "../../../components/filtros/FiltroCotizacion";
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
import "react-toastify/dist/ReactToastify.css";
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
    display: none;
  }
  & tbody td:nth-child(2) {
    display: none;
  }
  & th:nth-child(3) {
    width: 120px;
  }
  & th:nth-child(5),
  & th:nth-child(6) {
    width: 90px;
    text-align: center;
  }

  & th:nth-child(7),
  & th:nth-child(8) {
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
  //Data General
  //Tablas
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataSeries, setDataSeries] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  const [dataMotivoNota, setDataMotivoNota] = useState([]);
  const [dataIgv, setDataIgv] = useState([]);
  const [dataRetencion, setDataRetencion] = useState([]);
  const [dataDetraccion, setDataDetraccion] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataDocRef, setDataDocRef] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataClienteDirec, setDataClienteDirec] = useState([]);
  const [dataCotizacion, setDataCotizacion] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalCotizacion, setModalCotizacion] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      setDataClienteDirec(dataCliente.direcciones);
      setData({
        ...data,
        clienteId: dataCliente.clienteId,
        clienteNumeroDocumentoIdentidad:
          dataCliente.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataCliente.clienteNombre,
        clienteDireccionId: dataCliente.clienteDireccionId,
      });
      if (dataCliente.clienteId != "") {
        GetDocReferencia(dataCliente.clienteId);
        setRefrescar(true);
      } else {
        setDataDocRef([]);
        setRefrescar(true);
      }
    }
  }, [dataCliente]);
  useEffect(() => {
    console.log(dataCotizacion);
    if (Object.keys(dataCotizacion).length > 0) {
      //Cabecera
      setData({
        ...data,
        personalId: dataCotizacion.personalId,
        monedaId: dataCotizacion.monedaId,
        incluyeIGV: dataCotizacion.incluyeIGV,
        porcentajeIGV: dataCotizacion.porcentajeIGV,
        porcentajeRetencion: dataCotizacion.porcentajeRetencion,
        porcentajePercepcion: dataCotizacion.porcentajePercepcion,
        observacion: dataCotizacion.observacion ?? "",
        clienteId: dataCotizacion.clienteId,
        clienteNumeroDocumentoIdentidad:
          dataCotizacion.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataCotizacion.clienteNombre,
        clienteDireccionId: dataCotizacion.clienteDireccionId,
        cotizacionId: dataCotizacion.cotizacionId,
        cotizacion: dataCotizacion.cotizacion,
      });
      GetDireccion(dataCotizacion.clienteId);
      //Añadimos los detalles
      // AgregarDetalleOC();
    } else {
      setData({
        ...data,
        cotizacionId: dataCotizacion.cotizacionId,
        cotizacion: dataCotizacion.cotizacion,
      });
      //Limpia los detalles
      // setDataDetalle([]);
    }
    setRefrescar(true);
  }, [dataCotizacion]);
  useEffect(() => {
    if (Object.entries(dataDetalle).length > 0) {
      setData({ ...data, detalles: dataDetalle });
    }
  }, [dataDetalle]);
  useEffect(() => {
    if (!modalArt) {
      ConvertirPrecio();
    }
  }, [modalArt]);
  useEffect(() => {
    if (refrescar) {
      data;
      dataDetalle;
      dataDocRef;
      ActualizarImportesTotales();
      setDataArt([]);
      setRefrescar(false);
      if (document.getElementById("productos")) {
        document.getElementById("productos").checked = true;
        document
          .getElementById("productos")
          .dispatchEvent(new Event("click", { bubbles: true }));
      }
    }
  }, [refrescar]);

  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    ConsultarCtacte();
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
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
    if (target.name == "porcentajeIGV") {
      setRefrescar(true);
    }

    if (target.name == "tipoCompraId") {
      setData((prevData) => ({
        ...prevData,
        tipoPagoId: "",
      }));
    }

    if (target.name == "tipoPagoId") {
      if (data.tipoCompraId != "CO") {
        let model = dataTipoCobro.find((map) => map.id === target.value);
        let fechaHoy = moment().format("YYYY-MM-DD");
        let nuevaFecha = moment(fechaHoy)
          .add(model.plazo, "days")
          .format("YYYY-MM-DD");
        setData((prevData) => ({
          ...prevData,
          fechaVencimiento: nuevaFecha,
        }));
      }

      if (target.value != "CH" || target.value != "DE") {
        setData((prevState) => ({
          ...prevState,
          numeroOperacion: "",
          cuentaCorrienteId: "",
        }));
      }
    }
  };
  const CambioEmision = async () => {
    toast(
      "Si la fecha de emisión ha sido cambiada, no olvide consultar el tipo de cambio.",
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
  const ValidarVarios = async ({ target }) => {
    if (target.checked) {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "000000",
        clienteNumeroDocumentoIdentidad: "00000000000",
        clienteDireccionId: "",
        clienteNombre: "CLIENTES VARIOS",
      }));
      await GetDireccion("000000");
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteDireccion: "",
        clienteNombre: "",
        ordenesCompraRelacionadas: [],
      }));
      setDataClienteDirec([]);
    }
  };
  const ValidarDataArt = async ({ target }) => {
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataArt([]);
    } else if (target.name == "variosFiltro") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(true);
      setDataArt({
        id: "00000000",
        lineaId: "00",
        subLineaId: "00",
        articuloId: "0000",
        marcaId: 1,
        codigoBarras: "000000",
        descripcion: "",
        stock: "-",
        unidadMedidaId: "07",
        unidadMedidaDescripcion: "UNIDAD",
        cantidad: 0,
        precioUnitario: 0,
        importe: 0,
      });
    } else {
      setDataArt((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ValidarDetalle = async () => {
    if (Object.entries(dataArt).length == 0) {
      return [false, "Seleccione un Producto"];
    } else if (dataArt.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    } else if (dataArt.unidadMedidaDescripcion == undefined) {
      return [false, "La Unidad de Medida no puede estar vacía"];
    } else if (Funciones.IsNumeroValido(dataArt.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataArt.cantidad, false),
      ];
    } else if (Funciones.IsNumeroValido(dataArt.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataArt.precioUnitario, false),
      ];
    } else if (Funciones.IsNumeroValido(dataArt.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataArt.importe, false),
      ];
    } else {
      return [true, ""];
    }
  };
  const CargarDetalle = async (id) => {
    setDataArt(dataDetalle.find((map) => map.detalleId === id));
  };
  const AgregarDetalleArticulo = async () => {
    let resultado = await ValidarDetalle();
    if (resultado[0]) {
      if (dataArt.detalleId > -1) {
        dataDetalle[dataArt.detalleId - 1] = {
          detalleId: dataArt.detalleId,
          id: dataArt.id,
          lineaId: dataArt.lineaId,
          subLineaId: dataArt.subLineaId,
          articuloId: dataArt.articuloId,
          marcaId: dataArt.marcaId,
          codigoBarras: dataArt.codigoBarras,
          descripcion: dataArt.descripcion,
          stock: dataArt.stock,
          unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
          unidadMedidaId: dataArt.unidadMedidaId,
          cantidad: dataArt.cantidad,
          precioUnitario: dataArt.precioUnitario,
          montoIGV: dataArt.montoIGV,
          subTotal: dataArt.subTotal,
          importe: dataArt.importe,
        };
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.articuloId == dataArt.articuloId;
        });
        if (model == undefined) {
          dataDetalle.push({
            detalleId: detalleId,
            id: dataArt.id,
            lineaId: dataArt.lineaId,
            subLineaId: dataArt.subLineaId,
            articuloId: dataArt.articuloId,
            marcaId: dataArt.marcaId,
            codigoBarras: dataArt.codigoBarras,
            descripcion: dataArt.descripcion,
            stock: dataArt.stock,
            unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
            unidadMedidaId: dataArt.unidadMedidaId,
            cantidad: dataArt.cantidad,
            precioUnitario: dataArt.precioUnitario,
            montoIGV: dataArt.montoIGV,
            subTotal: dataArt.subTotal,
            importe: dataArt.importe,
          });
          setDetalleId(detalleId + 1);
          setRefrescar(true);
        } else {
          Swal.fire({
            title: "Aviso del sistema",
            text:
              "El artículo " +
              model.descripcion +
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
  const AgregarDetalleOC = async () => {
    let objetoOC =
      dataOC.ordenesCompraRelacionadas[
        dataOC.ordenesCompraRelacionadas.length - 1
      ].detalles[0];
    let detalleActual = dataDetalle.find((map) => {
      return map.articuloId == objetoOC.articuloId;
    });
    if (detalleActual == undefined) {
      dataDetalle.push({
        detalleId: detalleId,
        id: objetoOC.id,
        lineaId: objetoOC.lineaId,
        subLineaId: objetoOC.subLineaId,
        articuloId: objetoOC.articuloId,
        marcaId: objetoOC.marcaId,
        codigoBarras: objetoOC.codigoBarras,
        descripcion: objetoOC.descripcion,
        stock: objetoOC.stock,
        unidadMedidaDescripcion: objetoOC.unidadMedidaDescripcion,
        unidadMedidaId: objetoOC.unidadMedidaId,
        cantidad: objetoOC.cantidad,
        precioUnitario: objetoOC.precioUnitario,
        montoIGV: objetoOC.montoIGV,
        subTotal: objetoOC.subTotal,
        importe: objetoOC.importe,
      });
      setDetalleId(detalleId + 1);
    } else {
      let cantidad = detalleActual.cantidad + objetoOC.cantidad;
      let importe = cantidad * detalleActual.precioUnitario;
      let subTotal = importe * (data.porcentajeIGV / 100);
      let montoIGV = importe - subTotal;
      dataDetalle[detalleActual.detalleId - 1] = {
        id: objetoOC.id,
        lineaId: objetoOC.lineaId,
        subLineaId: objetoOC.subLineaId,
        articuloId: objetoOC.articuloId,
        marcaId: objetoOC.marcaId,
        codigoBarras: objetoOC.codigoBarras,
        descripcion: objetoOC.descripcion,
        stock: objetoOC.stock,
        unidadMedidaDescripcion: objetoOC.unidadMedidaDescripcion,
        unidadMedidaId: objetoOC.unidadMedidaId,
        cantidad: cantidad,
        precioUnitario: detalleActual.precioUnitario,
        importe: importe,
        subTotal: subTotal,
        montoIGV: montoIGV,
      };
    }
    setRefrescar(true);
  };
  const EliminarDetalle = async (id) => {
    if (id != "") {
      setDataDetalle(dataDetalle.filter((map) => map.detalleId !== id));
      setDetalleId(detalleId - 1);
      setRefrescar(true);
    }
  };
  const CalcularDetalleMontos = async (e) => {
    let cantidad = document.getElementById("cantidad").value;
    let precioUnitario = document.getElementById("precioUnitario").value;
    let importe = document.getElementById("importe").value;

    if (e.target.name == "cantidad" || e.target.name == "precioUnitario") {
      if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
        importe = Funciones.RedondearNumero(cantidad * precioUnitario, 2);
      }
    } else {
      if (!isNaN(precioUnitario)) {
        precioUnitario =
          cantidad != 0 ? Funciones.RedondearNumero(importe / cantidad, 4) : 0;
      }
    }

    if (!isNaN(precioUnitario)) {
      let subTotal = Funciones.RedondearNumero(importe / 1.18, 2);
      let montoIGV = Funciones.RedondearNumero(importe - subTotal, 2);
      setDataArt({
        ...dataArt,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        importe: importe,
        subTotal: subTotal,
        montoIGV: montoIGV,
      });
    }
  };
  const DetalleDocReferencia = async (id) => {
    if (id != "") {
      const result = await ApiMasy.get(`api/Compra/DocumentoCompra/${id}`);
      Swal.fire({
        title: "¿Desea copiar los detalles del documento?",
        text: result.data.data.numeroDocumento,
        icon: "warning",
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
          setDataDetalle(result.data.data.detalles);
          setRefrescar(true);
        }
      });
    }
  };
  const ActualizarImportesTotales = async () => {
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.importe;
    }, 0);

    let porcentajeIgvSeleccionado = data.porcentajeIGV;
    let incluyeIgv = data.incluyeIGV;
    let total = 0,
      subTotal = 0,
      montoIGV = 0;

    if (incluyeIgv) {
      total = Funciones.RedondearNumero(importeTotal, 2);
      subTotal = Funciones.RedondearNumero(
        total / (1 + porcentajeIgvSeleccionado / 100),
        2
      );
      montoIGV = Funciones.RedondearNumero(total - subTotal, 2);
    } else {
      subTotal = Funciones.RedondearNumero(importeTotal, 2);
      montoIGV = Funciones.RedondearNumero(
        subTotal * (porcentajeIgvSeleccionado / 100),
        2
      );
      total = Funciones.RedondearNumero(subTotal + montoIGV, 2);
    }
    setData({
      ...data,
      subTotal: Funciones.FormatoNumero(subTotal.toFixed(2)),
      montoIGV: Funciones.FormatoNumero(montoIGV.toFixed(2)),
      totalNeto: Funciones.FormatoNumero(total.toFixed(2)),
      total: Funciones.FormatoNumero(total.toFixed(2)),
    });
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataArt).length > 0) {
      if (data.monedaId != dataArt.monedaId && dataArt.Id != "000000") {
        const precio = await Funciones.ConvertirPreciosAMoneda(
          "compra",
          dataArt,
          data.monedaId,
          data.tipoCambio
        );
        setDataArt({ ...dataArt, precioUnitario: precio.precioCompra });
      }
    }
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    setDataSeries(result.data.data.series);
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
    setDataTipoVenta(result.data.data.tiposVenta);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataMotivoNota(result.data.data.motivosNota);
    setDataIgv(result.data.data.porcentajesIGV);
    setDataRetencion(result.data.data.porcentajesRetencion);
    setDataDetraccion(result.data.data.porcentajesDetraccion);
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
      toast.success(
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
          toastId: "toastTipoCambio",
        }
      );
      OcultarMensajes();
    }
  };
  const GetDireccion = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/ListarPorCliente?clienteId=${id}`
    );
    setDataClienteDirec(result.data.data);
  };
  const ConsultarCtacte = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/Listar`
    );
    setDataCtacte(
      result.data.data.data.map((res) => ({
        id: res.cuentaCorrienteId,
        descripcion:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
  };
  const GetDocReferencia = async (id) => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/GetDocumentosReferencia?clienteId=${id}`
    );
    setDataDocRef(result.data.data);
    setRefrescar(true);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroCotizacion = async () => {
    setModalCotizacion(true);
  };
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "id",
      accessor: "detalleId",
    },
    {
      Header: "Código",
      accessor: "codigoBarras",
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-right pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Precio",
      accessor: "precioUnitario",
      Cell: ({ value }) => {
        return (
          <p className="text-right pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Importe",
      accessor: "importe",
      Cell: ({ value }) => {
        return (
          <p className="text-right pr-5">
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

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Venta", "DocumentoVenta"]}
            titulo="Documentos de Venta"
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

            <div
              className={
                Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="tipoDocumentoId"
                    className={
                      Global.LabelStyle +
                      Global.FondoOscuro +
                      Global.FondoOscuro
                    }
                  >
                    Tipo Doc.
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    value={data.tipoDocumentoId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Registrar" ? false : true}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle + Global.Disabled
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
                  <label
                    htmlFor="serie"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Serie
                  </label>
                  <select
                    id="serie"
                    name="serie"
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Registrar" ? false : true}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle + Global.Disabled
                    }
                  >
                    {dataSeries
                      .filter(
                        (model) => model.tipoDocumentoId == data.tipoDocumentoId
                      )
                      .map((map) => (
                        <option key={map.serie} value={map.serie}>
                          {map.serie}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="numero"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Número
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="Número"
                    maxLength="10"
                    autoComplete="off"
                    readOnly={true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaEmision"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    F. Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    onBlur={CambioEmision}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaVencimiento"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    F. Vcmto
                  </label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={moment(data.fechaVencimiento ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="numeroDocumento"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Cotización
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="Cotización"
                    autoComplete="off"
                    readOnly={true}
                    value={data.cotizacion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton + Global.Disabled}
                  />
                  <button
                    id="consultarOC"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => AbrirFiltroCotizacion()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="clienteNumeroDocumentoIdentidad"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="clienteNumeroDocumentoIdentidad"
                    name="clienteNumeroDocumentoIdentidad"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    readOnly={true}
                    value={data.clienteNumeroDocumentoIdentidad ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="clienteNombre"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="clienteNombre"
                    name="clienteNombre"
                    placeholder="Cliente"
                    autoComplete="off"
                    readOnly={true}
                    value={data.clienteNombre ?? ""}
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
                    onClick={() => AbrirFiltroCliente()}
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
                          ValidarVarios(e);
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
                  <label
                    htmlFor="clienteDireccionId"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Dirección
                  </label>
                  <select
                    id="clienteDireccionId"
                    name="clienteDireccionId"
                    value={data.clienteDireccionId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {Object.entries(dataClienteDirec).length > 0 &&
                      dataClienteDirec.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.direccion}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div
                  className={
                    data.tipoDocumentoId == "07" || data.tipoDocumentoId == "08"
                      ? Global.InputMitad
                      : Global.InputFull
                  }
                >
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Vendedor
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
                {data.tipoDocumentoId == "07" ||
                data.tipoDocumentoId == "08" ? (
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="clienteNombre"
                      className={Global.LabelStyle + Global.FondoOscuro}
                    >
                      Buscar Letra
                    </label>
                    <input
                      type="text"
                      id="clienteNombre"
                      name="clienteNombre"
                      placeholder="Letra"
                      autoComplete="off"
                      readOnly={true}
                      value={data.clienteNombre ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton + Global.Disabled}
                    />
                    <button
                      id="consultar"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
                      disabled={checkVarios ? true : false}
                      onClick={() => AbrirFiltroCliente()}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="monedaId"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
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
                  <label
                    htmlFor="tipoCambio"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
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
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="tipoCompraId"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    T. Compra
                  </label>
                  <select
                    id="tipoCompraId"
                    name="tipoCompraId"
                    value={data.tipoCompraId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataTipoVenta.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div
                  className={
                    data.tipoPagoId == "CH" || data.tipoPagoId == "DE"
                      ? Global.Input42pct
                      : Global.InputFull
                  }
                >
                  <label
                    htmlFor="tipoPagoId"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Tipo Pago
                  </label>
                  <select
                    id="tipoPagoId"
                    name="tipoPagoId"
                    value={data.tipoPagoId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataTipoCobro
                      .filter(
                        (model) => model.tipoVentaCompraId == data.tipoCompraId
                      )
                      .map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                  </select>
                </div>

                {data.tipoPagoId == "CH" || data.tipoPagoId == "DE" ? (
                  <>
                    <div className={Global.InputTercio}>
                      <label
                        htmlFor="numeroOperacion"
                        className={Global.LabelStyle + Global.FondoOscuro}
                      >
                        Nro. Ope.
                      </label>
                      <input
                        type="text"
                        id="numeroOperacion"
                        name="numeroOperacion"
                        autoComplete="off"
                        placeholder="Número de Operación"
                        readOnly={modo == "Consultar" ? true : false}
                        value={data.numeroOperacion ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label
                        htmlFor="cuentaCorrienteId"
                        className={Global.LabelStyle + Global.FondoOscuro}
                      >
                        Cta. Cte.
                      </label>
                      <select
                        id="cuentaCorrienteId"
                        name="cuentaCorrienteId"
                        value={data.cuentaCorrienteId ?? ""}
                        onChange={ValidarData}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        <option key={"-1"} value={""}>
                          --SELECCIONAR--
                        </option>
                        {dataCtacte.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              {data.tipoDocumentoId == "07" || data.tipoDocumentoId == "08" ? (
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input66pct}>
                    <label
                      htmlFor="documentoReferenciaId"
                      className={Global.LabelStyle + Global.FondoOscuro}
                    >
                      Doc. Ref.
                    </label>
                    <select
                      id="documentoReferenciaId"
                      name="documentoReferenciaId"
                      value={data.documentoReferenciaId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputBoton}
                    >
                      <option key={"-1"} value={""}>
                        {"--SELECCIONAR--"}
                      </option>
                      {dataDocRef.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.numeroDocumento}
                        </option>
                      ))}
                    </select>
                    <button
                      id="detalleDocReferencia"
                      className={
                        Global.BotonBuscar +
                        Global.BotonPrimary +
                        " !rounded-none"
                      }
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) =>
                        DetalleDocReferencia(data.documentoReferenciaId)
                      }
                    >
                      <FaPaste></FaPaste>
                    </button>
                    <div className={Global.Input + " w-16"}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <Checkbox
                          inputId="abonar"
                          name="abonar"
                          readOnly={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            ValidarData(e);
                          }}
                          checked={data.abonar ? true : ""}
                        ></Checkbox>
                      </div>
                      <label
                        htmlFor="abonar"
                        className={Global.LabelCheckStyle}
                      >
                        Abo.
                      </label>
                    </div>
                  </div>
                  <div className={Global.Input60pct}>
                    <label
                      htmlFor="motivoNotaId"
                      className={Global.LabelStyle + Global.FondoOscuro}
                    >
                      Motivo
                    </label>
                    <select
                      id="motivoNotaId"
                      name="motivoNotaId"
                      value={data.motivoNotaId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      <option key={"-1"} value={""}>
                        {"--SELECCIONAR--"}
                      </option>
                      {dataMotivoNota
                        .filter(
                          (model) =>
                            model.tipoDocumentoId == data.tipoDocumentoId
                        )
                        .map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className={Global.Input25pct}>
                    <input
                      type="text"
                      id="motivoSustento"
                      name="motivoSustento"
                      autoComplete="off"
                      placeholder="Sustento"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.motivoSustento ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle + " rounded-l-md"}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={Global.ContenedorInputs}>
                <div className={Global.Input66pct}>
                  <label
                    htmlFor="guiaRemision"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Guía Rem.
                  </label>
                  <input
                    type="text"
                    id="guiaRemision"
                    name="guiaRemision"
                    autoComplete="off"
                    placeholder="Guía de Remisión"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.guiaRemision ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="numeroDocumento"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    O.C
                  </label>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="observacion"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Observación
                  </label>
                  <input
                    type="text"
                    id="observacion"
                    name="observacion"
                    placeholder="Observación"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.observacion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <div className={Global.Input36}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="incluyeIGV"
                        name="incluyeIGV"
                        readOnly={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.incluyeIGV ? true : ""}
                        disabled={data.tipoDocumentoId == "03" ? true : false}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="incluyeIGV"
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Incluye IGV
                    </label>
                  </div>
                  <div className={Global.Input36}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        readOnly={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.afectarStock ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="afectarStock"
                      className={Global.LabelCheckStyle}
                    >
                      Afectar Stock
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
              }
            >
              <div className="flex gap-x-1">
                <div className={Global.Input + " w-32"}>
                  <div className={Global.CheckStyle}>
                    <RadioButton
                      inputId="productos"
                      name="productos"
                      value="productos"
                      disabled={modo == "Consultar" ? true : false}
                      onChange={(e) => {
                        ValidarDataArt(e);
                      }}
                      checked={checkFiltro === "productos"}
                    ></RadioButton>
                  </div>
                  <label
                    htmlFor="productos"
                    className={Global.LabelCheckStyle + " !py-1 "}
                  >
                    Productos
                  </label>
                </div>
                <div className={Global.Input + " w-32"}>
                  <div className={Global.CheckStyle}>
                    <RadioButton
                      inputId="variosFiltro"
                      name="variosFiltro"
                      value="variosFiltro"
                      disabled={modo == "Consultar" ? true : false}
                      onChange={(e) => {
                        ValidarDataArt(e);
                      }}
                      checked={checkFiltro === "variosFiltro"}
                    ></RadioButton>
                  </div>
                  <label
                    htmlFor="variosFiltro"
                    className={Global.LabelCheckStyle + " !py-1 "}
                  >
                    Varios
                  </label>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="descripcion"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción"
                    autoComplete="off"
                    readOnly={!habilitarFiltro ? true : false}
                    value={dataArt.descripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={
                      !habilitarFiltro
                        ? Global.InputBoton + Global.Disabled
                        : Global.InputBoton
                    }
                  />
                  <button
                    id="consultar"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    disabled={!habilitarFiltro ? false : true}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => {
                      setDataArt([]);
                      AbrirFiltroArticulo();
                    }}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
                <div className={Global.Input25pct}>
                  <label
                    htmlFor="stock"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Stock
                  </label>
                  <input
                    type="stock"
                    id="stock"
                    name="stock"
                    autoComplete="off"
                    readOnly={true}
                    value={dataArt.stock ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.Input25pct}>
                  <label
                    htmlFor="unidadMedidaDescripcion"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Unidad
                  </label>
                  <input
                    type="text"
                    id="unidadMedidaDescripcion"
                    name="unidadMedidaDescripcion"
                    autoComplete="off"
                    readOnly={true}
                    value={dataArt.unidadMedidaDescripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>

                <div className={Global.Input25pct}>
                  <label
                    htmlFor="cantidad"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Cantidad
                  </label>
                  <input
                    type="number "
                    id="cantidad"
                    name="cantidad"
                    placeholder="0"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={dataArt.cantidad ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
                      CalcularDetalleMontos(e);
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input25pct}>
                  <label
                    htmlFor="precioUnitario"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    P. Unitario
                  </label>
                  <input
                    type="number"
                    id="precioUnitario"
                    name="precioUnitario"
                    placeholder="Precio Unitario"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={dataArt.precioUnitario ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
                      CalcularDetalleMontos(e);
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input25pct}>
                  <label
                    htmlFor="importe"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Importe
                  </label>
                  <input
                    type="number"
                    id="importe"
                    name="importe"
                    placeholder="0"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={dataArt.importe ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
                      CalcularDetalleMontos(e);
                    }}
                    className={Global.InputBoton}
                    min="0.00"
                    step="0.001"
                    max="1.00"
                    presicion={2} //very important
                  />
                  <button
                    id="enviarDetalle"
                    className={Global.BotonBuscar + Global.BotonPrimary}
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => AgregarDetalleArticulo()}
                  >
                    <FaPlus></FaPlus>
                  </button>
                </div>
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
                  "border ",
                  "",
                  "border border-b-0",
                  "border",
                ]}
              />
            </TablaStyle>
            {/* Tabla */}

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              {data.tipoDocumentoId != "03" ? (
                <>
                  <div className="flex">
                    <div className={Global.FilaVacia}></div>
                    <div className={Global.FilaPrecio}>
                      <p className={Global.FilaContenido}>SubTotal</p>
                    </div>
                    <div className={Global.FilaImporte}>
                      <p className={Global.FilaContenido}>
                        {data.subTotal ?? "0.00"}
                      </p>
                    </div>
                    <div className={Global.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={Global.FilaVacia}></div>
                    <div className={Global.FilaImporte}>
                      <label
                        htmlFor="porcentajeIGV"
                        className={Global.FilaContenido + " !px-0"}
                      >
                        IGV
                      </label>
                      <select
                        id="porcentajeIGV"
                        name="porcentajeIGV"
                        value={data.porcentajeIGV ?? ""}
                        onChange={(e) => ValidarData(e)}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.FilaContenidoSelect + " !mr-1.5"}
                      >
                        {dataIgv.map((map) => (
                          <option key={map.porcentaje} value={map.porcentaje}>
                            {map.porcentaje}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={Global.FilaImporte}>
                      <p className={Global.FilaContenido}>
                        {data.montoIGV ?? "0.00"}
                      </p>
                    </div>
                    <div className={Global.UltimaFila}></div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>{data.total ?? "0.00"}</p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
        </>
      )}
      {modalCliente && (
        <FiltroCliente setModal={setModalCliente} setObjeto={setDataCliente} />
      )}
      {modalCotizacion && (
        <FiltroCotizacion
          setModal={setModalCotizacion}
          id={data.clienteId}
          setObjeto={setDataCotizacion}
          objeto={data.cotizacionId}
        />
      )}
      {modalArt && (
        <FiltroArticulo setModal={setModalArt} setObjeto={setDataArt} />
      )}
    </>
  );
  //#endregion
};

export default Modal;
