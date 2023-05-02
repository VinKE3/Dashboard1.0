import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroOrdenCompra from "../../../components/filtros/FiltroOrdenCompra";
import FiltroArticulo from "../../../components/filtros/FiltroArticulo";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
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
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }

  & th:nth-child(7),
  & th:nth-child(8) {
    width: 144px;
    min-width: 144px;
    max-width: 144px;
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
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataOC, setDataOC] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoComp, setDataTipoComp] = useState([]);
  const [dataTipoPag, setDataTipoPag] = useState([]);
  const [dataIgv, setDataIgv] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataMotivoNota, setDataMotivoNota] = useState([]);
  const [dataDocRef, setDataDocRef] = useState([]);
  const [modalProv, setModalProv] = useState(false);
  const [modalOC, setModalOC] = useState(false);
  const [modalArt, setModalArt] = useState(false);
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
      });
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
    if (Object.keys(dataOC).length > 0) {
      if (dataOC.ordenesCompraRelacionadas.length > 0) {
        //Obtenemos el último índice del array
        let obj =
          dataOC.ordenesCompraRelacionadas[
            dataOC.ordenesCompraRelacionadas.length - 1
          ];
        setData({
          ...data,
          proveedorNumeroDocumentoIdentidad:
            obj.proveedorNumeroDocumentoIdentidad,
          proveedorNombre: obj.proveedorNombre,
          proveedorDireccion: obj.proveedorDireccion ?? "",
          cuentaCorrienteId: obj.cuentaCorrienteId ?? "",
          monedaId: obj.monedaId,
          tipoCambio: obj.tipoCambio,
          porcentajeIGV: obj.porcentajeIGV,
          incluyeIGV: obj.incluyeIGV,
          observacion: obj.observacion,
          afectarStock: true,
          tipoCompraId: obj.tipoCompraId,
          tipoPagoId: obj.tipoPagoId,
          ordenesCompraRelacionadas: dataOC.ordenesCompraRelacionadas,
        });
        //Añadimos los detalles
        AgregarDetalleOC();
      } else {
        setData({
          ...data,
          ordenesCompraRelacionadas: dataOC.ordenesCompraRelacionadas,
        });
        //Limpia los detalles
        setDataDetalle([]);
      }
      setRefrescar(true);
    }
  }, [dataOC]);
  useEffect(() => {
    if (Object.entries(dataDetalle).length > 0) {
      setData({ ...data, detalles: dataDetalle });
    }
  }, [dataDetalle]);
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
    if (!modalArt) {
      if (Object.entries(dataArt).length > 0) {
        if (data.monedaId != dataArt.monedaId && dataArt.Id != "000000") {
          ConvertirPreciosAMoneda(dataArt, data.monedaId, data.tipoCambio);
        }
      }
    }
  }, [modalArt]);

  useEffect(() => {
    if (modo != "Registrar") {
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
    if (target.name == "fechaEmision") {
      setTimeout(() => {
        toast(
          "Si la fecha de emisión ha sido cambiada, no olvide consultar el tipo de cambio.",
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }, 2000);
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
        let model = dataTipoPag.find((map) => map.id === target.value);
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
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: "000000",
        proveedorNumeroDocumentoIdentidad: "00000000000",
        proveedorDireccion: null,
        proveedorNombre: "PROVEEDORES VARIOS",
      }));
    } else {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: "",
        proveedorNumeroDocumentoIdentidad: "",
        proveedorDireccion: "",
        proveedorNombre: "",
        ordenesCompraRelacionadas: [],
      }));
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
  const CargarDetalle = async (e, id) => {
    e.preventDefault();
    setDataArt(dataDetalle.find((map) => map.detalleId === id));
  };
  const AgregarDetalleArticulo = async (e) => {
    e.preventDefault();
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
              CargarDetalle(e, model.detalleId);
            }
          });
        }
      }
    } else {
      toast.error(resultado[1], {
        position: "bottom-right",
        autoClose: 2000,
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
  const EliminarDetalle = async (e, id) => {
    e.preventDefault();
    if (id != "") {
      let model = dataDetalle.filter((map) => map.detalleId !== id);
      setDataDetalle(model);
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
  const DetalleDocReferencia = async (e, id) => {
    e.preventDefault();
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
  const ConvertirPreciosAMoneda = async (
    data,
    monedaId,
    tipoCambio,
    precisionRedondeo = 2
  ) => {
    if (monedaId != "D" && monedaId != "S") {
      toast.error("No es posible hacer la conversión a la moneda ingresada", {
        position: "bottom-right",
        autoClose: 2000,
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
          autoClose: 2000,
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

    let precioCompra = 0,
      precioVenta1 = 0,
      precioVenta2 = 0,
      precioVenta3 = 0,
      precioVenta4 = 0;

    if (monedaId == "D") {
      precioCompra = Funciones.RedondearNumero(
        data.precioUnitario / tipoCambio,
        precisionRedondeo
      );
      // precioVenta1 = RedondearNumero(
      //   data.PrecioVenta1 / tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta2 = RedondearNumero(
      //   data.PrecioVenta2 / tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta3 = RedondearNumero(
      //   data.PrecioVenta3 / tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta4 = RedondearNumero(
      //   data.PrecioVenta4 / tipoCambio,
      //   precisionRedondeo
      // );
    } else {
      precioCompra = Funciones.RedondearNumero(
        data.precioUnitario * tipoCambio,
        precisionRedondeo
      );
      // precioVenta1 = RedondearNumero(
      //   data.PrecioVenta1 * tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta2 = RedondearNumero(
      //   data.PrecioVenta2 * tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta3 = RedondearNumero(
      //   data.PrecioVenta3 * tipoCambio,
      //   precisionRedondeo
      // );
      // precioVenta4 = RedondearNumero(
      //   data.PrecioVenta4 * tipoCambio,
      //   precisionRedondeo
      // );
    }

    setDataArt({ ...dataArt, precioUnitario: precioCompra });
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
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    setDataMoneda(result.data.data.monedas);
    setDataTipoComp(result.data.data.tiposCompra);
    setDataTipoPag(result.data.data.tiposPago);
    setDataIgv(result.data.data.porcentajesIGV);
    setDataMotivoNota(result.data.data.motivosNota);
  };
  const ConsultarCtacte = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/Listar`
    );
    let model = result.data.data.data.map((res) => ({
      id: res.cuentaCorrienteId,
      descripcion:
        res.monedaId == "D"
          ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
          : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
    }));
    setDataCtacte(model);
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
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      setTipoMensaje(-1);
      setMensaje([]);
    }
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
  const AbrirFiltroProveedor = async (e) => {
    e.preventDefault();
    setModalProv(true);
  };
  const AbrirFiltroOC = async (e) => {
    e.preventDefault();
    if (data.proveedorId != "") {
      setModalOC(true);
    }
  };
  const AbrirFiltroArticulo = async (e) => {
    e.preventDefault();
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
        return <p className="text-right pr-5">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-right pr-5">
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
          <p className="text-right pr-5">
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
                  onClick={(e) => CargarDetalle(e, row.values.detalleId)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={(e) => {
                    EliminarDetalle(e, row.values.detalleId);
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

            <div
              className={
                Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="id"
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
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    placeholder="Serie"
                    maxLength="4"
                    autoComplete="off"
                    readOnly={modo == "Registrar" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle + Global.Disabled
                    }
                  />
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
                    readOnly={modo == "Registrar" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle + Global.Disabled
                    }
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
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaContable"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    F. Contable
                  </label>
                  <input
                    type="date"
                    id="fechaContable"
                    name="fechaContable"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
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
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="proveedorNumeroDocumentoIdentidad"
                    className={Global.LabelStyle + Global.FondoOscuro}
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
                    className={Global.LabelStyle + Global.FondoOscuro}
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
                    htmlFor="proveedorDireccion"
                    className={Global.LabelStyle + Global.FondoOscuro}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="proveedorDireccion"
                    name="proveedorDireccion"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.proveedorDireccion}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
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
                    onClick={(e) => {
                      e.preventDefault();
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
                    {dataTipoComp.map((map) => (
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
                    {dataTipoPag
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
                        DetalleDocReferencia(e, data.documentoReferenciaId)
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
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="Orden de Compra"
                    autoComplete="off"
                    readOnly={true}
                    value={
                      data.ordenesCompraRelacionadas.map((map) => {
                        return map.numeroDocumento;
                      }) ?? ""
                    }
                    onChange={ValidarData}
                    className={Global.InputBoton + Global.Disabled}
                  />
                  <button
                    id="consultarOC"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => AbrirFiltroOC(e)}
                  >
                    <FaSearch></FaSearch>
                  </button>
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
                Global.ContenedorBasico + " mb-2 " + Global.FondoContenedor
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
                    onClick={(e) => {
                      setDataArt([]);
                      AbrirFiltroArticulo(e);
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
                    onClick={(e) => AgregarDetalleArticulo(e)}
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

            <div className="bg-gradient-to-t from-gray-900 to-gray-800 border-t-0">
              {data.tipoDocumentoId != "03" ? (
                <>
                  <div className="flex">
                    <div className="w-full border border-r-0 border-gray-400"></div>
                    <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-gray-400">
                      <p className="font-semibold text-white">SubTotal</p>
                    </div>
                    <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-gray-400">
                      <p className="font-bold text-white">
                        {data.subTotal ?? "0.00"}
                      </p>
                    </div>
                    <div className="w-28 px-1 border border-gray-400"></div>
                  </div>
                  <div className="flex">
                    <div className="w-full border border-r-0 border-t-0 border-gray-400"></div>
                    <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-t-0 border-gray-400">
                      <label
                        htmlFor="porcentajeIGV"
                        className="font-semibold text-white"
                      >
                        IGV
                      </label>
                      <select
                        id="porcentajeIGV"
                        name="porcentajeIGV"
                        value={data.porcentajeIGV ?? ""}
                        onChange={(e) => ValidarData(e)}
                        disabled={modo == "Consultar" ? true : false}
                        className="ml-2 bg-gray-700 rounded-md"
                      >
                        {dataIgv.map((map) => (
                          <option key={map.porcentaje} value={map.porcentaje}>
                            {map.porcentaje}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-t-0 border-gray-400">
                      <p className="font-bold text-white">
                        {data.montoIGV ?? "0.00"}
                      </p>
                    </div>
                    <div className="w-28 px-1 border border-t-0 border-gray-400"></div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="flex">
                <div className="w-full border border-r-0 border-t-0 border-gray-400"></div>
                <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-t-0 border-gray-400">
                  <p className="font-semibold text-white">Total</p>
                </div>
                <div className="py-1 flex justify-end w-36 pl-28 pr-6 border border-r-0 border-t-0 border-gray-400">
                  <p className="font-bold text-white">{data.total ?? "0.00"}</p>
                </div>
                <div className="w-28 px-1 border border-t-0 border-gray-400"></div>
              </div>
            </div>
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalOC && (
        <FiltroOrdenCompra
          setModal={setModalOC}
          id={data.proveedorId}
          setObjeto={setDataOC}
          objeto={data.ordenesCompraRelacionadas}
        />
      )}
      {modalArt && (
        <FiltroArticulo setModal={setModalArt} setObjeto={setDataArt} />
      )}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default Modal;
