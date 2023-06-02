import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
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
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
  FaChevronDown,
} from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
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
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 90px;
    text-align: center;
  }

  & th:nth-child(6),
  & th:nth-child(7) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
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
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  const [dataIgv, setDataIgv] = useState([]);
  const [dataRetencion, setDataRetencion] = useState([]);
  const [dataPercepcion, setDataPercepcion] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataClienteDirec, setDataClienteDirec] = useState([]);
  const [dataClienteContacto, setDataClienteContacto] = useState([]);
  const [dataContactoCargo, setDataContactoCargo] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  const [dataPrecio, setDataPrecio] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  const [modalPrecio, setModalPrecio] = useState(false);
  //Modales de Ayuda
  const [checkCargo, setCheckCargo] = useState(false);
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
      if (
        dataCliente.direcciones !== undefined &&
        dataCliente.contactos !== undefined
      ) {
        setDataClienteDirec(dataCliente.direcciones);
        setDataClienteContacto(dataCliente.contactos);
      }
      Cliente();
      setRefrescar(true);
    }
  }, [dataCliente]);
  useEffect(() => {
    if (Object.keys(dataClienteContacto).length > 0) {
      //Busca el contacto en dataClienteContacto
      let contacto = dataClienteContacto.find(
        (map) => map.id === data.contactoId
      );
      if (contacto !== undefined) {
        //Si lo encuentra lo reemplaza
        setData({
          ...data,
          contactoId: contacto.id,
          contactoNombre:
            contacto.nombres === undefined ? "" : contacto.nombres,
          contactoTelefono:
            contacto.telefono === undefined ? "" : contacto.telefono,
          contactoCorreoElectronico:
            contacto.correoElectronico === undefined
              ? ""
              : contacto.correoElectronico,
          contactoCargoId:
            contacto.cargoId === undefined ? "" : contacto.cargoId,
          contactoCelular:
            contacto.celular === undefined ? "" : contacto.celular,
        });
      } else {
        //Sino asigna en blanco
        setData({
          ...data,
          contactoId: "",
          contactoNombre: "",
          contactoTelefono: "",
          contactoCorreoElectronico: "",
          contactoCargoId: "",
          contactoCelular: "",
        });
      }
    }
  }, [data.contactoId]);
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
      dataClienteContacto;
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaEmision);
    } else {
      GetDireccion(data.clienteId);
      GetContacto(data.clienteId);
    }
    Tablas();
    TablasCargo(data.clienteId);
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
    if (target.name == "incluyeIGV") {
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

    if (
      target.name == "porcentajeIGV" ||
      target.name == "porcentajeRetencion" ||
      target.name == "porcentajePercepcion"
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
        departamentoId:
          dataGlobal.cliente.direcciones !== undefined
            ? dataGlobal.cliente.direcciones[0].departamentoId
            : null,
        provinciaId:
          dataGlobal.cliente.direcciones !== undefined
            ? dataGlobal.cliente.direcciones[0].provinciaId
            : null,
        distritoId:
          dataGlobal.cliente.direcciones !== undefined
            ? dataGlobal.cliente.direcciones[0].distritoId
            : null,
        direcciones: dataGlobal.cliente.direcciones,
      }));
      setDataClienteDirec(dataGlobal.cliente.direcciones);
      setDataClienteContacto(dataGlobal.cliente.contactos);
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
        departamentoId: null,
        provinciaId: null,
        distritoId: null,
        direcciones: [
          {
            departamentoId: null,
            distritoId: null,
            provinciaId: null,
          },
        ],
      }));
      setDataClienteDirec([]);
      setDataClienteContacto([]);
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
        departamentoId: model.departamentoId,
        provinciaId: model.provinciaId,
        distritoId: model.distritoId,
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
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteNombre: dataCliente.clienteNombre,
      clienteDireccionId: dataCliente.clienteDireccionId,
      clienteDireccion: dataCliente.clienteDireccion,
      clienteTelefono: dataCliente.clienteTelefono,
      fechaVencimiento: fecha != undefined ? fecha : data.fechaVencimiento,
      departamentoId:
        dataCliente.direcciones !== undefined
          ? dataCliente.direcciones[0].departamentoId
          : null,
      provinciaId:
        dataCliente.direcciones !== undefined
          ? dataCliente.direcciones[0].provinciaId
          : null,
      distritoId:
        dataCliente.direcciones !== undefined
          ? dataCliente.direcciones[0].distritoId
          : null,
      personalId:
        dataCliente.personalId == ""
          ? dataGlobal.personalId
          : dataCliente.personalId,
      ...(dataCliente.contactos !== undefined && {
        contactoId: dataCliente.contactos[0]?.id,
        contactoNombre: dataCliente.contactos[0]?.nombres,
        contactoTelefono: dataCliente.contactos[0]?.telefono,
        contactoCorreoElectronico: dataCliente.contactos[0]?.correoElectronico,
        contactoCargoId: dataCliente.contactos[0]?.cargoId,
        contactoCelular: dataCliente.contactos[0]?.celular,
      }),
    });
  };
  const OcultarMensajes = () => {
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
        cantidad: Funciones.RedondearNumero(cantidad, 2),
        precioUnitario: Funciones.RedondearNumero(precio, 2),
        importe: Funciones.RedondearNumero(importe, 2),
        subTotal: subTotal,
        montoIGV: montoIGV,
      });
    }
  };
  //Artículos

  //#endregion

  //#region Funcion Detalles
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
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.importe;
    }, 0);

    //Porcentajes
    let porcentajeIgvSeleccionado = data.porcentajeIGV;
    let porcentajeRetencionSelect = data.porcentajeRetencion;
    let porcentajePercepcionSelect = data.porcentajePercepcion;
    let incluyeIgv = data.incluyeIGV;
    //Porcentajes
    //Montos
    let total = 0,
      totalNeto = 0,
      subTotal = 0,
      montoIGV = 0,
      percepcion = 0,
      retencion = 0;
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

    //Calculos
    retencion = Funciones.RedondearNumero(
      totalNeto * (porcentajeRetencionSelect / 100),
      2
    );
    percepcion = Funciones.RedondearNumero(
      totalNeto * (porcentajePercepcionSelect / 100),
      2
    );
    total = totalNeto + percepcion + retencion;
    //Calculos

    setData((prevState) => ({
      ...prevState,
      subTotal: Funciones.RedondearNumero(subTotal, 2),
      montoIGV: Funciones.RedondearNumero(montoIGV, 2),
      totalNeto: Funciones.RedondearNumero(total, 2),
      montoRetencion: Funciones.RedondearNumero(retencion, 2),
      montoPercepcion: Funciones.RedondearNumero(percepcion, 2),
      total: Funciones.RedondearNumero(totalNeto, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Venta/Cotizacion/FormularioTablas`);
    setDataTipoDocumento([{ id: "CT", descripcion: "Cotización" }]);
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        ...res,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataCtacte(
      result.data.data.cuentasCorrientes.map((res) => ({
        id: res.cuentaCorrienteId,
        cuentaCorrienteDes:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
    setDataMoneda(result.data.data.monedas);
    setDataTipoVenta(result.data.data.tiposVenta);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataIgv(result.data.data.porcentajesIGV);
    setDataPercepcion(result.data.data.porcentajesPercepcion);
    setDataRetencion(result.data.data.porcentajesRetencion);
  };
  const TablasCargo = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteContacto/FormularioTablas`
    );
    setDataContactoCargo(result.data.data.cargos);
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
  const GetContacto = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteContacto/ListarPorCliente?clienteId=${id}`
    );
    setDataClienteContacto(result.data.data);
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
            menu={["Venta", "Cotizacion"]}
            titulo="Cotización"
            cerrar={false}
            foco={document.getElementById("tablaCotizacion")}
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
                <div className={Global.InputMitad}>
                  <label htmlFor="id" className={Global.LabelStyle}>
                    Tipo Doc.
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    value={data.tipoDocumentoId ?? ""}
                    onChange={ValidarData}
                    disabled={true}
                    className={Global.InputStyle}
                  >
                    {dataTipoDocumento.map((map) => (
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
                    autoFocus
                    maxLength="4"
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      Global.InputStyle
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
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      Global.InputStyle
                    }
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
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
                    onChange={ValidarData}
                    onBlur={() => {
                      FechaEmision();
                    }}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="fechaVencimiento"
                    className={Global.LabelStyle}
                  >
                    Fecha Vencimiento
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
                    id="consultarCliente"
                    className={
                      Global.BotonBuscar +
                      Global.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={(e) => AbrirFiltroCliente(e)}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <div className={Global.Input + " w-20"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
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
                    <label htmlFor="varios" className={Global.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="clienteTelefono"
                    className={Global.LabelStyle}
                  >
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="clienteTelefono"
                    name="clienteTelefono"
                    placeholder="Teléfono"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteTelefono ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="clienteDireccion"
                    className={Global.LabelStyle}
                  >
                    Dirección
                  </label>
                  <select
                    id="clienteDireccionId"
                    name="clienteDireccionId"
                    value={data.clienteDireccionId ?? ""}
                    onChange={(e) => {
                      CambioDireccion(e.target.value);
                    }}
                    disabled={modo == "Consultar"}
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

              <div className={Global.ContenedorBasico}>
                <p className={Global.Subtitulo}>Atención</p>

                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="contactoId" className={Global.LabelStyle}>
                      Nombre Contacto
                    </label>
                    <select
                      id="contactoId"
                      name="contactoId"
                      value={data.contactoId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar"}
                      className={Global.InputStyle}
                    >
                      {/* <option key={"-1"} value={""}>
                        --SELECCIONAR CONTACTO--
                      </option> */}
                      {Object.entries(dataClienteContacto).length > 0 &&
                        dataClienteContacto.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.nombres}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="contactoTelefono"
                      className={Global.LabelStyle}
                    >
                      Telef. Contacto
                    </label>
                    <input
                      type="text"
                      id="contactoTelefono"
                      name="contactoTelefono"
                      placeholder="Teléfono"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.contactoTelefono ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="contactoCargoDescripcion"
                      className={Global.LabelStyle}
                    >
                      Cargo Contacto
                    </label>
                    <select
                      id="contactoCargoId"
                      name="contactoCargoId"
                      value={data.contactoCargoId ?? ""}
                      onChange={ValidarData}
                      disabled={checkCargo ? false : true}
                      className={Global.InputBoton}
                    >
                      <option key={"-1"} value={""}>
                        --SELECCIONAR CARGO--
                      </option>
                      {Object.entries(dataContactoCargo).length > 0 &&
                        dataContactoCargo.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className={Global.Input + "w-24"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="editarCargo"
                        name="editarCargo"
                        disabled={modo == "Consultar"}
                        checked={checkCargo}
                        onChange={(e) => setCheckCargo(e.checked)}
                      />
                    </div>
                    <label
                      htmlFor="editarCargo"
                      className={Global.LabelCheckStyle}
                    >
                      Editar
                    </label>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="contactoCorreoElectronico"
                      className={Global.LabelStyle}
                    >
                      E-mail Contacto
                    </label>
                    <input
                      type="text"
                      id="contactoCorreoElectronico"
                      name="contactoCorreoElectronico"
                      placeholder="E-mail"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.contactoCorreoElectronico ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="contactoCelular"
                      className={Global.LabelStyle}
                    >
                      Cel. Contacto
                    </label>
                    <input
                      type="text"
                      id="contactoCelular"
                      name="contactoCelular"
                      placeholder="Celular"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.contactoCelular ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
              </div>

              <div className={Global.InputFull}>
                <label htmlFor="personalId" className={Global.LabelStyle}>
                  Vendedor
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  value={data.personalId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar"}
                  className={Global.InputStyle}
                >
                  {dataVendedor.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.personal}
                    </option>
                  ))}
                </select>
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
                    className={Global.InputBoton}
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
                  <label htmlFor="tipoVentaId" className={Global.LabelStyle}>
                    T. Venta
                  </label>
                  <select
                    id="tipoVentaId"
                    name="tipoVentaId"
                    value={data.tipoVentaId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar"}
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
                      ? Global.InputMitad
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
                    disabled={modo == "Consultar"}
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
                    <div className={Global.InputMitad}>
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
                        disabled={modo == "Consultar"}
                        value={data.numeroOperacion ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="cuentaCorrienteDescripcion"
                    className={Global.LabelStyle}
                  >
                    Cta. Cte.
                  </label>
                  <select
                    id="cuentaCorrienteDescripcion"
                    name="cuentaCorrienteDescripcion"
                    value={data.cuentaCorrienteDescripcion ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar"}
                    className={Global.InputStyle}
                  >
                    <option key={"-1"} value={""}>
                      --SELECCIONAR--
                    </option>
                    {dataCtacte.map((map) => (
                      <option
                        key={map.cuentaCorrienteDes}
                        value={map.cuentaCorrienteDes}
                      >
                        {map.cuentaCorrienteDes}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputMitad}>
                  <label htmlFor="validez" className={Global.LabelStyle}>
                    Validez Cot.
                  </label>
                  <input
                    type="text"
                    id="validez"
                    name="validez"
                    placeholder="Validez de la cotización"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.validez ?? ""}
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
                    disabled={modo == "Consultar"}
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
                      className={Global.LabelCheckStyle}
                    >
                      Incluye IGV
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
                          disabled={modo == "Consultar"}
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
                          disabled={modo == "Consultar"}
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
                      disabled={modo == "Consultar"}
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
                      disabled={modo == "Consultar"}
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
                        hidden={modo == "Consultar"}
                        onKeyDown={(e) => Funciones.KeyClick(e)}
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
                      disabled={modo == "Consultar"}
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
                id={"tablaDetalleCotizacion"}
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
            </DivTabla>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>SubTotal</p>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.subTotal ?? "0.00"}
                  </p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
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
                    disabled={modo == "Consultar"}
                    className={Global.FilaContenidoSelect}
                  >
                    {dataIgv.map((map) => (
                      <option key={map.porcentaje} value={map.porcentaje}>
                        {map.porcentaje}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.montoIGV ?? "0.00"}
                  </p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
              </div>

              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total</p>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>{data.total ?? "0.00"}</p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <label
                    htmlFor="porcentajeRetencion"
                    className={Global.FilaContenido + " !px-0"}
                  >
                    Reten.
                  </label>
                  <select
                    id="porcentajeRetencion"
                    name="porcentajeRetencion"
                    value={data.porcentajeRetencion ?? ""}
                    onChange={(e) => ValidarData(e)}
                    disabled={modo == "Consultar"}
                    className={Global.FilaContenidoSelect}
                  >
                    {dataRetencion.map((map) => (
                      <option key={map.porcentaje} value={map.porcentaje}>
                        {map.porcentaje}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.montoRetencion ?? "0.00"}
                  </p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <label
                    htmlFor="porcentajePercepcion"
                    className={Global.FilaContenido + " !px-0"}
                  >
                    Percep.
                  </label>
                  <select
                    id="porcentajePercepcion"
                    name="porcentajePercepcion"
                    value={data.porcentajePercepcion ?? ""}
                    onChange={(e) => ValidarData(e)}
                    disabled={modo == "Consultar"}
                    className={Global.FilaContenidoSelect}
                  >
                    {dataPercepcion.map((map) => (
                      <option key={map.porcentaje} value={map.porcentaje}>
                        {map.porcentaje}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.montoPercepcion ?? "0.00"}
                  </p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
              </div>

              <div className="flex">
                <div className={Global.FilaFooter + Global.FilaVacia}></div>
                <div className={Global.FilaFooter + Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total a pagar</p>
                </div>
                <div className={Global.FilaFooter + Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalNeto ?? "0.00"}
                  </p>
                </div>
                <div className={Global.FilaFooter + Global.UltimaFila}></div>
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
    </>
  );
  //#endregion
};

export default Modal;
