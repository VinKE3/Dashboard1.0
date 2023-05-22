import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCliente from "../../../components/filtros/FiltroCliente";
import FiltroConcepto from "../../../components/filtros/FiltroConcepto";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import {
  FaPlus,
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones";

//#region Estilos
const TablaStyle = styled.div`
  max-width: 100%;
  overflow-x: auto;
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3) {
    min-width: 70px;
    width: 70px;
    text-align: center;
  }
  & th:nth-child(4) {
    min-width: 140px;
    width: 140px;
  }
  & th:nth-child(5) {
    min-width: 190px;
    width: 190px;
  }
  & th:nth-child(6) {
    min-width: 120px;
    width: 120px;
  }
  & th:nth-child(7) {
    min-width: 90px;
    width: 90px;
    text-align: center;
  }
  & th:nth-child(8) {
    min-width: 75px;
    width: 75px;
    text-align: center;
  }
  & th:nth-child(9),
  & th:nth-child(11) {
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(10),
  & th:nth-child(12) {
    min-width: 110px;
    width: 110px;
    text-align: center;
  }
  & th:nth-child(13),
  & th:nth-child(14) {
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
  const [dataConcepto, setDataConcepto] = useState({
    fechaAbono: moment().format("YYYY-MM-DD"),
  });
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalConcepto, setModalConcepto] = useState(false);
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
      Cliente();
    }
  }, [dataCliente]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (Object.entries(dataConcepto).length > 0) {
      CalcularImporte();
    }
  }, [dataConcepto.precioUnitario]);
  useEffect(() => {
    if (!modalConcepto) {
      ConvertirPrecio();
    }
  }, [modalConcepto]);
  useEffect(() => {
    if (refrescar) {
      ActualizarImportesTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaRegistro);
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
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: dataGlobal.cliente.id,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        clienteDireccion: "",
      }));
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
  const Cliente = async () => {
    setData({
      ...data,
      clienteId: dataCliente.clienteId,
      clienteNombre: dataCliente.clienteNombre,
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteDireccion: dataCliente.clienteDireccion,
    });
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Artículos
  const ValidarDataConcepto = async ({ target }) => {
    //Valida Articulos Varios
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataConcepto([]);
    } else if (target.name == "variosFiltro") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(true);
      setDataConcepto({
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
      setDataConcepto((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataConcepto).length > 0) {
      if (
        data.monedaId != dataConcepto.monedaId &&
        dataConcepto.Id != "000000"
      ) {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "venta",
          dataConcepto,
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataConcepto({
            ...dataConcepto,
            precioCompra: model.precioCompra,
            precioVenta1: model.precioVenta1,
            precioVenta2: model.precioVenta2,
            precioVenta3: model.precioVenta3,
            precioVenta4: model.precioVenta4,
            precioUnitario: model.precioVenta1,
          });
        }
      } else {
        setDataConcepto({
          ...dataConcepto,
          precioUnitario: dataConcepto.precioVenta1,
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
      setDataConcepto({
        ...dataConcepto,
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
    if (Object.entries(dataConcepto).length == 0) {
      return [false, "Seleccione un Producto"];
    }

    //Valida Descripción
    if (dataConcepto.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }

    //Valida montos
    if (Funciones.IsNumeroValido(dataConcepto.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataConcepto.cantidad, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataConcepto.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataConcepto.precioUnitario, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataConcepto.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataConcepto.importe, false),
      ];
    }
    //Valida montos

    //Valida Stock
    if (data.afectarStock) {
      if (dataConcepto.stock < dataConcepto.cantidad) {
        return [
          false,
          "Stock: El artículo no cuenta con el stock necesario para esta operación",
        ];
      }
    }
    //Valia precio Venta debe ser mayor a precio Compra
    if (dataConcepto.precioCompra != undefined) {
      if (dataConcepto.precioCompra > dataConcepto.precioUnitario) {
        Swal.fire({
          title: "Aviso del sistema",
          text: `Precio de Venta: ${dataConcepto.precioUnitario}  |  Precio de Compra: ${dataConcepto.precioCompra}.   
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
      if (dataConcepto.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataConcepto.id) {
            return {
              detalleId: dataConcepto.detalleId,
              id: dataConcepto.id,
              lineaId: dataConcepto.lineaId,
              subLineaId: dataConcepto.subLineaId,
              articuloId: dataConcepto.articuloId,
              marcaId: dataConcepto.marcaId,
              codigoBarras: dataConcepto.codigoBarras,
              descripcion: dataConcepto.descripcion,
              stock: dataConcepto.stock,
              unidadMedidaDescripcion: dataConcepto.unidadMedidaDescripcion,
              unidadMedidaId: dataConcepto.unidadMedidaId,
              cantidad: dataConcepto.cantidad,
              precioCompra: dataConcepto.precioCompra,
              precioUnitario: dataConcepto.precioUnitario,
              montoIGV: dataConcepto.montoIGV,
              subTotal: dataConcepto.subTotal,
              importe: dataConcepto.importe,
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
        if (dataConcepto.id == "00000000") {
          //Valida por id y descripción de artículo
          model = dataDetalle.find((map) => {
            return (
              map.id == dataConcepto.id &&
              map.descripcion == dataConcepto.descripcion
            );
          });
        } else {
          //Valida solo por id
          model = dataDetalle.find((map) => {
            return map.id == dataConcepto.id;
          });
        }

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              id: dataConcepto.id,
              lineaId: dataConcepto.lineaId,
              subLineaId: dataConcepto.subLineaId,
              articuloId: dataConcepto.articuloId,
              marcaId: dataConcepto.marcaId,
              codigoBarras: dataConcepto.codigoBarras,
              descripcion: dataConcepto.descripcion,
              stock: dataConcepto.stock,
              unidadMedidaDescripcion: dataConcepto.unidadMedidaDescripcion,
              unidadMedidaId: dataConcepto.unidadMedidaId,
              cantidad: dataConcepto.cantidad,
              precioCompra: dataConcepto.precioCompra,
              precioUnitario: dataConcepto.precioUnitario,
              montoIGV: dataConcepto.montoIGV,
              subTotal: dataConcepto.subTotal,
              importe: dataConcepto.importe,
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
      setDataConcepto([]);
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
    setDataConcepto(dataDetalle.find((map) => map.id === id));
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
  const AbrirFiltroConcepto = async () => {
    setModalConcepto(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "documentoCompraId",
      accessor: "documentoCompraId",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Fecha",
      accessor: "fechaAbono",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "Banco",
      accessor: "cuentaCorrienteDescripcion",
    },
    {
      Header: "N° Operación",
      accessor: "numeroOperacion",
    },
    {
      Header: "T. Abono",
      accessor: "tipoCobroId",
      Cell: ({ value }) => {
        let comprobante = "";
        switch (value) {
          case "EF":
            comprobante = "EFECTIVO";
            break;
          case "DE":
            comprobante = "DEPÓSITO";
            break;
          case "TR":
            comprobante = "TRANSFERENCIA";
          default:
            comprobante = value;
        }
        return <p>{comprobante}</p>;
      },
    },
    {
      Header: "Monto",
      accessor: "abono",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "M. Abonado",
      accessor: "montoAbonado",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "M",
      accessor: "monedaAbonoId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "N. Saldo",
      accessor: "nuevoSaldo",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "% Interes",
      accessor: "porcentajeInteres",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Monto Interes",
      accessor: "montoInteres",
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
                  onClick={() => CargarDetalle(row.values.documentoCompraId)}
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
                    EliminarDetalle(row.values.documentoCompraId);
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
                    placeholder="Planilla N°"
                    autoComplete="off"
                    autoFocus
                    disabled={modo == "Registrar" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
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
                    htmlFor="documentosReferencia"
                    className={Global.LabelStyle}
                  >
                    Doc. Referencia
                  </label>
                  <input
                    type="text"
                    id="documentosReferencia"
                    name="documentosReferencia"
                    placeholder="Documentos de Referencia"
                    autoComplete="off"
                    disabled={true}
                    value={data.documentosReferencia ?? ""}
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
            {modo != "Consultar" && (
              <div
                className={
                  Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
                }
              >
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="concepto" className={Global.LabelStyle}>
                      Documento
                    </label>
                    <input
                      type="text"
                      id="concepto"
                      name="concepto"
                      placeholder="Buscar Documento"
                      autoComplete="off"
                      disabled={true}
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
                  <div className={Global.InputMitad}>
                    <label htmlFor="monedaId" className={Global.LabelStyle}>
                      Moneda
                    </label>
                    <select
                      id="monedaId"
                      name="monedaId"
                      value={dataConcepto.monedaId ?? ""}
                      disabled={true}
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
                  <div className={Global.InputMitad}>
                    <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                      F. Emisión
                    </label>
                    <input
                      type="date"
                      id="fechaEmision"
                      name="fechaEmision"
                      autoComplete="off"
                      disabled={true}
                      value={moment(dataConcepto.fechaEmision ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="fechaVencimiento"
                      className={Global.LabelStyle}
                    >
                      F. Vcmto.
                    </label>
                    <input
                      type="date"
                      id="fechaVencimiento"
                      name="fechaVencimiento"
                      autoComplete="off"
                      disabled={true}
                      value={moment(dataConcepto.fechaVencimiento ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="total" className={Global.LabelStyle}>
                      Total Documento
                    </label>
                    <input
                      type="number"
                      id="total"
                      name="total"
                      placeholder="Total Documento"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={dataConcepto.total ?? ""}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="saldo" className={Global.LabelStyle}>
                      Saldo por Cobrar
                    </label>
                    <input
                      type="number"
                      id="saldo"
                      name="saldo"
                      placeholder="Saldo"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={dataConcepto.saldo ?? ""}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>

                <div
                  className={Global.ContenedorBasico + Global.FondoContenedor}
                >
                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputTercio}>
                      <label htmlFor="fechaAbono" className={Global.LabelStyle}>
                        F. Abono
                      </label>
                      <input
                        type="date"
                        id="fechaAbono"
                        name="fechaAbono"
                        autoComplete="off"
                        disabled={modo == "Consultar" ? true : false}
                        value={moment(dataConcepto.fechaAbono ?? "").format(
                          "yyyy-MM-DD"
                        )}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label
                        htmlFor="monedaAbonoId"
                        className={Global.LabelStyle}
                      >
                        Moneda
                      </label>
                      <select
                        id="monedaAbonoId"
                        name="monedaAbonoId"
                        value={dataConcepto.monedaAbonoId ?? ""}
                        onChange={ValidarDataConcepto}
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
                        value={dataConcepto.tipoCambio ?? ""}
                        onChange={ValidarDataConcepto}
                        className={
                          modo != "Consultar"
                            ? Global.InputBoton
                            : Global.InputStyle
                        }
                      />
                      <button
                        id="consultarTipoCambio"
                        className={
                          Global.BotonBuscar +
                          Global.Anidado +
                          Global.BotonPrimary
                        }
                        hidden={modo == "Consultar" ? true : false}
                        onClick={() => {
                          GetPorIdTipoCambio(dataConcepto.fechaAbono);
                        }}
                      >
                        <FaUndoAlt></FaUndoAlt>
                      </button>
                    </div>
                  </div>

                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputMitad}>
                      <label
                        htmlFor="tipoCobroId"
                        className={Global.LabelStyle}
                      >
                        Tipo Abono
                      </label>
                      <select
                        id="tipoCobroId"
                        name="tipoCobroId"
                        value={dataConcepto.tipoCobroId ?? ""}
                        onChange={ValidarDataConcepto}
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
                    <div className={Global.InputFull}>
                      <label
                        htmlFor="cuentaCorrienteId"
                        className={Global.LabelStyle}
                      >
                        Banco
                      </label>
                      <select
                        id="cuentaCorrienteId"
                        name="cuentaCorrienteId"
                        value={dataConcepto.cuentaCorrienteId ?? ""}
                        onChange={ValidarDataConcepto}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        {dataCtacte.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={Global.InputMitad}>
                      <label
                        htmlFor="numeroOperacion"
                        className={Global.LabelStyle}
                      >
                        N° Operación
                      </label>
                      <input
                        type="numeroOperacion"
                        id="numeroOperacion"
                        name="numeroOperacion"
                        placeholder="N° Operación"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.numeroOperacion ?? ""}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
                  </div>
                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputTercio}>
                      <label htmlFor="montoAbonado" className={Global.LabelStyle}>
                        Monto Abonado
                      </label>
                      <input
                        type="number"
                        id="montoAbonado"
                        name="montoAbonado"
                        placeholder="Monto Abonado"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.montoAbonado ?? ""}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label htmlFor="saldo" className={Global.LabelStyle}>
                        Importe Abonado
                      </label>
                      <input
                        type="number"
                        id="saldo"
                        name="saldo"
                        placeholder="Saldo"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.saldo ?? ""}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label htmlFor="nuevoSaldo" className={Global.LabelStyle}>
                        Nuevo Saldo
                      </label>
                      <input
                        type="number"
                        id="nuevoSaldo"
                        name="nuevoSaldo"
                        placeholder="Nuevo Saldo"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.nuevoSaldo ?? ""}
                        onChange={ValidarDataConcepto}
                        className={
                          modo == "Consultar"
                            ? Global.InputStyle
                            : Global.InputBoton
                        }
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
                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputTercio}>
                      <label htmlFor="saldo" className={Global.LabelStyle}>
                        % Interés
                      </label>
                      <input
                        type="number"
                        id="saldo"
                        name="saldo"
                        placeholder="Saldo"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.saldo ?? ""}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputTercio}>
                      <label htmlFor="saldo" className={Global.LabelStyle}>
                        Monto Interés
                      </label>
                      <input
                        type="number"
                        id="saldo"
                        name="saldo"
                        placeholder="Saldo"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={dataConcepto.saldo ?? ""}
                        onChange={ValidarDataConcepto}
                        className={Global.InputStyle}
                      />
                    </div>
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
          foco={document.getElementById("personalId")}
        />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataConcepto}
          modo="CO"
          foco={document.getElementById("abono")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
