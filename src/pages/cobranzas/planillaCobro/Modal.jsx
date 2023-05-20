import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCliente from "../../../components/filtros/FiltroCliente";
import FiltroArticulo from "../../../components/filtros/FiltroArticulo";
import FiltroPrecio from "../../../components/filtros/FiltroPrecio";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
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
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataClienteDirec, setDataClienteDirec] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  const [dataPrecio, setDataPrecio] = useState([]);
  const [dataLetra, setDataLetra] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  const [modalPrecio, setModalPrecio] = useState(false);
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
    }
  }, [dataCliente]);
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
      setDataArt({
        ...dataArt,
        precioUnitario: dataPrecio.precioUnitario,
      });
    }
  }, [dataPrecio]);
  useEffect(() => {
    if (Object.entries(dataArt).length > 0) {
      CalcularImporte();
    }
  }, [dataArt.precioUnitario]);
  useEffect(() => {
    if (!modalArt) {
      ConvertirPrecio();
    }
  }, [modalArt]);
  useEffect(() => {
    if (refrescar) {
      ActualizarImportesTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
    } else {
      GetDireccion(data.clienteId);
    }
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

    if (target.name == "tipoVentaId") {
      let model = dataTipoCobro.find(
        (map) => map.tipoVentaCompraId == target.value
      );
      setData((prevData) => ({
        ...prevData,
        tipoCobroId: model.id,
        fechaVenta: moment().format("YYYY-MM-DD"),
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
  const ValidarDataArt = async ({ target }) => {
    //Valida Articulos Varios
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataArt([]);
    } else if (target.name == "variosFiltro") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(true);
      setDataArt({
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
      setDataArt((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataArt).length > 0) {
      if (data.monedaId != dataArt.monedaId && dataArt.Id != "000000") {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "venta",
          dataArt,
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataArt({
            ...dataArt,
            precioCompra: model.precioCompra,
            precioVenta1: model.precioVenta1,
            precioVenta2: model.precioVenta2,
            precioVenta3: model.precioVenta3,
            precioVenta4: model.precioVenta4,
            precioUnitario: model.precioVenta1,
          });
        }
      } else {
        setDataArt({
          ...dataArt,
          precioUnitario: dataArt.precioVenta1,
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
      setDataArt({
        ...dataArt,
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
    if (Object.entries(dataArt).length == 0) {
      return [false, "Seleccione un Producto"];
    }

    //Valida Descripción
    if (dataArt.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }

    //Valida montos
    if (Funciones.IsNumeroValido(dataArt.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataArt.cantidad, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataArt.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataArt.precioUnitario, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataArt.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataArt.importe, false),
      ];
    }
    //Valida montos

    //Valida Stock
    if (data.afectarStock) {
      if (dataArt.stock < dataArt.cantidad) {
        return [
          false,
          "Stock: El artículo no cuenta con el stock necesario para esta operación",
        ];
      }
    }
    //Valia precio Venta debe ser mayor a precio Compra
    if (dataArt.precioCompra != undefined) {
      if (dataArt.precioCompra > dataArt.precioUnitario) {
        Swal.fire({
          title: "Aviso del sistema",
          text: `Precio de Venta: ${dataArt.precioUnitario}  |  Precio de Compra: ${dataArt.precioCompra}.   
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
  const AgregarDetalleArticulo = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataArt.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataArt.id) {
            return {
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
              precioCompra: dataArt.precioCompra,
              precioUnitario: dataArt.precioUnitario,
              montoIGV: dataArt.montoIGV,
              subTotal: dataArt.subTotal,
              importe: dataArt.importe,
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
        if (dataArt.id == "00000000") {
          //Valida por id y descripción de artículo
          model = dataDetalle.find((map) => {
            return (
              map.id == dataArt.id && map.descripcion == dataArt.descripcion
            );
          });
        } else {
          //Valida solo por id
          model = dataDetalle.find((map) => {
            return map.id == dataArt.id;
          });
        }

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
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
              precioCompra: dataArt.precioCompra,
              precioUnitario: dataArt.precioUnitario,
              montoIGV: dataArt.montoIGV,
              subTotal: dataArt.subTotal,
              importe: dataArt.importe,
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
      setDataArt([]);
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
  };
  const CargarDetalle = async (id) => {
    setDataArt(dataDetalle.find((map) => map.id === id));
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
  const ActualizarImportesTotales = async () => {
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
      `api/Finanzas/PlanillaCobro/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataCtacte(
      result.data.data.cuentasCorrientes.map((res) => ({
        id: res.cuentaCorrienteId,
        descripcion:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
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
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };
  const AbrirFiltroPrecio = async () => {
    if (dataArt.id != undefined && dataArt.id != "") {
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
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Finanzas", "PlanilllaCobro"]}
            titulo="Planilla de Cobro"
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
                <div className={Global.InputTercio}>
                  <label htmlFor="numero" className={Global.LabelStyle}>
                    Planilla N°
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
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaRegistro" className={Global.LabelStyle}>
                    F. Registro
                  </label>
                  <input
                    type="date"
                    id="fechaRegistro"
                    name="fechaRegistro"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaRegistro ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
                    onBlur={() => {
                      FechaEmision();
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaVenta" className={Global.LabelStyle}>
                    F. Venta
                  </label>
                  <input
                    type="date"
                    id="fechaVenta"
                    name="fechaVenta"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaVenta ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
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
                    htmlFor="clienteDireccion"
                    className={Global.LabelStyle}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="clienteDireccion"
                    name="clienteDireccion"
                    placeholder="Dirección"
                    autoComplete="off"
                    maxLength="10"
                    disabled={true}
                    value={data.clienteDireccion ?? ""}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Responsable
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
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputTercio}>
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
                      .filter((model) => model.tipoVentaCompraId == "CO")
                      .map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                  </select>
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
                  <div className={Global.Input + "w-32"}>
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
                    value={dataArt.descripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={
                      !habilitarFiltro ? Global.InputBoton : Global.InputBoton
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
                    value={dataArt.stock ?? ""}
                    onChange={ValidarDataArt}
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
                    value={dataArt.unidadMedidaDescripcion ?? ""}
                    onChange={ValidarDataArt}
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
                    value={dataArt.cantidad ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
                      CalcularImporte(e.target.name);
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input25pct}>
                  <label htmlFor="precioUnitario" className={Global.LabelStyle}>
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
                    value={dataArt.precioUnitario ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
                      CalcularImporte(e.target.name);
                    }}
                    className={
                      dataArt.id != undefined && dataArt.id != ""
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  {dataArt.id != undefined && dataArt.id != "" ? (
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
                    value={dataArt.importe ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
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
                    onClick={() => AgregarDetalleArticulo()}
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
      {modalArt && (
        <FiltroArticulo
          setModal={setModalArt}
          setObjeto={setDataArt}
          foco={document.getElementById("cantidad")}
        />
      )}
      {modalPrecio && (
        <FiltroPrecio
          setModal={setModalPrecio}
          objeto={{
            precioVenta1: dataArt.precioVenta1,
            precioVenta2: dataArt.precioVenta2,
            precioVenta3: dataArt.precioVenta3,
            precioVenta4: dataArt.precioVenta4,
          }}
          setObjeto={setDataPrecio}
          foco={document.getElementById("precioUnitario")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
