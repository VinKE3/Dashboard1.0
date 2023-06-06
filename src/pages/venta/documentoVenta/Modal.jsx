import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroLetraVenta from "../../../components/filtro/FiltroLetraVenta";
import FiltroCotizacion from "../../../components/filtro/FiltroCotizacion";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import FiltroPrecio from "../../../components/filtro/FiltroPrecio";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import {
  FaPlus,
  FaChevronDown,
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
  FaPaste,
} from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";

import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const DivTabla = styled.div`
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
  & th:nth-child(4) {
    width: 60px;
    text-align: center;
  }

  & th:nth-child(5),
  & th:nth-child(6),
  & th:nth-child(7) {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 75px;
    max-width: 75px;
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
  //GetTablas
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
  //GetTablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataClienteDirec, setDataClienteDirec] = useState([]);
  const [dataCotizacion, setDataCotizacion] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  const [dataPrecio, setDataPrecio] = useState([]);
  const [dataLetra, setDataLetra] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalCotizacion, setModalCotizacion] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  const [modalPrecio, setModalPrecio] = useState(false);
  const [modalLetra, setModalLetra] = useState(false);
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
      if (dataCliente.direcciones != undefined) {
        setDataClienteDirec(dataCliente.direcciones);
      }
      Cliente();
      setDataLetra([]);
      //Consulta los Documentos de Referencia
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
    if (Object.keys(dataCotizacion).length > 0) {
      //Cabecera
      setData({
        ...data,
        clienteId: dataCotizacion.clienteId,
        clienteTipoDocumentoIdentidadId:
          dataCotizacion.clienteTipoDocumentoIdentidadId,
        clienteNumeroDocumentoIdentidad:
          dataCotizacion.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataCotizacion.clienteNombre,
        clienteDireccionId: dataCotizacion.clienteDireccionId,
        cotizacionId: dataCotizacion.cotizacionId,
        cotizacion: dataCotizacion.cotizacion,
        personalId: dataCotizacion.personalId,
        monedaId: dataCotizacion.monedaId,
        incluyeIGV: dataCotizacion.incluyeIGV,
        porcentajeIGV: dataCotizacion.porcentajeIGV,
        porcentajeRetencion: dataCotizacion.porcentajeRetencion,
        porcentajePercepcion: dataCotizacion.porcentajePercepcion,
        observacion: dataCotizacion.observacion ?? "",
      });
      GetDireccion(dataCotizacion.clienteId);
      //Cabecera
      //Detalles
      setDataDetalle(dataCotizacion.detalles);
      //Asignar detalleId
      let i = 1;
      dataCotizacion.detalles.map(() => i++);
      setDetalleId(i);
      //Asignar detalleId
      //Detalles
      setRefrescar(true);
    }
  }, [dataCotizacion]);
  useEffect(() => {
    if (Object.keys(dataLetra).length > 0) {
      //Cabecera
      setData({
        ...data,
        letraId: dataLetra.id,
        letra: dataLetra.numeroDocumento,
      });
      //Cabecera
      setRefrescar(true);
    }
  }, [dataLetra]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (Object.keys(dataPrecio).length > 0) {
      setDataCabecera({
        ...dataCabecera,
        precioUnitario: Funciones.RedondearNumero(dataPrecio.precioUnitario, 2),
      });
    }
  }, [dataPrecio]);
  useEffect(() => {
    if (Object.entries(dataCabecera).length > 0) {
      CalcularImporte();
    }
  }, [dataCabecera.precioUnitario]);
  useEffect(() => {
    if (!modalArt) {
      ConvertirPrecio();
    }
  }, [modalArt]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Nuevo") {
      TipoCambio(data.fechaEmision);
    } else {
      GetDireccion(data.clienteId);
    }
    GetCuentasCorrientes();
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
    if (
      target.name == "incluyeIGV" ||
      target.name == "afectarStock" ||
      target.name == "abonar" ||
      target.name == "isAnticipo" ||
      target.name == "isOperacionGratuita"
    ) {
      if (target.name == "incluyeIGV" || target.name == "isOperacionGratuita") {
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
      //Busca el primer resultado que coincida con tipoDocumentoId
      let serie = dataSeries.find(
        (map) => map.tipoDocumentoId === target.value
      );
      //Busca el primer resultado que coincida con tipoDocumentoId

      //Si es undefined entonces asigna en blanco
      serie = serie != undefined ? serie.serie : "";
      //Si es undefined entonces asigna en blanco

      //Obtiene el correlativo
      let numero = await GetCorrelativo(target.value, serie);
      numero = numero != undefined ? numero : "";
      //Obtiene el correlativo
      setData((prevState) => ({
        ...prevState,
        serie: serie,
        numero: numero,
      }));

      if (target.value == "03") {
        setData((prevState) => ({
          ...prevState,
          incluyeIGV: true,
        }));
      } else {
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

    if (target.name == "serie") {
      //Obtiene el correlativo
      let correlativo = await GetCorrelativo(
        data.tipoDocumentoId,
        target.value
      );
      correlativo = correlativo != undefined ? correlativo : "";
      //Obtiene el correlativo
      setData((prevState) => ({
        ...prevState,
        numero: ("0000000000" + String(correlativo)).slice(-10),
      }));
    }
    if (
      target.name == "porcentajeIGV" ||
      target.name == "porcentajeRetencion" ||
      target.name == "porcentajeDetraccion" ||
      target.name == "factorImpuestoBolsa"
    ) {
      setRefrescar(true);
    }

    if (target.name == "tipoVentaId") {
      let model = dataTipoCobro.find(
        (map) => map.tipoVentaCompraId == target.value
      );
      setData((prevData) => ({
        ...prevData,
        tipoCobroId: model.id,
        fechaVencimiento: moment().format("YYYY-MM-DD"),
      }));
    }

    if (target.name == "tipoCobroId") {
      let fecha = await FechaVencimiento(data.tipoVentaId, target.value);
      setData((prevState) => ({
        ...prevState,
        fechaVencimiento: fecha,
      }));

      if (target.value != "CH" || target.value != "DE") {
        setData((prevState) => ({
          ...prevState,
          numeroOperacion: "",
          cuentaCorrienteId: "",
        }));
      }
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
        direcciones: dataGlobal.cliente.direcciones,
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
        direcciones: [],
      }));
      setDataClienteDirec([]);
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
  const FechaVencimiento = async (tipoVentaId, tipoCobroId) => {
    if (tipoVentaId != "CO") {
      let model = dataTipoCobro.find((map) => map.id === tipoCobroId);
      let fecha = moment(moment().format("YYYY-MM-DD"))
        .add(model.plazo, "days")
        .format("YYYY-MM-DD");
      let fechaHoy = moment().format("YYYY-MM-DD");
      let fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      return fechaRetorno;
    } else {
      let fechaHoy = moment().format("YYYY-MM-DD");
      return fechaHoy;
    }
  };
  const CambioDireccion = async (id) => {
    if (modo != "Consultar") {
      let model = dataClienteDirec.find((map) => map.id == id);
      setData((prevState) => ({
        ...prevState,
        clienteDireccionId: model.id,
        clienteDireccion: model.direccion,
      }));
    }
  };
  const DetalleDocReferencia = async (id) => {
    if (id != "") {
      const result = await ApiMasy.get(`api/Venta/DocumentoVenta/${id}`);
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
  const Cliente = async () => {
    //Consultar Fecha
    let fecha = await FechaVencimiento(
      dataCliente.tipoVentaId,
      dataCliente.tipoCobroId
    );
    //Consultar Fecha

    setData({
      ...data,
      clienteId: dataCliente.clienteId,
      clienteTipoDocumentoIdentidadId:
        dataCliente.clienteTipoDocumentoIdentidadId,
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteNombre: dataCliente.clienteNombre,
      clienteDireccionId: dataCliente.clienteDireccionId,
      clienteDireccion: dataCliente.clienteDireccion,
      tipoVentaId: dataCliente.tipoVentaId,
      tipoCobroId: dataCliente.tipoCobroId,
      fechaVencimiento: fecha != undefined ? fecha : data.fechaVencimiento,
      personalId:
        dataCliente.personalId == ""
          ? dataGlobal.personalId
          : dataCliente.personalId,

      //Limpia las letras
      letraId: "",
      letra: "",
      //Limpia las letras
    });
  };
  //Data General

  //Artículos
  const HandleDataCabecera = async ({ target }) => {
    //Valida Articulos Varios
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataCabecera([]);
    } else if (target.name == "variosFiltro") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(true);
      setDataCabecera({
        id: dataGlobal.articulo.id,
        lineaId: dataGlobal.articulo.lineaId,
        subLineaId: dataGlobal.articulo.subLineaId,
        articuloId: dataGlobal.articulo.articuloId,
        unidadMedidaId: dataGlobal.articulo.unidadMedidaId,
        marcaId: dataGlobal.articulo.marcaId,
        descripcion: dataGlobal.articulo.descripcion,
        codigoBarras: dataGlobal.articulo.codigoBarras,
        precioCompra: dataGlobal.articulo.precioCompra,
        precioUnitario: dataGlobal.articulo.precioVenta1,
        stock: dataGlobal.articulo.stock,
        unidadMedidaDescripcion: dataGlobal.articulo.unidadMedidaDescripcion,
        //Calculo para Detalle
        cantidad: 0,
        importe: 0,
        //Calculo para Detalle
      });
    } else {
      setDataCabecera((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataCabecera).length > 0) {
      if (
        data.monedaId != dataCabecera.monedaId &&
        dataCabecera.Id != "000000"
      ) {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "venta",
          dataCabecera,
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataCabecera({
            ...dataCabecera,
            precioCompra: model.precioCompra,
            precioVenta1: model.precioVenta1,
            precioVenta2: model.precioVenta2,
            precioVenta3: model.precioVenta3,
            precioVenta4: model.precioVenta4,
            precioUnitario: model.precioVenta1,
          });
        }
      } else {
        setDataCabecera({
          ...dataCabecera,
          precioUnitario: dataCabecera.precioVenta1,
        });
      }
    }
  };
  const CalcularImporte = async (name = "precioUnitario") => {
    let cantidad = Number(document.getElementById("cantidad").value);
    let precioUnitario = Number(
      document.getElementById("precioUnitario").value
    );
    let importe = Number(document.getElementById("importe").value);
    let foco = name;

    if (foco == "cantidad" || foco == "precioUnitario") {
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
      setDataCabecera({
        ...dataCabecera,
        cantidad: Funciones.RedondearNumero(cantidad, 2),
        precioUnitario: Funciones.RedondearNumero(precioUnitario, 2),
        importe: Funciones.RedondearNumero(importe, 2),
        subTotal: subTotal,
        montoIGV: montoIGV,
      });
    }
  };
  //Artículos

  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      return [false, "Seleccione un Item"];
    }

    //Valida Descripción
    if (dataCabecera.descripcion == undefined) {
      return [false, "La descripción es requerida"];
    }

    //Valida montos
    if (Funciones.IsNumeroValido(dataCabecera.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataCabecera.cantidad, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataCabecera.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataCabecera.precioUnitario, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataCabecera.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataCabecera.importe, false),
      ];
    }
    //Valida montos

    //Valida Stock
    if (data.afectarStock) {
      if (dataCabecera.stock < dataCabecera.cantidad) {
        return [
          false,
          "Stock: El artículo no cuenta con el stock necesario para esta operación",
        ];
      }
    }
    //Valia precio Venta debe ser mayor a precio Compra
    if (dataCabecera.precioCompra != undefined) {
      if (dataCabecera.precioCompra > dataCabecera.precioUnitario) {
        Swal.fire({
          title: "Aviso del sistema",
          text: `Precio de Venta: ${dataCabecera.precioUnitario}  |  Precio de Compra: ${dataCabecera.precioCompra}.   
        El precio de Venta está por debajo del precio de Compra.`,
          icon: "error",
          iconColor: "#F7BF3A",
          showCancelButton: false,
          color: "#fff",
          background: "#1a1a2e",
          confirmButtonColor: "#eea508",
          confirmButtonText: "Aceptar",
        });
        return [false, ""];
      }
    }
    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataCabecera.id) {
            return {
              detalleId: dataCabecera.detalleId,
              id: dataCabecera.id,
              lineaId: dataCabecera.lineaId,
              subLineaId: dataCabecera.subLineaId,
              articuloId: dataCabecera.articuloId,
              marcaId: dataCabecera.marcaId,
              codigoBarras: dataCabecera.codigoBarras,
              descripcion: dataCabecera.descripcion,
              stock: dataCabecera.stock,
              unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
              unidadMedidaId: dataCabecera.unidadMedidaId,
              cantidad: dataCabecera.cantidad,
              precioCompra: dataCabecera.precioCompra,
              precioUnitario: dataCabecera.precioUnitario,
              montoIGV: dataCabecera.montoIGV,
              subTotal: dataCabecera.subTotal,
              importe: dataCabecera.importe,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = [];
        //Valida Artículos Varios
        if (dataCabecera.id == "00000000") {
          //Valida por id y descripción de artículo
          model = dataDetalle.find((map) => {
            return (
              map.id == dataCabecera.id &&
              map.descripcion == dataCabecera.descripcion
            );
          });
        } else {
          //Valida solo por id
          model = dataDetalle.find((map) => {
            return map.id == dataCabecera.id;
          });
        }

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              id: dataCabecera.id,
              lineaId: dataCabecera.lineaId,
              subLineaId: dataCabecera.subLineaId,
              articuloId: dataCabecera.articuloId,
              marcaId: dataCabecera.marcaId,
              codigoBarras: dataCabecera.codigoBarras,
              descripcion: dataCabecera.descripcion,
              stock: dataCabecera.stock,
              unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
              unidadMedidaId: dataCabecera.unidadMedidaId,
              cantidad: dataCabecera.cantidad,
              precioCompra: dataCabecera.precioCompra,
              precioUnitario: dataCabecera.precioUnitario,
              montoIGV: dataCabecera.montoIGV,
              subTotal: dataCabecera.subTotal,
              importe: dataCabecera.importe,
            },
          ]);
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
              CargarDetalle(model.id);
            }
          });
        }
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera([]);
      if (document.getElementById("productos")) {
        document.getElementById("productos").checked = true;
        document
          .getElementById("productos")
          .dispatchEvent(new Event("click", { bubbles: true }));
      }
      document.getElementById("consultarArticulo").focus();
    } else {
      //NO cumple validación
      if (resultado[1] != "") {
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
    }
  };
  const CargarDetalle = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        setDataCabecera(dataDetalle.find((map) => map.id === id));
      } else {
        setDataCabecera(dataDetalle.find((map) => map.id === value));
      }
      document.getElementById("cantidad").focus();
    }
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter((map) => map.id !== id);
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
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      setDataDetalle(nuevoDetalle);
    }
    setRefrescar(true);
  };

  //Calculos
  const ImpuestoBolsa = async () => {
    let fecha = data.fechaEmision.toString();
    if (!isNaN(Date.parse(fecha))) {
      if (fecha.length == 10) {
        let year = parseInt(fecha.slice(0, 4));
        if (year < 2019) {
          setData({ ...data, factorImpuestoBolsa: 0 });
        } else if (year == 2019) {
          setData({ ...data, factorImpuestoBolsa: 0.1 });
        } else if (year == 2020) {
          setData({ ...data, factorImpuestoBolsa: 0.2 });
        } else if (year == 2021) {
          setData({ ...data, factorImpuestoBolsa: 0.3 });
        } else if (year == 2022) {
          setData({ ...data, factorImpuestoBolsa: 0.4 });
        } else {
          setData({ ...data, factorImpuestoBolsa: 0.5 });
        }
      }
    }
  };
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.importe;
    }, 0);

    //Valida si es operación gratuita
    if (!data.isOperacionGratuita) {
      //Porcentajes
      let porcentajeIgvSeleccionado = data.porcentajeIGV;
      let porcentajeRetencionSelect = data.porcentajeRetencion;
      let porcentajeDetraccionSelect = data.porcentajeDetraccion;
      let porcentajeImpuestoBolsa = data.factorImpuestoBolsa;
      let incluyeIgv = data.incluyeIGV;
      //Porcentajes
      //Montos
      let subTotal = 0,
        montoIGV = 0,
        total = 0,
        totalNeto = 0,
        retencion = 0,
        detraccion = 0,
        bolsa = 0;
      //Montos

      //Calculo Check IncluyeIGV
      if (incluyeIgv) {
        totalNeto = Funciones.RedondearNumero(importeTotal, 2);
        subTotal = Funciones.RedondearNumero(
          totalNeto / (1 + porcentajeIgvSeleccionado / 100),
          2
        );
        montoIGV = Funciones.RedondearNumero(totalNeto - subTotal, 2);
      } else {
        subTotal = Funciones.RedondearNumero(importeTotal, 2);
        montoIGV = Funciones.RedondearNumero(
          subTotal * (porcentajeIgvSeleccionado / 100),
          2
        );
        totalNeto = Funciones.RedondearNumero(subTotal + montoIGV, 2);
      }
      //Calculo Check IncluyeIGV

      //Calculo Impuesto Bolsa
      dataDetalle.map((map) => {
        if (map.codigoBarras == "ICBPER") {
          bolsa = bolsa + map.cantidad * porcentajeImpuestoBolsa;
        }
      });
      //Calculo Impuesto Bolsa

      //Calculos
      retencion = Funciones.RedondearNumero(
        totalNeto * (porcentajeRetencionSelect / 100),
        2
      );
      detraccion = Funciones.RedondearNumero(
        totalNeto * (porcentajeDetraccionSelect / 100),
        2
      );
      total = totalNeto + detraccion + bolsa;
      //Calculos
      setData((prevState) => ({
        ...prevState,
        subTotal: Funciones.RedondearNumero(subTotal, 2),
        montoIGV: Funciones.RedondearNumero(montoIGV, 2),
        totalNeto: Funciones.RedondearNumero(totalNeto, 2),
        montoImpuestoBolsa: Funciones.RedondearNumero(bolsa, 2),
        montoRetencion: Funciones.RedondearNumero(retencion, 2),
        montoDetraccion: Funciones.RedondearNumero(detraccion, 2),
        totalOperacionesGratuitas: 0,
        total: Funciones.RedondearNumero(total, 2),
      }));
    } else {
      //Asigna a todo 0 y la suma de importes pasa a totalOperacionesGratuitas
      setData((prevState) => ({
        ...prevState,
        incluyeIGV: false,
        totalOperacionesGratuitas: importeTotal,
        porcentajeIGV: 0,
        porcentajeDetraccion: 0,
        porcentajeRetencion: 0,
        subTotal: 0,
        montoIGV: 0,
        totalNeto: 0,
        montoImpuestoBolsa: 0,
        montoRetencion: 0,
        montoDetraccion: 0,
        total: 0,
      }));
    }
  };
  //Calculos
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    let model = result.data.data.series.sort((a, b) =>
      a.serie.localeCompare(b.serie)
    );
    setDataSeries(model);
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

    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposDocumento = result.data.data.tiposDocumento.find((map) => map);
      let series = model.find(
        (map) => map.tipoDocumentoId == tiposDocumento.id
      );
      //Consulta Correlativo
      let numero = await GetCorrelativo(tiposDocumento.id, series.serie);
      //Consulta Correlativo
      let vendedores = result.data.data.vendedores.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      let tiposVenta = result.data.data.tiposVenta.find((map) => map);
      let tiposCobro = result.data.data.tiposCobro.find(
        (map) => map.tipoVentaCompraId == tiposVenta.id
      );
      let porcentajesIGV = result.data.data.porcentajesIGV.find(
        (map) => map.default == true
      );
      let porcentajesRetencion = result.data.data.porcentajesRetencion.find(
        (map) => map.default == true
      );
      let porcentajesDetraccion = result.data.data.porcentajesDetraccion.find(
        (map) => map.default == true
      );
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoDocumentoId: tiposDocumento.id,
        serie: series.serie,
        numero: numero,
        personalId: vendedores.id,
        monedaId: monedas.id,
        tipoVentaId: tiposVenta.id,
        tipoCobroId: tiposCobro.id,
        porcentajeIGV: porcentajesIGV.porcentaje,
        porcentajeRetencion: porcentajesRetencion.porcentaje,
        porcentajesDetraccion: porcentajesDetraccion.porcentaje,
      }));
    }
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "venta",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
  };
  const GetDireccion = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/ListarPorCliente?clienteId=${id}`
    );
    setDataClienteDirec(result.data.data);
  };
  const GetCuentasCorrientes = async () => {
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
  const GetCorrelativo = async (tipoDocumento, serie) => {
    if (serie != "" && serie.length == 4) {
      const result = await ApiMasy.get(
        `api/Mantenimiento/Correlativo/${tipoDocumento}/${serie}`
      );
      return ("0000000000" + String(result.data.data.numero)).slice(-10);
    } else {
      return "";
    }
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
  const AbrirFiltroPrecio = async () => {
    if (dataCabecera.id != undefined && dataCabecera.id != "") {
      setModalPrecio(true);
    } else {
      toast.error("Seleccione un producto", {
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
  const AbrirFiltroLetra = async () => {
    if (data.clienteId != "") {
      setModalLetra(true);
    }
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ value }) => {
        return <p className="text-center font-semibold">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
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
          <p className="text-right font-semibold pr-2.5">
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
          <p className="text-right font-semibold pr-5">
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={() => CargarDetalle(row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.id);
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
            titulo="Documento de Venta"
            cerrar={false}
            foco={document.getElementById("tablaDocumentoVenta")}
            tamañoModal={[G.ModalFull, G.Form + " px-10 "]}
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
                <div className={G.InputFull}>
                  <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
                    Tipo Doc.
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    autoFocus
                    value={data.tipoDocumentoId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Nuevo" ? false : true}
                    className={G.InputStyle}
                  >
                    {dataTipoDoc.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="serie" className={G.LabelStyle}>
                    Serie
                  </label>
                  <select
                    id="serie"
                    name="serie"
                    value={data.serie ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Nuevo" ? false : true}
                    className={G.InputStyle}
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
                <div className={G.InputMitad}>
                  <label htmlFor="numero" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaEmision" className={G.LabelStyle}>
                    Fecha Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    autoFocus={modo == "Modificar"}
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={HandleData}
                    onBlur={() => {
                      FechaEmision();
                      ImpuestoBolsa();
                    }}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaVencimiento" className={G.LabelStyle}>
                    Fecha Vcmto
                  </label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaVencimiento ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="numeroDocumento" className={G.LabelStyle}>
                    Cotización
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="Buscar Cotización"
                    autoComplete="off"
                    disabled={true}
                    value={data.cotizacion ?? ""}
                    onChange={HandleData}
                    className={
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
                  />
                  <button
                    id="consultarOC"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCotizacion()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label
                    htmlFor="clienteNumeroDocumentoIdentidad"
                    className={G.LabelStyle}
                  >
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="clienteNumeroDocumentoIdentidad"
                    name="clienteNumeroDocumentoIdentidad"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteNumeroDocumentoIdentidad ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="clienteNombre" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarCliente"
                    className={
                      G.BotonBuscar + G.BotonPrimary + " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCliente()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <div className={G.Input + " w-20"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="varios"
                        name="varios"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          setCheckVarios(e.checked);
                          ClientesVarios(e);
                        }}
                        checked={checkVarios}
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={G.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="clienteDireccionId" className={G.LabelStyle}>
                    Dirección
                  </label>
                  <select
                    id="clienteDireccionId"
                    name="clienteDireccionId"
                    value={data.clienteDireccionId ?? ""}
                    onChange={(e) => CambioDireccion(e.target.value)}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataClienteDirec.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.direccion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div
                  className={
                    data.tipoDocumentoId == "07" || data.tipoDocumentoId == "08"
                      ? G.InputMitad
                      : G.InputFull
                  }
                >
                  <label htmlFor="personalId" className={G.LabelStyle}>
                    Vendedor
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    value={data.personalId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
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
                  <div className={G.InputMitad}>
                    <label htmlFor="letra" className={G.LabelStyle}>
                      Buscar Letra
                    </label>
                    <input
                      type="text"
                      id="letra"
                      name="letra"
                      placeholder="Buscar Letra"
                      autoComplete="off"
                      disabled={true}
                      value={data.letra ?? ""}
                      onChange={HandleData}
                      className={G.InputBoton}
                    />
                    <button
                      id="consultarLetra"
                      className={G.BotonBuscar + G.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => AbrirFiltroLetra()}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
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
                    className={
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
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
                  <label htmlFor="tipoVentaId" className={G.LabelStyle}>
                    Tipo Venta
                  </label>
                  <select
                    id="tipoVentaId"
                    name="tipoVentaId"
                    value={data.tipoVentaId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataTipoVenta.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div
                  className={
                    data.tipoCobroId == "CH" || data.tipoCobroId == "DE"
                      ? G.InputTercio
                      : G.InputFull
                  }
                >
                  <label htmlFor="tipoCobroId" className={G.LabelStyle}>
                    Tipo Cobro
                  </label>
                  <select
                    id="tipoCobroId"
                    name="tipoCobroId"
                    value={data.tipoCobroId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataTipoCobro
                      .filter(
                        (model) => model.tipoVentaCompraId == data.tipoVentaId
                      )
                      .map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                  </select>
                </div>

                {data.tipoCobroId == "CH" || data.tipoCobroId == "DE" ? (
                  <>
                    <div className={G.InputTercio}>
                      <label htmlFor="numeroOperacion" className={G.LabelStyle}>
                        Nro. Ope.
                      </label>
                      <input
                        type="text"
                        id="numeroOperacion"
                        name="numeroOperacion"
                        placeholder="Número de Operación"
                        autoComplete="off"
                        disabled={modo == "Consultar"}
                        value={data.numeroOperacion ?? ""}
                        onChange={HandleData}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputTercio}>
                      <label
                        htmlFor="cuentaCorrienteId"
                        className={G.LabelStyle}
                      >
                        Cta. Cte.
                      </label>
                      <select
                        id="cuentaCorrienteId"
                        name="cuentaCorrienteId"
                        value={data.cuentaCorrienteId ?? ""}
                        onChange={HandleData}
                        disabled={modo == "Consultar"}
                        className={G.InputStyle}
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
                <div className={G.ContenedorInputs}>
                  <div className={G.Input66pct}>
                    <label
                      htmlFor="documentoReferenciaId"
                      className={G.LabelStyle}
                    >
                      Doc. Ref.
                    </label>
                    <select
                      id="documentoReferenciaId"
                      name="documentoReferenciaId"
                      value={data.documentoReferenciaId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputBoton}
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
                        G.BotonBuscar + G.BotonPrimary + " !rounded-none"
                      }
                      hidden={modo == "Consultar"}
                      onClick={() =>
                        DetalleDocReferencia(data.documentoReferenciaId)
                      }
                    >
                      <FaPaste></FaPaste>
                    </button>
                    <div className={G.Input + " w-16"}>
                      <div className={G.CheckStyle + G.Anidado}>
                        <Checkbox
                          inputId="abonar"
                          name="abonar"
                          disabled={modo == "Consultar"}
                          onChange={(e) => {
                            HandleData(e);
                          }}
                          checked={data.abonar ? true : ""}
                        ></Checkbox>
                      </div>
                      <label htmlFor="abonar" className={G.LabelCheckStyle}>
                        Abo.
                      </label>
                    </div>
                  </div>
                  <div className={G.Input60pct}>
                    <label htmlFor="motivoNotaId" className={G.LabelStyle}>
                      Motivo
                    </label>
                    <select
                      id="motivoNotaId"
                      name="motivoNotaId"
                      value={data.motivoNotaId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
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
                  <div className={G.Input25pct}>
                    <input
                      type="text"
                      id="motivoSustento"
                      name="motivoSustento"
                      placeholder="Sustento"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.motivoSustento ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle + " rounded-l-md"}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="guiaRemision" className={G.LabelStyle}>
                    Guía Rem.
                  </label>
                  <input
                    type="text"
                    id="guiaRemision"
                    name="guiaRemision"
                    placeholder="Guía de Remisión"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.guiaRemision ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="numeroPedido" className={G.LabelStyle}>
                    N° Pedido
                  </label>
                  <input
                    type="text"
                    id="numeroPedido"
                    name="numeroPedido"
                    placeholder="N° Pedido"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.numeroPedido ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="observacion" className={G.LabelStyle}>
                    Observación
                  </label>
                  <input
                    type="text"
                    id="observacion"
                    name="observacion"
                    placeholder="Observación"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.observacion ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <div className={G.Input25pct}>
                    <div className={G.CheckStyle}>
                      <Checkbox
                        inputId="isAnticipo"
                        name="isAnticipo"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleData(e);
                        }}
                        checked={data.isAnticipo ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="isAnticipo"
                      className={G.LabelCheckStyle + " rounded-r-none "}
                    >
                      Anticipo
                    </label>
                  </div>
                  <div className={G.Input25pct}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="isOperacionGratuita"
                        name="isOperacionGratuita"
                        disabled={modo == "Consultar"}
                        onChange={HandleData}
                        checked={data.isOperacionGratuita ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="isOperacionGratuita"
                      className={G.LabelCheckStyle + " rounded-r-none"}
                    >
                      Operación Gratuita
                    </label>
                  </div>
                  <div className={G.Input25pct}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="incluyeIGV"
                        name="incluyeIGV"
                        onChange={(e) => {
                          HandleData(e);
                        }}
                        checked={data.incluyeIGV ? true : ""}
                        disabled={
                          data.tipoDocumentoId == "03" ||
                          data.isOperacionGratuita ||
                          modo == "Consultar"
                            ? true
                            : false
                        }
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="incluyeIGV"
                      className={G.LabelCheckStyle + " rounded-r-none"}
                    >
                      Incluye IGV
                    </label>
                  </div>
                  <div className={G.Input25pct}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        onChange={(e) => {
                          HandleData(e);
                        }}
                        checked={data.afectarStock ? true : ""}
                        disabled={
                          data.tipoDocumentoId == "07" ||
                          data.tipoDocumentoId == "08" ||
                          modo == "Consultar"
                            ? false
                            : true
                        }
                      ></Checkbox>
                    </div>
                    <label htmlFor="afectarStock" className={G.LabelCheckStyle}>
                      Afectar Stock
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            {modo != "Consultar" && (
              <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <div className={G.Input + "w-32"}>
                      <div className={G.CheckStyle}>
                        <RadioButton
                          inputId="productos"
                          name="productos"
                          value="productos"
                          disabled={modo == "Consultar"}
                          onChange={(e) => {
                            HandleDataCabecera(e);
                          }}
                          checked={checkFiltro === "productos"}
                        ></RadioButton>
                      </div>
                      <label
                        htmlFor="productos"
                        className={G.LabelCheckStyle + "rounded-r-none"}
                      >
                        Productos
                      </label>
                    </div>
                    <div className={G.Input + "w-32"}>
                      <div className={G.CheckStyle + G.Anidado}>
                        <RadioButton
                          inputId="variosFiltro"
                          name="variosFiltro"
                          value="variosFiltro"
                          disabled={modo == "Consultar"}
                          onChange={(e) => {
                            HandleDataCabecera(e);
                          }}
                          checked={checkFiltro === "variosFiltro"}
                        ></RadioButton>
                      </div>
                      <label
                        htmlFor="variosFiltro"
                        className={G.LabelCheckStyle + " !py-1 "}
                      >
                        Varios
                      </label>
                    </div>
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="descripcion" className={G.LabelStyle}>
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción"
                      autoComplete="off"
                      disabled={!habilitarFiltro ? true : false}
                      value={dataCabecera.descripcion ?? ""}
                      onChange={HandleDataCabecera}
                      className={!habilitarFiltro ? G.InputBoton : G.InputBoton}
                    />
                    <button
                      id="consultarArticulo"
                      className={G.BotonBuscar + G.BotonPrimary}
                      disabled={!habilitarFiltro ? false : true}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => {
                        setDataCabecera([]);
                        AbrirFiltroArticulo();
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="stock" className={G.LabelStyle}>
                      Stock
                    </label>
                    <input
                      type="stock"
                      id="stock"
                      name="stock"
                      placeholder="Stock"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.stock ?? ""}
                      onChange={HandleDataCabecera}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input25pct}>
                    <label
                      htmlFor="unidadMedidaDescripcion"
                      className={G.LabelStyle}
                    >
                      Unidad
                    </label>
                    <input
                      type="text"
                      id="unidadMedidaDescripcion"
                      name="unidadMedidaDescripcion"
                      placeholder="Unidad Medida"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.unidadMedidaDescripcion ?? ""}
                      onChange={HandleDataCabecera}
                      className={G.InputStyle}
                    />
                  </div>

                  <div className={G.Input25pct}>
                    <label htmlFor="cantidad" className={G.LabelStyle}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      placeholder="Cantidad"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.cantidad ?? ""}
                      onChange={(e) => {
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="precioUnitario" className={G.LabelStyle}>
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precioUnitario"
                      name="precioUnitario"
                      placeholder="Precio"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.precioUnitario ?? ""}
                      onChange={(e) => {
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={
                        dataCabecera.id != undefined && dataCabecera.id != ""
                          ? G.InputBoton
                          : G.InputStyle
                      }
                    />
                    {dataCabecera.id != undefined && dataCabecera.id != "" ? (
                      <button
                        id="enviarDetalle"
                        className={G.BotonBuscar + G.BotonPrimary}
                        hidden={modo == "Consultar"}
                        onClick={() => AbrirFiltroPrecio()}
                      >
                        <FaChevronDown></FaChevronDown>
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="importe" className={G.LabelStyle}>
                      Importe
                    </label>
                    <input
                      type="number"
                      id="importe"
                      name="importe"
                      placeholder="Importe"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.importe ?? ""}
                      onChange={(e) => {
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={
                        modo != "Consultar" ? G.InputBoton : G.InputStyle
                      }
                    />
                    <button
                      id="enviarDetalle"
                      className={G.BotonBuscar + G.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => AgregarDetalle()}
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detalles */}

            {/* Tabla Detalle */}
            <DivTabla>
              <TableBasic
                columnas={columnas}
                datos={dataDetalle}
                estilos={[
                  "border-2 border-b-0 border-gray-200",
                  "",
                  "",
                  "border ",
                  "",
                  "border border-b-0",
                  "border",
                ]}
                DobleClick={(e) => CargarDetalle(e, true)}
              />
            </DivTabla>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={G.ContenedorFooter}>
              {data.tipoDocumentoId != "NV" ? (
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total Inafecto</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>
                      {data.totalOperacionesInafectas ?? "0.00"}
                    </p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
                </div>
              ) : (
                <></>
              )}
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Op. Gratuita</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.totalOperacionesGratuitas ?? "0.00"}
                  </p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              {data.tipoDocumentoId != "03" ? (
                <>
                  <div className="flex">
                    <div className={G.FilaFooter + G.FilaVacia}></div>
                    <div className={G.FilaFooter + G.FilaPrecio}>
                      <p className={G.FilaContenido}>SubTotal</p>
                    </div>
                    <div className={G.FilaFooter + G.FilaImporte}>
                      <p className={G.FilaContenido}>
                        {data.subTotal ?? "0.00"}
                      </p>
                    </div>
                    <div className={G.FilaFooter + G.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={G.FilaFooter + G.FilaVacia}></div>
                    <div className={G.FilaFooter + G.FilaPrecio}>
                      <p className={G.FilaContenido}>T. Anticipos</p>
                    </div>
                    <div className={G.FilaFooter + G.FilaImporte}>
                      <p className={G.FilaContenido}>
                        {data.totalAnticipos ?? "0.00"}
                      </p>
                    </div>
                    <div className={G.FilaFooter + G.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={G.FilaFooter + G.FilaVacia}></div>
                    <div className={G.FilaFooter + G.FilaPrecio}>
                      <p className={G.FilaContenido}>Total</p>
                    </div>
                    <div className={G.FilaFooter + G.FilaImporte}>
                      <p className={G.FilaContenido}>
                        {data.totalNeto ?? "0.00"}
                      </p>
                    </div>
                    <div className={G.FilaFooter + G.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={G.FilaFooter + G.FilaVacia}></div>
                    <div className={G.FilaFooter + G.FilaInput}>
                      <label
                        htmlFor="porcentajeIGV"
                        className={G.FilaContenido + " !px-0"}
                      >
                        IGV
                      </label>
                      <select
                        id="porcentajeIGV"
                        name="porcentajeIGV"
                        value={data.porcentajeIGV ?? ""}
                        onChange={(e) => HandleData(e)}
                        disabled={
                          modo == "Consultar" || data.isOperacionGratuita
                            ? true
                            : false
                        }
                        className={G.FilaContenidoSelect}
                      >
                        {dataIgv.map((map) => (
                          <option key={map.porcentaje} value={map.porcentaje}>
                            {map.porcentaje}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={G.FilaFooter + G.FilaImporte}>
                      <p className={G.FilaContenido}>
                        {data.montoIGV ?? "0.00"}
                      </p>
                    </div>
                    <div className={G.FilaFooter + G.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={G.FilaFooter + G.FilaVacia}></div>
                    <div className={G.FilaFooter + G.FilaInput}>
                      <label
                        htmlFor="porcentajeRetencion"
                        className={G.FilaContenido + " !px-0"}
                      >
                        Reten
                      </label>
                      <select
                        id="porcentajeRetencion"
                        name="porcentajeRetencion"
                        value={data.porcentajeRetencion ?? ""}
                        onChange={(e) => HandleData(e)}
                        disabled={
                          modo == "Consultar" || data.isOperacionGratuita
                            ? true
                            : false
                        }
                        className={G.FilaContenidoSelect}
                      >
                        {dataRetencion.map((map) => (
                          <option key={map.porcentaje} value={map.porcentaje}>
                            {map.porcentaje}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={G.FilaFooter + G.FilaImporte}>
                      <p className={G.FilaContenido}>
                        {data.montoRetencion ?? "0.00"}
                      </p>
                    </div>
                    <div className={G.FilaFooter + G.UltimaFila}></div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaInput}>
                  <label
                    htmlFor="porcentajeDetraccion"
                    className={G.FilaContenido + " !px-0"}
                  >
                    Detrac
                  </label>
                  <select
                    id="porcentajeDetraccion"
                    name="porcentajeDetraccion"
                    value={data.porcentajeDetraccion ?? ""}
                    onChange={(e) => HandleData(e)}
                    disabled={
                      modo == "Consultar" || data.isOperacionGratuita
                        ? true
                        : false
                    }
                    className={G.FilaContenidoSelect}
                  >
                    {dataDetraccion.map((map) => (
                      <option key={map.porcentaje} value={map.porcentaje}>
                        {map.porcentaje}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.montoDetraccion ?? "0.00"}
                  </p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaInput}>
                  <label
                    htmlFor="factorImpuestoBolsa"
                    className={G.FilaContenido + " !px-0"}
                  >
                    I.Bolsa
                  </label>
                  <input
                    type="number"
                    id="factorImpuestoBolsa"
                    name="factorImpuestoBolsa"
                    autoComplete="off"
                    placeholder="0.00"
                    min={0}
                    disabled={true}
                    value={data.factorImpuestoBolsa ?? ""}
                    onChange={() => {}}
                    className={G.FilaContenidoSelect + " !w-10"}
                  />
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.montoImpuestoBolsa ?? "0.00"}
                  </p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Total a Pagar</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.total ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
        </>
      )}
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("clienteDireccionId")}
        />
      )}
      {modalCotizacion && (
        <FiltroCotizacion
          setModal={setModalCotizacion}
          id={data.clienteId}
          setObjeto={setDataCotizacion}
          objeto={data.cotizacionId}
          foco={document.getElementById("clienteDireccionId")}
        />
      )}
      {modalArt && (
        <FiltroArticulo
          setModal={setModalArt}
          setObjeto={setDataCabecera}
          foco={document.getElementById("cantidad")}
        />
      )}
      {modalPrecio && (
        <FiltroPrecio
          setModal={setModalPrecio}
          objeto={{
            precioVenta1: dataCabecera.precioVenta1,
            precioVenta2: dataCabecera.precioVenta2,
            precioVenta3: dataCabecera.precioVenta3,
            precioVenta4: dataCabecera.precioVenta4,
          }}
          setObjeto={setDataPrecio}
          foco={document.getElementById("precioUnitario")}
        />
      )}
      {modalLetra && (
        <FiltroLetraVenta
          setModal={setModalLetra}
          id={data.clienteId}
          setObjeto={setDataLetra}
          foco={document.getElementById("monedaId")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
