import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/Modal/ModalCrud";
import FiltroProveedor from "../../../components/Filtro/FiltroProveedor";
import FiltroOrdenCompra from "../../../components/Filtro/FiltroOrdenCompra";
import FiltroArticulo from "../../../components/Filtro/FiltroArticulo";
import Mensajes from "../../../components/Funciones/Mensajes";
import TableBasic from "../../../components/Tabla/TableBasic";
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
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoCompra, setDataTipoCompra] = useState([]);
  const [dataTipoPago, setDataTipoPago] = useState([]);
  const [dataIgv, setDataIgv] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataMotivoNota, setDataMotivoNota] = useState([]);
  const [dataDocRef, setDataDocRef] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataOrdenCompra, setDataOrdenCompra] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalProv, setModalProv] = useState(false);
  const [modalOC, setModalOC] = useState(false);
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
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorNombre: dataProveedor.proveedorNombre,
        proveedorDireccion: dataProveedor.proveedorDireccion ?? "",
        ordenesCompraRelacionadas: [],
        numeroOrdenesCompraRelacionadas: [],
      });
      //Valida si hay algún proveedor seleccionado
      if (dataProveedor.proveedorId != "") {
        GetDocReferencia(dataProveedor.proveedorId);
        setRefrescar(true);
      } else {
        setDataDocRef([]);
        setRefrescar(true);
      }
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (Object.keys(dataOrdenCompra).length > 0) {
      //Cabecera
      OrdenDeCompra();
      //Cabecera
      //Detalles
      DetallesOrdenCompra(dataOrdenCompra.accion);
      //Detalles
      OcultarMensajes();
    }
  }, [dataOrdenCompra]);
  useEffect(() => {
    // console.log(dataDetalle);
    setData((prev) => ({ ...prev, detalles: dataDetalle }));
  }, [dataDetalle]);
  useEffect(() => {
    if (!modalArt) {
      //Calculos de precios según la moneda al cerrar el modal
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
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
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
      let model = dataTipoPago.find(
        (map) => map.tipoVentaCompraId == target.value
      );
      setData((prevData) => ({
        ...prevData,
        tipoPagoId: model.id,
        fechaVencimiento: moment().format("YYYY-MM-DD"),
      }));
    }

    if (target.name == "tipoPagoId") {
      let fecha = await FechaVencimiento(data.tipoCompraId, target.value);
      setData((prevState) => ({
        ...prevState,
        fechaVencimiento: fecha != undefined ? fecha : data.fechaVencimiento,
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
  const FechaVencimiento = async (tipoCompraId, tipoPagoId) => {
    if (tipoCompraId != "CO") {
      let model = dataTipoPago.find((map) => map.id === tipoPagoId);
      let fechaHoy = moment().format("YYYY-MM-DD");
      let fecha = moment(moment().format("YYYY-MM-DD"))
        .add(model.plazo, "days")
        .format("YYYY-MM-DD");
      let fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      return fechaRetorno;
    } else {
      let fechaHoy = moment().format("YYYY-MM-DD");
      return fechaHoy;
    }
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
  const OrdenDeCompra = async () => {
    if (dataOrdenCompra.accion == "agregar") {
      //Consultar Fecha
      let fecha = await FechaVencimiento(
        dataOrdenCompra.tipoCompraId,
        dataOrdenCompra.tipoPagoId
      );
      //Consultar Fecha

      //Anidar Órdenes de Compra
      let ordenes = [
        ...data.ordenesCompraRelacionadas,
        dataOrdenCompra.ordenesCompraRelacionadas,
      ];
      //Anidar Órdenes de Compra

      setData({
        ...data,
        proveedorId: dataOrdenCompra.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataOrdenCompra.proveedorNumeroDocumentoIdentidad,
        proveedorNombre: dataOrdenCompra.proveedorNombre,
        proveedorDireccion: dataOrdenCompra.proveedorDireccion ?? "",
        cuentaCorrienteId: dataOrdenCompra.cuentaCorrienteId ?? "",
        monedaId: dataOrdenCompra.monedaId,
        tipoCambio: dataOrdenCompra.tipoCambio,
        porcentajeIGV: dataOrdenCompra.porcentajeIGV,
        incluyeIGV: dataOrdenCompra.incluyeIGV,
        observacion: dataOrdenCompra.observacion,
        tipoCompraId: dataOrdenCompra.tipoCompraId,
        tipoPagoId: dataOrdenCompra.tipoPagoId,
        afectarStock: true,
        fechaVencimiento: fecha != undefined ? fecha : data.fechaVencimiento,
        //Órdenes de compra
        ordenesCompraRelacionadas: [
          ...data.ordenesCompraRelacionadas,
          dataOrdenCompra.ordenesCompraRelacionadas,
        ],
        numeroOrdenesCompraRelacionadas: ordenes.map(
          (map) => map.numeroDocumento
        ),
        // Órdenes de compra
      });
    } else {
      //Anidar Órdenes de Compra
      let ordenes = dataOrdenCompra.ordenesCompraRelacionadas;
      //Anidar Órdenes de Compra
      setData({
        ...data,
        ordenesCompraRelacionadas:
          dataOrdenCompra.ordenesCompraRelacionadas || [],
        numeroOrdenesCompraRelacionadas: ordenes.map(
          (map) => map.numeroDocumento
        ),
      });
      if (dataOrdenCompra.ordenesCompraRelacionadas == []) {
        //Detalles
        setDataDetalle([]);
        //Detalles
      }
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
        precioUnitario: dataGlobal.articulo.precioCompra,
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
          "compra",
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
            precioUnitario: model.precioCompra,
          });
        }
      } else {
        setDataCabecera({
          ...dataCabecera,
          precioUnitario: dataCabecera.precioCompra,
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
    document.getElementById("consultarArticulo").focus();
  };
  const CargarDetalle = async (id) => {
    setDataCabecera(dataDetalle.find((map) => map.id === id));
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
  const DetallesOrdenCompra = async (accion) => {
    //Recorre los detalles que nos retorna el Filtro Orden de Compra
    let detalleEliminado = dataDetalle;
    //Contador para asignar el detalleId
    let contador = dataDetalle.length;
    //Almacena el detalle modificado sumando o restando
    let dataDetalleMod = Object.assign([], dataDetalle);
    let dataDetalleEliminar = dataDetalle;
    //Almacena el detalle modificado sumando o restando

    //Mapea los detalles
    dataOrdenCompra.detalles.map((dataOCDetallemap) => {
      contador++;

      //Verifica con los detalles ya seleccionados si coincide algún registro por el id
      let dataDetalleExiste = dataDetalle.find((map) => {
        return map.id == dataOCDetallemap.id;
      });
      //Verifica con los detalles ya seleccionados si coincide algún registro por el id

      //Validamos si la accion es Agregar o Eliminar
      if (accion == "agregar") {
        //Si dataDetalleExiste es undefined hace el PUSH
        if (dataDetalleExiste == undefined) {
          //Toma el valor actual de contador para asignarlo
          let i = contador;
          //Toma el valor actual de contador para asignarlo

          //Agrega nuevo
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: i,
              id: dataOCDetallemap.id,
              lineaId: dataOCDetallemap.lineaId,
              subLineaId: dataOCDetallemap.subLineaId,
              articuloId: dataOCDetallemap.articuloId,
              unidadMedidaId: dataOCDetallemap.unidadMedidaId,
              marcaId: dataOCDetallemap.marcaId,
              descripcion: dataOCDetallemap.descripcion,
              codigoBarras: dataOCDetallemap.codigoBarras,
              cantidad: dataOCDetallemap.cantidad,
              stock: dataOCDetallemap.stock,
              precioUnitario: dataOCDetallemap.precioUnitario,
              montoIGV: dataOCDetallemap.montoIGV,
              subTotal: dataOCDetallemap.subTotal,
              importe: dataOCDetallemap.importe,
              presentacion: dataOCDetallemap.presentacion ?? "",
              unidadMedidaDescripcion: dataOCDetallemap.unidadMedidaDescripcion,
            },
          ]);
          //Agrega nuevo
          //Variable Local para evitar reemplazo de datos
          dataDetalleMod.push({
            detalleId: i,
            id: dataOCDetallemap.id,
            lineaId: dataOCDetallemap.lineaId,
            subLineaId: dataOCDetallemap.subLineaId,
            articuloId: dataOCDetallemap.articuloId,
            unidadMedidaId: dataOCDetallemap.unidadMedidaId,
            marcaId: dataOCDetallemap.marcaId,
            descripcion: dataOCDetallemap.descripcion,
            codigoBarras: dataOCDetallemap.codigoBarras,
            cantidad: dataOCDetallemap.cantidad,
            stock: dataOCDetallemap.stock,
            precioUnitario: dataOCDetallemap.precioUnitario,
            montoIGV: dataOCDetallemap.montoIGV,
            subTotal: dataOCDetallemap.subTotal,
            importe: dataOCDetallemap.importe,
            presentacion: dataOCDetallemap.presentacion ?? "",
            unidadMedidaDescripcion: dataOCDetallemap.unidadMedidaDescripcion,
          });
          //Variable Local para evitar reemplazo de datos

          //Asigna el valor final de contador y le agrega 1
          setDetalleId(contador + 1);
          //Asigna el valor final de contador y le agrega 1
        } else {
          //Modifica registro en base al id
          dataDetalleMod = dataDetalleMod.map((map) => {
            if (map.id == dataDetalleExiste.id) {
              //Calculos
              let cantidad =
                dataDetalleExiste.cantidad + dataOCDetallemap.cantidad;
              let importe = cantidad * dataOCDetallemap.precioUnitario;
              let subTotal = importe * (data.porcentajeIGV / 100);
              let montoIGV = importe - subTotal;
              //Calculos
              return {
                detalleId: dataDetalleExiste.detalleId,
                id: dataOCDetallemap.id,
                lineaId: dataOCDetallemap.lineaId,
                subLineaId: dataOCDetallemap.subLineaId,
                articuloId: dataOCDetallemap.articuloId,
                unidadMedidaId: dataOCDetallemap.unidadMedidaId,
                marcaId: dataOCDetallemap.marcaId,
                descripcion: dataOCDetallemap.descripcion,
                codigoBarras: dataOCDetallemap.codigoBarras,
                cantidad: cantidad,
                stock: dataOCDetallemap.stock,
                precioUnitario: dataOCDetallemap.precioUnitario,
                subTotal: subTotal,
                montoIGV: montoIGV,
                importe: importe,
                presentacion: dataOCDetallemap.presentacion ?? "",
                unidadMedidaDescripcion:
                  dataOCDetallemap.unidadMedidaDescripcion,
              };
            } else {
              return map;
            }
          });
          //Modifica registro en base al id

          setDataDetalle(dataDetalleMod);
        }
      } else {
        //ELIMINAR
        if (dataDetalleExiste != undefined) {
          //Validamos por la cantidad
          if (dataDetalleExiste.cantidad - dataOCDetallemap.cantidad == 0) {
            //Si el resultado es 0 entonces se elimina por completo el registro
            detalleEliminado = detalleEliminado.filter(
              (map) => map.id !== dataDetalleExiste.id
            );
            //Si el resultado es 0 entonces se elimina por completo el registro

            //Toma el valor actual de contador para asignarlo
            let i = 1;
            //Toma el valor actual de contador para asignarlo

            if (detalleEliminado.length > 0) {
              //Asigna el detalle Filtrado
              setDataDetalle(
                detalleEliminado.map((map) => {
                  return {
                    ...map,
                    detalleId: i++,
                  };
                })
              );
              //Asigna el detalle Filtrado

              setDetalleId(i);
            } else {
              //Asgina directamente a 1
              setDetalleId(detalleEliminado.length + 1);
              //Asgina directamente a 1

              setDataDetalle(detalleEliminado);
            }
            setRefrescar(true);
          } else {
            //Si la resta es mayor a 0 entonces restamos al detalle encontrado

            //AQUI
            //Modifica registro en base al id
            dataDetalleEliminar = dataDetalle.map((map) => {
              if (map.id == dataDetalleExiste.id) {
                //Calculos
                let can =
                  dataDetalleExiste.cantidad - dataOCDetallemap.cantidad;
                let importe = can * dataDetalleExiste.precioUnitario;
                let subTotal = importe * (data.porcentajeIGV / 100);
                let montoIGV = importe - subTotal;
                //Calculos

                return {
                  detalleId: dataDetalleExiste.detalleId,
                  id: dataOCDetallemap.id,
                  lineaId: dataOCDetallemap.lineaId,
                  subLineaId: dataOCDetallemap.subLineaId,
                  articuloId: dataOCDetallemap.articuloId,
                  unidadMedidaId: dataOCDetallemap.unidadMedidaId,
                  marcaId: dataOCDetallemap.marcaId,
                  descripcion: dataOCDetallemap.descripcion,
                  codigoBarras: dataOCDetallemap.codigoBarras,
                  cantidad: can,
                  stock: dataOCDetallemap.stock,
                  precioUnitario: dataDetalleExiste.precioUnitario,
                  subTotal: subTotal,
                  montoIGV: montoIGV,
                  importe: importe,
                  presentacion: dataOCDetallemap.presentacion ?? "",
                  unidadMedidaDescripcion:
                    dataOCDetallemap.unidadMedidaDescripcion,
                };
              } else {
                return map;
              }
            });
            //Modifica registro en base al id

            setDataDetalle(dataDetalleEliminar);
          }
        }
        //ELIMINAR

      }
      //Validamos si la accion es Agregar o Eliminar

      setRefrescar(true);
    });
    //Mapea los detalles
  };
  //Calculos
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.importe;
    }, 0);

    //Porcentajes
    let porcentajeIgvSeleccionado = data.porcentajeIGV;
    let incluyeIgv = data.incluyeIGV;
    //Porcentajes

    //Montos
    let total = 0,
      subTotal = 0,
      montoIGV = 0;
    //Montos

    //Calculo Check IncluyeIGV
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
    //Calculo Check IncluyeIGV

    setData((prevState) => ({
      ...prevState,
      subTotal: Funciones.RedondearNumero(subTotal, 2),
      montoIGV: Funciones.RedondearNumero(montoIGV, 2),
      totalNeto: Funciones.RedondearNumero(total, 2),
      total: Funciones.RedondearNumero(total, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    setDataMoneda(result.data.data.monedas);
    setDataTipoCompra(result.data.data.tiposCompra);
    setDataTipoPago(result.data.data.tiposPago);
    setDataIgv(result.data.data.porcentajesIGV);
    setDataMotivoNota(result.data.data.motivosNota);
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
      `api/Compra/DocumentoCompra/GetDocumentosReferencia?proveedorId=${id}`
    );
    setDataDocRef(result.data.data);
    setRefrescar(true);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroProveedor = async () => {
    setModalProv(true);
  };
  const AbrirFiltroOC = async () => {
    if (data.proveedorId != "") {
      setModalOC(true);
    }
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
            menu={["Compra", "DocumentoCompra"]}
            titulo="Documentos de Compra"
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
                    disabled={modo == "Registrar" ? false : true}
                    className={
                      modo == "Registrar"
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
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    placeholder="Serie"
                    autoComplete="off"
                    maxLength="4"
                    disabled={modo == "Registrar" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
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
                    disabled={modo == "Registrar" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
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
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    onBlur={FechaEmision}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaContable" className={Global.LabelStyle}>
                    F. Contable
                  </label>
                  <input
                    type="date"
                    id="fechaContable"
                    name="fechaContable"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaContable ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
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
                    placeholder="Buscar Proveedor"
                    autoComplete="off"
                    disabled={true}
                    value={data.proveedorNombre ?? ""}
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarProveedor"
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
                  <label
                    htmlFor="proveedorDireccion"
                    className={Global.LabelStyle}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="proveedorDireccion"
                    name="proveedorDireccion"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.proveedorDireccion}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
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
                      modo == "Consultar"
                        ? Global.InputStyle
                        : Global.InputBoton
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
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoCompraId" className={Global.LabelStyle}>
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
                    {dataTipoCompra.map((map) => (
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
                  <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
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
                    {dataTipoPago
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
                <div className={Global.Input66pct}>
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
                <div className={Global.InputFull}>
                  <label
                    htmlFor="numeroOrdenesCompraRelacionadas"
                    className={Global.LabelStyle}
                  >
                    O.C
                  </label>
                  <input
                    type="text"
                    id="numeroOrdenesCompraRelacionadas"
                    name="numeroOrdenesCompraRelacionadas"
                    placeholder="Orden de Compra"
                    autoComplete="off"
                    disabled={true}
                    value={data.numeroOrdenesCompraRelacionadas ?? ""}
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
                    onClick={() => AbrirFiltroOC()}
                  >
                    <FaSearch></FaSearch>
                  </button>
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
                    className={Global.InputBoton}
                  />
                  <div className={Global.Input36}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="incluyeIGV"
                        name="incluyeIGV"
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.incluyeIGV ? true : ""}
                        disabled={
                          data.tipoDocumentoId == "03" || modo == "Consultar"
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
                  <div className={Global.Input36}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        disabled={modo == "Consultar" ? true : false}
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
                      P. Unitario
                    </label>
                    <input
                      type="number"
                      id="precioUnitario"
                      name="precioUnitario"
                      placeholder="Precio Unitario"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar" ? true : false}
                      value={dataCabecera.precioUnitario ?? ""}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
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
              />
            </TablaStyle>
            {/* Tabla Detalle */}

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
      {modalProv && (
        <FiltroProveedor
          setModal={setModalProv}
          setObjeto={setDataProveedor}
          foco={document.getElementById("proveedorDireccion")}
        />
      )}
      {modalOC && (
        <FiltroOrdenCompra
          setModal={setModalOC}
          id={data.proveedorId}
          objeto={data.ordenesCompraRelacionadas}
          setObjeto={setDataOrdenCompra}
          foco={document.getElementById("consultarOC")}
        />
      )}
      {modalArt && (
        <FiltroArticulo
          setModal={setModalArt}
          setObjeto={setDataCabecera}
          foco={document.getElementById("cantidad")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;