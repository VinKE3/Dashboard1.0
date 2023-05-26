import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/Modal/ModalCrud";
import FiltroLetraVenta from "../../../components/Filtro/FiltroLetraVenta";
import FiltroCotizacion from "../../../components/Filtro/FiltroCotizacion";
import FiltroCliente from "../../../components/Filtro/FiltroCliente";
import FiltroArticulo from "../../../components/Filtro/FiltroArticulo";
import FiltroPrecio from "../../../components/Filtro/FiltroPrecio";
import Mensajes from "../../../components/Funciones/Mensajes";
import TableBasic from "../../../components/Tabla/TableBasic";
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
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones/Validaciones";

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
        precioUnitario: dataPrecio.precioUnitario,
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
      GetPorIdTipoCambio(data.fechaEmision);
    } else {
      GetDireccion(data.clienteId);
    }
    GetCuentasCorrientes();
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
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
      let correlativo = await GetCorrelativo(target.value, serie);
      correlativo = correlativo != undefined ? correlativo : "";
      //Obtiene el correlativo
      setData((prevState) => ({
        ...prevState,
        serie: serie,
        numero: correlativo,
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
        numero: correlativo,
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
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Artículos
  const ValidarDataCabecera = async ({ target }) => {
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
    let cantidad = document.getElementById("cantidad").value;
    let precio = document.getElementById("precioUnitario").value;
    let importe = document.getElementById("importe").value;
    let foco = name;

    if (foco == "cantidad" || foco == "precioUnitario") {
      if (!isNaN(cantidad) && !isNaN(precio)) {
        importe = Funciones.RedondearNumero(cantidad * precio, 2);
      }
    } else {
      if (!isNaN(precio)) {
        precio =
          cantidad != 0 ? Funciones.RedondearNumero(importe / cantidad, 4) : 0;
      }
    }
    if (!isNaN(precio)) {
      let subTotal = Funciones.RedondearNumero(importe / 1.18, 2);
      let montoIGV = Funciones.RedondearNumero(importe - subTotal, 2);
      setDataCabecera({
        ...dataCabecera,
        cantidad: cantidad,
        precioUnitario: precio,
        importe: importe,
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
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      setDataCabecera(dataDetalle.find((map) => map.id === id));
    } else {
      setDataCabecera(dataDetalle.find((map) => map.id === value));
    }
    document.getElementById("cantidad").focus();
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
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    setDataSeries(
      result.data.data.series.sort((a, b) => a.serie.localeCompare(b.serie))
    );
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
      return result.data.data.numero;
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={() => CargarDetalle(row.values.id)}
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
                  <label
                    htmlFor="tipoDocumentoId"
                    className={Global.LabelStyle}
                  >
                    Tipo Doc.
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    autoFocus
                    value={data.tipoDocumentoId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Nuevo" ? false : true}
                    className={
                      modo == "Nuevo"
                        ? Global.InputStyle
                        : Global.InputStyle
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
                  <select
                    id="serie"
                    name="serie"
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Nuevo" ? false : true}
                    className={
                      modo == "Nuevo"
                        ? Global.InputStyle
                        : Global.InputStyle
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
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    F. Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    autoFocus={modo == "Modificar"}
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    onBlur={() => {
                      FechaEmision();
                      ImpuestoBolsa();
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaVencimiento"
                    className={Global.LabelStyle}
                  >
                    F. Vcmto
                  </label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
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
                    className={Global.LabelStyle}
                  >
                    Cotización
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="Cotización"
                    autoComplete="off"
                    disabled={true}
                    value={data.cotizacion ?? ""}
                    onChange={ValidarData}
                    className={
                      modo != "Consultar"
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  <button
                    id="consultarOC"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
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
                    className={Global.LabelStyle}
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
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
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
                    id="consultarCliente"
                    className={
                      Global.BotonBuscar +
                      Global.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar" ? true : false}
                    disabled={checkVarios ? true : false}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
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
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="clienteDireccionId"
                    className={Global.LabelStyle}
                  >
                    Dirección
                  </label>
                  <select
                    id="clienteDireccionId"
                    name="clienteDireccionId"
                    value={data.clienteDireccionId ?? ""}
                    onChange={(e) => CambioDireccion(e.target.value)}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataClienteDirec.map((map) => (
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
                    <label htmlFor="letra" className={Global.LabelStyle}>
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
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultarLetra"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
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
              <div className={Global.ContenedorInputs}>
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
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoVentaId" className={Global.LabelStyle}>
                    Tipo Venta
                  </label>
                  <select
                    id="tipoVentaId"
                    name="tipoVentaId"
                    value={data.tipoVentaId ?? ""}
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
                    data.tipoCobroId == "CH" || data.tipoCobroId == "DE"
                      ? Global.InputTercio
                      : Global.InputFull
                  }
                >
                  <label htmlFor="tipoCobroId" className={Global.LabelStyle}>
                    Tipo Cobro
                  </label>
                  <select
                    id="tipoCobroId"
                    name="tipoCobroId"
                    value={data.tipoCobroId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
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
                    <div className={Global.InputTercio}>
                      <label
                        htmlFor="numeroOperacion"
                        className={Global.LabelStyle}
                      >
                        Nro. Ope.
                      </label>
                      <input
                        type="text"
                        id="numeroOperacion"
                        name="numeroOperacion"
                        placeholder="Número de Operación"
                        autoComplete="off"
                        disabled={modo == "Consultar" ? true : false}
                        value={data.numeroOperacion ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label
                        htmlFor="cuentaCorrienteId"
                        className={Global.LabelStyle}
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
                      className={Global.LabelStyle}
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
                      onClick={() =>
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
                          disabled={modo == "Consultar" ? true : false}
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
                    <label htmlFor="motivoNotaId" className={Global.LabelStyle}>
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
                      placeholder="Sustento"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
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
                <div className={Global.InputMitad}>
                  <label htmlFor="guiaRemision" className={Global.LabelStyle}>
                    Guía Rem.
                  </label>
                  <input
                    type="text"
                    id="guiaRemision"
                    name="guiaRemision"
                    placeholder="Guía de Remisión"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.guiaRemision ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="numeroPedido" className={Global.LabelStyle}>
                    N° Pedido
                  </label>
                  <input
                    type="text"
                    id="numeroPedido"
                    name="numeroPedido"
                    placeholder="N° Pedido"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.numeroPedido ?? ""}
                    onChange={ValidarData}
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
                    placeholder="Observación"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.observacion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <div className={Global.Input25pct}>
                    <div className={Global.CheckStyle}>
                      <Checkbox
                        inputId="isAnticipo"
                        name="isAnticipo"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.isAnticipo ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="isAnticipo"
                      className={Global.LabelCheckStyle + " rounded-r-none "}
                    >
                      Anticipo
                    </label>
                  </div>
                  <div className={Global.Input25pct}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="isOperacionGratuita"
                        name="isOperacionGratuita"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={ValidarData}
                        checked={data.isOperacionGratuita ? true : ""}
                      ></Checkbox>
                    </div>
                    <label
                      htmlFor="isOperacionGratuita"
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Operación Gratuita
                    </label>
                  </div>
                  <div className={Global.Input25pct}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="incluyeIGV"
                        name="incluyeIGV"
                        onChange={(e) => {
                          ValidarData(e);
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
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Incluye IGV
                    </label>
                  </div>
                  <div className={Global.Input25pct}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        onChange={(e) => {
                          ValidarData(e);
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
                    <div className={Global.Input + "w-32"}>
                      <div className={Global.CheckStyle}>
                        <RadioButton
                          inputId="productos"
                          name="productos"
                          value="productos"
                          disabled={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            ValidarDataCabecera(e);
                          }}
                          checked={checkFiltro === "productos"}
                        ></RadioButton>
                      </div>
                      <label
                        htmlFor="productos"
                        className={Global.LabelCheckStyle + "rounded-r-none"}
                      >
                        Productos
                      </label>
                    </div>
                    <div className={Global.Input + "w-32"}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <RadioButton
                          inputId="variosFiltro"
                          name="variosFiltro"
                          value="variosFiltro"
                          disabled={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            ValidarDataCabecera(e);
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
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="descripcion" className={Global.LabelStyle}>
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
                      onChange={ValidarDataCabecera}
                      className={
                        !habilitarFiltro ? Global.InputBoton : Global.InputBoton
                      }
                    />
                    <button
                      id="consultarArticulo"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      disabled={!habilitarFiltro ? false : true}
                      hidden={modo == "Consultar" ? true : false}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => {
                        setDataCabecera([]);
                        AbrirFiltroArticulo();
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="stock" className={Global.LabelStyle}>
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
                      onChange={ValidarDataCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="unidadMedidaDescripcion"
                      className={Global.LabelStyle}
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
                      onChange={ValidarDataCabecera}
                      className={Global.InputStyle}
                    />
                  </div>

                  <div className={Global.Input25pct}>
                    <label htmlFor="cantidad" className={Global.LabelStyle}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      placeholder="Cantidad"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar" ? true : false}
                      value={dataCabecera.cantidad ?? ""}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="precioUnitario"
                      className={Global.LabelStyle}
                    >
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precioUnitario"
                      name="precioUnitario"
                      placeholder="Precio"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar" ? true : false}
                      value={dataCabecera.precioUnitario ?? ""}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={
                        dataCabecera.id != undefined && dataCabecera.id != ""
                          ? Global.InputBoton
                          : Global.InputStyle
                      }
                    />
                    {dataCabecera.id != undefined && dataCabecera.id != "" ? (
                      <button
                        id="enviarDetalle"
                        className={Global.BotonBuscar + Global.BotonPrimary}
                        hidden={modo == "Consultar" ? true : false}
                        onClick={() => AbrirFiltroPrecio()}
                      >
                        <FaChevronDown></FaChevronDown>
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="importe" className={Global.LabelStyle}>
                      Importe
                    </label>
                    <input
                      type="number"
                      id="importe"
                      name="importe"
                      placeholder="Importe"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar" ? true : false}
                      value={dataCabecera.importe ?? ""}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
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

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              {data.tipoDocumentoId != "NV" ? (
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total Inafecto</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {data.totalOperacionesInafectas ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
              ) : (
                <></>
              )}
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Op. Gratuita</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalOperacionesGratuitas ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
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
                    <div className={Global.FilaPrecio}>
                      <p className={Global.FilaContenido}>T. Anticipos</p>
                    </div>
                    <div className={Global.FilaImporte}>
                      <p className={Global.FilaContenido}>
                        {data.totalAnticipos ?? "0.00"}
                      </p>
                    </div>
                    <div className={Global.UltimaFila}></div>
                  </div>
                  <div className="flex">
                    <div className={Global.FilaVacia}></div>
                    <div className={Global.FilaPrecio}>
                      <p className={Global.FilaContenido}>Total</p>
                    </div>
                    <div className={Global.FilaImporte}>
                      <p className={Global.FilaContenido}>
                        {data.totalNeto ?? "0.00"}
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
                        disabled={
                          modo == "Consultar" || data.isOperacionGratuita
                            ? true
                            : false
                        }
                        className={Global.FilaContenidoSelect}
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
                  <div className="flex">
                    <div className={Global.FilaVacia}></div>
                    <div className={Global.FilaImporte}>
                      <label
                        htmlFor="porcentajeRetencion"
                        className={Global.FilaContenido + " !px-0"}
                      >
                        Reten
                      </label>
                      <select
                        id="porcentajeRetencion"
                        name="porcentajeRetencion"
                        value={data.porcentajeRetencion ?? ""}
                        onChange={(e) => ValidarData(e)}
                        disabled={
                          modo == "Consultar" || data.isOperacionGratuita
                            ? true
                            : false
                        }
                        className={Global.FilaContenidoSelect}
                      >
                        {dataRetencion.map((map) => (
                          <option key={map.porcentaje} value={map.porcentaje}>
                            {map.porcentaje}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={Global.FilaImporte}>
                      <p className={Global.FilaContenido}>
                        {data.montoRetencion ?? "0.00"}
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
                <div className={Global.FilaImporte}>
                  <label
                    htmlFor="porcentajeDetraccion"
                    className={Global.FilaContenido + " !px-0"}
                  >
                    Detrac
                  </label>
                  <select
                    id="porcentajeDetraccion"
                    name="porcentajeDetraccion"
                    value={data.porcentajeDetraccion ?? ""}
                    onChange={(e) => ValidarData(e)}
                    disabled={
                      modo == "Consultar" || data.isOperacionGratuita
                        ? true
                        : false
                    }
                    className={Global.FilaContenidoSelect}
                  >
                    {dataDetraccion.map((map) => (
                      <option key={map.porcentaje} value={map.porcentaje}>
                        {map.porcentaje}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.montoDetraccion ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaImporte}>
                  <label
                    htmlFor="factorImpuestoBolsa"
                    className={Global.FilaContenido + " !px-0"}
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
                    className={Global.FilaContenidoSelect + " !w-10"}
                  />
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.montoImpuestoBolsa ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total a Pagar</p>
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
