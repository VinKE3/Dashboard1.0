import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCliente from "../../../components/filtros/FiltroCliente";
import FiltroArticulo from "../../../components/filtros/FiltroArticulo";
import FiltroFactura from "../../../components/filtros/FiltroFactura";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
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
  const [dataConductor, setDataConductor] = useState([]);
  const [dataEmpresaTransporte, setDataEmpresaTransporte] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataSerie, setDataSerie] = useState([]);
  const [dataTipo, setDataTipo] = useState([]);
  const [dataVehiculo, setDataVehiculo] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMotivoTraslado, setDataMotivoTraslado] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataClienteDirec, setDataClienteDirec] = useState([]);
  const [dataFactura, setDataFactura] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalFactura, setModalFactura] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoCambio, setTipoCambio] = useState(0);
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
      setData({
        ...data,
        clienteId: dataCliente.clienteId,
        clienteNumeroDocumentoIdentidad:
          dataCliente.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataCliente.clienteNombre,
        clienteDireccionId: dataCliente.clienteDireccionId,
        clienteDireccion: dataCliente.clienteDireccion,
        direccionPartida: dataGlobal.empresaDireccion,
        personalId:
          dataCliente.personalId == ""
            ? dataGlobal.personalId
            : dataCliente.personalId,
      });
    }
  }, [dataCliente]);
  useEffect(() => {
    if (Object.keys(dataFactura).length > 0) {
      //Cabecera
      Factura();
      //Cabecera
      //Detalles
      DetallesFactura(dataFactura.accion);
      //Detalles
      setRefrescar(true);
    }
  }, [dataFactura]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (!modalArt) {
      ConvertirPrecio();
    }
  }, [modalArt]);
  useEffect(() => {
    if (refrescar) {
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
    if (target.name == "afectarStock") {
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

    if (target.name == "motivoTrasladoId") {
      let model = dataMotivoTraslado.find((map) => map.id === target.value);
      setData((prevData) => ({
        ...prevData,
        ingresoEgresoStock: model.tipo,
      }));
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
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        clienteDireccionId: dataGlobal.cliente.direccionPrincipalId,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
        personalId: personal.personalId,
      }));
      setDataClienteDirec(dataGlobal.cliente.direcciones);
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        clienteDireccionId: 0,
        clienteDireccion: "",
        personalId: dataGlobal.personalId,
      }));
      setDataClienteDirec([]);
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
  const Factura = async () => {
    if (dataFactura.accion == "agregar") {
      //Anidar Facturas
      let facturas = [
        ...data.documentosRelacionados,
        dataFactura.documentosRelacionados,
      ];
      //Anidar Facturas

      setData({
        ...data,
        clienteId: dataFactura.clienteId,
        clienteNumeroDocumentoIdentidad:
          dataFactura.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataFactura.clienteNombre,
        clienteDireccionId: dataFactura.clienteDireccionId,
        clienteDireccion: dataFactura.clienteDireccion ?? "",
        direccionPartida: dataGlobal.empresaDireccion, //Debe ser empresaDireccion de GetSimplificado
        personalId: dataFactura.personalId,
        monedaId: dataFactura.monedaId,
        observacion: dataFactura.observacion,
        //Facturas
        documentoRelacionadoId: dataFactura.documentoRelacionadoId,
        documentosRelacionados: [
          ...data.documentosRelacionados,
          dataFactura.documentosRelacionados,
        ],
        numeroFactura: facturas.map((map) => map.numeroDocumento).toString(),
        // Facturas
      });
      GetDireccion(dataFactura.clienteId);
    } else {
      //Anidar Facturas
      let facturas = dataFactura.documentosRelacionados;
      //Anidar Facturas
      setData({
        ...data,
        documentosRelacionados: dataFactura.documentosRelacionados || [],
        numeroFactura: facturas.map((map) => map.numeroDocumento),
      });
      if (dataFactura.documentosRelacionados == []) {
        //Detalles
        setDataDetalle([]);
        //Detalles
      }
    }
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
          tipoCambio
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
    if (data.afectarStock && dataArt.id != "00000000") {
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
        // dataDetalle[dataArt.detalleId - 1] = {
        //   detalleId: dataArt.detalleId,
        //   id: dataArt.id,
        //   lineaId: dataArt.lineaId,
        //   subLineaId: dataArt.subLineaId,
        //   articuloId: dataArt.articuloId,
        //   marcaId: dataArt.marcaId,
        //   codigoBarras: dataArt.codigoBarras,
        //   descripcion: dataArt.descripcion,
        //   stock: dataArt.stock,
        //   unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
        //   unidadMedidaId: dataArt.unidadMedidaId,
        //   cantidad: dataArt.cantidad,
        //   precioCompra: dataArt.precioCompra,
        //   precioUnitario: dataArt.precioUnitario,
        //   montoIGV: dataArt.montoIGV,
        //   subTotal: dataArt.subTotal,
        //   importe: dataArt.importe,
        // };
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
          // dataDetalle.push({
          //   detalleId: detalleId,
          //   id: dataArt.id,
          //   lineaId: dataArt.lineaId,
          //   subLineaId: dataArt.subLineaId,
          //   articuloId: dataArt.articuloId,
          //   marcaId: dataArt.marcaId,
          //   codigoBarras: dataArt.codigoBarras,
          //   descripcion: dataArt.descripcion,
          //   stock: dataArt.stock,
          //   unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
          //   unidadMedidaId: dataArt.unidadMedidaId,
          //   cantidad: dataArt.cantidad,
          //   precioCompra: dataArt.precioCompra,
          //   precioUnitario: dataArt.precioUnitario,
          //   montoIGV: dataArt.montoIGV,
          //   subTotal: dataArt.subTotal,
          //   importe: dataArt.importe,
          // });
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
  const DetallesFactura = async (accion) => {
    //Recorre los detalles que nos retorna el Filtro Orden de Compra
    let detalleEliminado = dataDetalle;
    //Contador para asignar el detalleId
    let contador = dataDetalle.length;

    //Mapeado de los detalles que trae dataFactura
    dataFactura.detalles.map((dataFacturaDetallemap) => {
      contador++;

      //Verifica con los detalles ya seleccionados si coincide algún registro por el id
      let dataDetalleExiste = dataDetalle.find((map) => {
        return map.id == dataFacturaDetallemap.id;
      });
      //Verifica con los detalles ya seleccionados si coincide algún registro por el id

      //Validamos si la accion es Agregar o Eliminar
      if (accion == "agregar") {
        //Si dataDetalleExiste es undefined hace el PUSH
        if (dataDetalleExiste == undefined) {
          //Toma el valor actual de contador para asignarlo
          let i = contador;
          // dataDetalle.push({
          //   detalleId: detalleId,
          //   id: dataFacturaDetallemap.id,
          //   lineaId: dataFacturaDetallemap.lineaId,
          //   subLineaId: dataFacturaDetallemap.subLineaId,
          //   articuloId: dataFacturaDetallemap.articuloId,
          //   unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
          //   marcaId: dataFacturaDetallemap.marcaId,
          //   descripcion: dataFacturaDetallemap.descripcion,
          //   codigoBarras: dataFacturaDetallemap.codigoBarras,
          //   cantidad: dataFacturaDetallemap.cantidad,
          //   stock: dataFacturaDetallemap.stock,
          //   precioCompra: dataFacturaDetallemap.precioCompra,
          //   precioUnitario: dataFacturaDetallemap.precioUnitario,
          //   subTotal: dataFacturaDetallemap.subTotal,
          //   montoIGV: dataFacturaDetallemap.montoIGV,
          //   importe: dataFacturaDetallemap.importe,
          //   presentacion: dataFacturaDetallemap.presentacion ?? "",
          //   unidadMedidaDescripcion: dataFacturaDetallemap.unidadMedidaDescripcion,
          // });

          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: i,
              id: dataFacturaDetallemap.id,
              lineaId: dataFacturaDetallemap.lineaId,
              subLineaId: dataFacturaDetallemap.subLineaId,
              articuloId: dataFacturaDetallemap.articuloId,
              unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
              marcaId: dataFacturaDetallemap.marcaId,
              descripcion: dataFacturaDetallemap.descripcion,
              codigoBarras: dataFacturaDetallemap.codigoBarras,
              cantidad: dataFacturaDetallemap.cantidad,
              stock: dataFacturaDetallemap.stock,
              precioCompra: dataFacturaDetallemap.precioCompra,
              precioUnitario: dataFacturaDetallemap.precioUnitario,
              subTotal: dataFacturaDetallemap.subTotal,
              montoIGV: dataFacturaDetallemap.montoIGV,
              importe: dataFacturaDetallemap.importe,
              presentacion: dataFacturaDetallemap.presentacion ?? "",
              unidadMedidaDescripcion:
                dataFacturaDetallemap.unidadMedidaDescripcion,
            },
          ]);

          //Asigna el valor final de contador y le agrega 1
          setDetalleId(contador + 1);
        } else {
          //Modifica registro en base al id

          //Modifica a dataDetalle en el índice que corresponda
          // dataDetalle[dataDetalleExiste.detalleId - 1] = {
          //   detalleId: dataDetalleExiste.detalleId,
          //   id: dataFacturaDetallemap.id,
          //   lineaId: dataFacturaDetallemap.lineaId,
          //   subLineaId: dataFacturaDetallemap.subLineaId,
          //   articuloId: dataFacturaDetallemap.articuloId,
          //   unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
          //   marcaId: dataFacturaDetallemap.marcaId,
          //   descripcion: dataFacturaDetallemap.descripcion,
          //   codigoBarras: dataFacturaDetallemap.codigoBarras,
          //   cantidad: cantidad,
          //   stock: dataFacturaDetallemap.stock,
          //   precioCompra: dataFacturaDetallemap.precioCompra,
          //   precioUnitario: dataFacturaDetallemap.precioUnitario,
          //   subTotal: subTotal,
          //   montoIGV: montoIGV,
          //   importe: importe,
          //   presentacion: dataFacturaDetallemap.presentacion ?? "",
          //   unidadMedidaDescripcion: dataFacturaDetallemap.unidadMedidaDescripcion,
          // };

          let dataDetalleMod = dataDetalle.map((map) => {
            if (map.id == dataDetalleExiste.id) {
              //Calculos
              let cantidad =
                dataDetalleExiste.cantidad + dataFacturaDetallemap.cantidad;
              let importe = cantidad * dataDetalleExiste.precioUnitario;
              let subTotal = importe * (data.porcentajeIGV / 100);
              let montoIGV = importe - subTotal;
              //Calculos
              return {
                detalleId: dataDetalleExiste.detalleId,
                id: dataFacturaDetallemap.id,
                lineaId: dataFacturaDetallemap.lineaId,
                subLineaId: dataFacturaDetallemap.subLineaId,
                articuloId: dataFacturaDetallemap.articuloId,
                unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
                marcaId: dataFacturaDetallemap.marcaId,
                descripcion: dataFacturaDetallemap.descripcion,
                codigoBarras: dataFacturaDetallemap.codigoBarras,
                cantidad: cantidad,
                stock: dataFacturaDetallemap.stock,
                precioCompra: dataFacturaDetallemap.precioCompra,
                precioUnitario: dataFacturaDetallemap.precioUnitario,
                importe: importe,
                subTotal: subTotal,
                montoIGV: montoIGV,
                presentacion: dataFacturaDetallemap.presentacion ?? "",
                unidadMedidaDescripcion:
                  dataFacturaDetallemap.unidadMedidaDescripcion,
              };
            } else {
              return map;
            }
          });
          setDataDetalle(dataDetalleMod);
        }
      } else {
        //ELIMINAR
        if (dataDetalleExiste != undefined) {
          //Validamos por la cantidad
          if (
            dataDetalleExiste.cantidad - dataFacturaDetallemap.cantidad ==
            0
          ) {
            //Si el resultado es 0 entonces se elimina por completo el registro
            detalleEliminado = detalleEliminado.filter(
              (map) => map.id !== dataDetalleExiste.id
            );
            //Si el resultado es 0 entonces se elimina por completo el registro

            //Toma el valor actual de contador para asignarlo
            let i = 1;
            if (detalleEliminado.length > 0) {
              setDataDetalle(
                detalleEliminado.map((map) => {
                  return {
                    ...map,
                    detalleId: i++,
                  };
                })
              );
              setDetalleId(i);
            } else {
              //Asgina directamente a 1
              setDetalleId(detalleEliminado.length + 1);
              setDataDetalle(detalleEliminado);
            }
            setRefrescar(true);
          } else {
            //Si la resta es mayor a 0 entonces restamos al detalle encontrado

            //Modifica a dataDetalle en el índice que corresponda
            // dataDetalle[dataDetalleExiste.detalleId - 1] = {
            //   detalleId: dataDetalleExiste.detalleId,
            //   id: dataFacturaDetallemap.id,
            //   lineaId: dataFacturaDetallemap.lineaId,
            //   subLineaId: dataFacturaDetallemap.subLineaId,
            //   articuloId: dataFacturaDetallemap.articuloId,
            //   unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
            //   marcaId: dataFacturaDetallemap.marcaId,
            //   descripcion: dataFacturaDetallemap.descripcion,
            //   codigoBarras: dataFacturaDetallemap.codigoBarras,
            //   cantidad: cantidad,
            //   stock: dataFacturaDetallemap.stock,
            //   precioCompra: dataFacturaDetallemap.precioCompra,
            //   precioUnitario: dataFacturaDetallemap.precioUnitario,
            //   subTotal: subTotal,
            //   montoIGV: montoIGV,
            //   importe: importe,
            //   presentacion: dataFacturaDetallemap.presentacion ?? "",
            //   unidadMedidaDescripcion: dataFacturaDetallemap.unidadMedidaDescripcion,
            // };

            let dataDetalleEliminar = dataDetalle.map((map) => {
              if (map.id == dataDetalleExiste.id) {
                //Calculos
                let cantidad =
                  dataDetalleExiste.cantidad - dataFacturaDetallemap.cantidad;
                let importe = cantidad * dataDetalleExiste.precioUnitario;
                let subTotal = importe * (data.porcentajeIGV / 100);
                let montoIGV = importe - subTotal;
                //Calculos

                return {
                  detalleId: dataDetalleExiste.detalleId,
                  id: dataFacturaDetallemap.id,
                  lineaId: dataFacturaDetallemap.lineaId,
                  subLineaId: dataFacturaDetallemap.subLineaId,
                  articuloId: dataFacturaDetallemap.articuloId,
                  unidadMedidaId: dataFacturaDetallemap.unidadMedidaId,
                  marcaId: dataFacturaDetallemap.marcaId,
                  descripcion: dataFacturaDetallemap.descripcion,
                  codigoBarras: dataFacturaDetallemap.codigoBarras,
                  cantidad: cantidad,
                  stock: dataFacturaDetallemap.stock,
                  precioCompra: dataFacturaDetallemap.precioCompra,
                  precioUnitario: dataFacturaDetallemap.precioUnitario,
                  subTotal: subTotal,
                  montoIGV: montoIGV,
                  importe: importe,
                  presentacion: dataFacturaDetallemap.presentacion ?? "",
                  unidadMedidaDescripcion:
                    dataFacturaDetallemap.unidadMedidaDescripcion,
                };
              } else {
                return map;
              }
            });
            setDataDetalle(dataDetalleEliminar);
          }
        }
      }
      setRefrescar(true);
    });
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Venta/GuiaRemision/FormularioTablas`);
    setDataConductor(result.data.data.conductores);
    setDataEmpresaTransporte(result.data.data.empresasTransporte);
    setDataMoneda(result.data.data.monedas);
    setDataSerie(result.data.data.series);
    setDataTipo(result.data.data.tipos);
    setDataVehiculo(result.data.data.vehiculos);
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMotivoTraslado(result.data.data.motivosTraslado);
  };
  const GetPorIdTipoCambio = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje([
          result.response.data.messages[0].textos,
          ["No se podrán realizar las conversiones de precios."],
        ]);
      } else {
        setTipoMensaje(1);
        setMensaje([
          [result.message],
          ["No se podrán realizar las conversiones de precios."],
        ]);
      }
      setTipoCambio(0);
    } else {
      setTipoCambio(result.data.data.precioVenta);
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
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroFactura = async () => {
    setModalFactura(true);
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
                  id="boton-modificar"
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
            menu={["Venta", "GuiaRemision"]}
            titulo="Guía de Remisión"
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
                  <label htmlFor="serie" className={Global.LabelStyle}>
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
                    {dataSerie.map((map) => (
                      <option key={map.serie} value={map.serie}>
                        {map.serie}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="numero" className={Global.LabelStyle}>
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
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
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
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label htmlFor="fechaTraslado" className={Global.LabelStyle}>
                    F. Traslado
                  </label>
                  <input
                    type="date"
                    id="fechaTraslado"
                    name="fechaTraslado"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={moment(data.fechaTraslado ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="numeroFactura " className={Global.LabelStyle}>
                    Factura
                  </label>
                  <input
                    type="text"
                    id="numeroFactura "
                    name="numeroFactura "
                    placeholder="Buscar Factura"
                    autoComplete="off"
                    readOnly={true}
                    value={data.numeroFactura ?? ""}
                    onChange={ValidarData}
                    className={
                      modo != "Consultar"
                        ? Global.InputBoton + Global.Disabled
                        : Global.InputStyle + Global.Disabled
                    }
                  />
                  <button
                    id="consultarFactura"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => AbrirFiltroFactura()}
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
                    readOnly={true}
                    value={data.clienteNumeroDocumentoIdentidad ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle + Global.Disabled}
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
                    htmlFor="direccionPartida"
                    className={Global.LabelStyle}
                  >
                    Partida
                  </label>
                  <input
                    type="text"
                    id="direccionPartida"
                    name="direccionPartida"
                    placeholder="Dirección de Partida"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.direccionPartida ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="clienteDireccionId"
                    className={Global.LabelStyle}
                  >
                    Llegada
                  </label>
                  <select
                    id="clienteDireccionId"
                    name="clienteDireccionId"
                    value={data.clienteDireccionId ?? ""}
                    onChange={(e) => CambioDireccion(e.target.value)}
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
                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Personal
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
                <div className={Global.InputFull}>
                  <label
                    htmlFor="empresaTransporteId"
                    className={Global.LabelStyle}
                  >
                    Emp. Transporte
                  </label>
                  <select
                    id="empresaTransporteId"
                    name="empresaTransporteId"
                    value={data.empresaTransporteId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataEmpresaTransporte.map((map) => (
                      <option
                        key={map.empresaTransporteId}
                        value={map.empresaTransporteId}
                      >
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.Input66pct}>
                  <label htmlFor="costoMinimo" className={Global.LabelStyle}>
                    Costo Mínimo
                  </label>
                  <input
                    type="number"
                    id="costoMinimo"
                    name="costoMinimo"
                    placeholder="Costo Mínimo"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.costoMinimo ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="conductorId" className={Global.LabelStyle}>
                    Conductor
                  </label>
                  <select
                    id="conductorId"
                    name="conductorId"
                    value={data.conductorId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataConductor.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.Input66pct}>
                  <label
                    htmlFor="licenciaConducir"
                    className={Global.LabelStyle}
                  >
                    Licencia de Conducir
                  </label>
                  <input
                    type="text"
                    id="licenciaConducir"
                    name="licenciaConducir"
                    placeholder="Licencia de Conducir"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.licenciaConducir ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="vehiculoId" className={Global.LabelStyle}>
                    Vehículo
                  </label>
                  <select
                    id="vehiculoId"
                    name="vehiculoId"
                    value={data.vehiculoId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataVehiculo.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.marca}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.Input66pct}>
                  <label
                    htmlFor="constanciaInscripcion"
                    className={Global.LabelStyle}
                  >
                    Constancia Inscripción
                  </label>
                  <input
                    type="text"
                    id="constanciaInscripcion"
                    name="constanciaInscripcion"
                    placeholder="Constancia Inscripción"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.constanciaInscripcion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="motivoTrasladoId"
                    className={Global.LabelStyle}
                  >
                    Motivo
                  </label>
                  <select
                    id="motivoTrasladoId"
                    name="motivoTrasladoId"
                    value={data.motivoTrasladoId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataMotivoTraslado.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputMitad}>
                  <div className={Global.InputFull}>
                    <input
                      type="text"
                      id="motivoSustento"
                      name="motivoSustento"
                      autoComplete="off"
                      placeholder="Sustento"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.motivoSustento ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton + " rounded-l-md"}
                    />
                  </div>
                  <div className={Global.Input + "w-24"}>
                    <select
                      id="ingresoEgresoStock"
                      name="ingresoEgresoStock"
                      value={data.ingresoEgresoStock ?? ""}
                      onChange={ValidarData}
                      disabled={
                        modo == "Consultar" || data.motivoTrasladoId != "99"
                          ? true
                          : false
                      }
                      className={
                        data.motivoTrasladoId != "99"
                          ? Global.InputStyle + Global.Anidado + Global.Disabled
                          : Global.InputStyle + Global.Anidado
                      }
                    >
                      {dataTipo.map((map) => (
                        <option key={map.texto} value={map.texto}>
                          {map.texto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="numeroPedido" className={Global.LabelStyle}>
                    Orden Pedido
                  </label>
                  <input
                    type="text"
                    id="numeroPedido"
                    name="numeroPedido"
                    placeholder="Orden Pedido"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.numeroPedido ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input66pct}>
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
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
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
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.observacion ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                  </div>
                  <div className={Global.Input33pct}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.afectarStock ? true : ""}
                        disabled={
                          modo == "Consultar" ||
                          store.session.get("afectarStock") === "False"
                            ? true
                            : false
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
                  <label htmlFor="stock" className={Global.LabelStyle}>
                    Stock
                  </label>
                  <input
                    type="stock"
                    id="stock"
                    name="stock"
                    placeholder="Stock"
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
                    readOnly={true}
                    value={dataArt.unidadMedidaDescripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputStyle + Global.Disabled}
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
                    readOnly={modo == "Consultar" ? true : false}
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
                    readOnly={modo == "Consultar" ? true : false}
                    value={dataArt.precioUnitario ?? ""}
                    onChange={(e) => {
                      ValidarDataArt(e);
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
                    autoComplete="off"
                    placeholder="Importe"
                    readOnly={modo == "Consultar" ? true : false}
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
          </ModalCrud>
        </>
      )}
      {/* Modales */}
      {modalCliente && (
        <FiltroCliente setModal={setModalCliente} setObjeto={setDataCliente} />
      )}
      {modalFactura && (
        <FiltroFactura
          setModal={setModalFactura}
          setObjeto={setDataFactura}
          objeto={data.documentosRelacionados}
        />
      )}
      {modalArt && (
        <FiltroArticulo setModal={setModalArt} setObjeto={setDataArt} />
      )}
      {/* Modales */}
    </>
  );
  //#endregion
};

export default Modal;
