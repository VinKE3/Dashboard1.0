//#region import
import React, { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ToastContainer } from "react-toastify";
import * as G from "../../components/Global";
//#region informeSistema
import ReporteClientes from "./sistema/ReporteClientes";
import ReporteProveedores from "./sistema/ReporteProveedores";
import ReportePersonal from "./sistema/ReportePersonal";
import ReportePersonalCliente from "./sistema/ReportePersonalCliente";
//#endregion
//#region informeArticulo
import KardexMarca from "./articulo/KardexMarca";
import ListadoCostos from "./articulo/ListadoCostos";
import MovimientoDeArticulos from "./articulo/MovimientoArticulo";
import StockValorizado from "./articulo/StockValorizado";
import TomaInventario from "./articulo/TomaInventario";
//#endregion
//#region informeCompra
import ComprasDetalle from "./compra/ComprasDetalle";
import ComprasPorProveedor from "./compra/ComprasPorProveedor";
import DeudasPorPagar from "./compra/DeudasPorPagar";
import EntradaAlmacen from "./compra/EntradaAlmacen";
import GuiasDeCompra from "./compra/GuiasDeCompra";
import GuiasDeCompraDetalle from "./compra/GuiasDeCompraDetalle";
import LetrasCambio from "./compra/LetrasCambio";
import OrdenDeCompra from "./compra/OrdenDeCompra";
import OrdenDeCompraPendiente from "./compra/OrdenDeCompraPendiente";
import ReporteCompra from "./compra/ReporteCompra";
import TodasLasCompras from "./compra/TodasLasCompras";
//#endregion
//#region informeVenta
import GuiasDeRemision from "./venta/GuiasDeRemision";
import GuiaValorizada from "./venta/GuiaValorizada";
import InformeCilindros from "./venta/InformeCilindros";
import RegistroSalidaCilindros from "./venta/RegistroSalidaCilindros";
import RegistroVentaDetalle from "./venta/RegistroVentaDetalle";
import RegistroVentas from "./venta/RegistroVentas";
import RegistroVentaUbigueo from "./venta/RegistroVentaUbigueo";
import ReporteDocumentos from "./venta/ReporteDocumentos";
import VentasPorCliente from "./venta/VentasPorCliente";
import VentasPorClienteDocumento from "./venta/VentasPorClienteDocumento";
import VentasPorPersonal from "./venta/VentasPorPersonal";
import VentasPorPersonalArticulo from "./venta/VentasPorPersonalArticulo";
import VentasPorPersonalDetalle from "./venta/VentasPorPersonalDetalle";
import VentaTiendaMarca from "./venta/VentaTiendaMarca";
import VentaTipoDocumento from "./venta/VentaTipoDocumento";
//#endregion

//#region informeCobranza
import LetrasDeCambio from "./cobranza/LetrasDeCambio";
import InformeGeneralDetallado from "./cobranza/InformeGeneralDetallado";
import CuentasPorCobrar from "./cobranza/CuentasPorCobrar";
import CuentasPorCobrarVencidos from "./cobranza/CuentasPorCobrarVencidos";
import InformeCobranzas from "./cobranza/InformeCobranzas";
import InformePlanillaPagos from "./cobranza/InformePlanillaPagos";
import InfomeControlPlanillas from "./cobranza/InfomeControlPlanillas";
//#endregion

//#region informeFinanza
import ReporteIngresosEgresos from "./finanza/ReporteIngresosEgresos";
import PagosPendientes from "./finanza/PagosPendientes";
import ReporteIngresosTiendas from "./finanza/ReporteIngresosTiendas";
//#endregion

//#region informeGerencia
import InformeGerenciaComprasArticulos from "./gerencia/InformeGerenciaComprasArticulos";
import InformeGerenciaCostosProductos from "./gerencia/InformeGerenciaCostosProductos";
import InformeGerenciaOrdenDeCompra from "./gerencia/InformeGerenciaOrdenDeCompra";
import InformeGerenciaRegistroComprasMes from "./gerencia/InformeGerenciaRegistroComprasMes";
import InformeGerenciaTiendas from "./gerencia/InformeGerenciaTiendas";
import InformeGerenciaUtilidades from "./gerencia/InformeGerenciaUtilidades";
import InformeGerenciaVentasArticulos from "./gerencia/InformeGerenciaVentasArticulos";
import InformeGerenciaVentasPorArticuloVendedor from "./gerencia/InformeGerenciaVentasPorArticuloVendedor";
import InformeGerenciaVentasPorMarcaArituculos from "./gerencia/InformeGerenciaVentasPorMarcaArituculos";
import InformeGerenciaVentasPorVendedorClientes from "./gerencia/InformeGerenciaVentasPorVendedorClientes";
import InformeGerenciaVentasPorVendedorMes from "./gerencia/InformeGerenciaVentasPorVendedorMes";
import InformeGerenciaVentasPorVendedorMesDia from "./gerencia/InformeGerenciaVentasPorVendedorMesDia";
//#endregion
//#endregion

const Informe = () => {
  //#region useStates
  //#region Sistemas
  const [modalCliente, setModalCliente] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalPersonal, setModalPersonal] = useState(false);
  const [modalPersonalCliente, setModalPersonalCliente] = useState(false);
  //#endregion

  //#region Articulos
  const [modalTomaInventario, setModalTomaInventario] = useState(false);
  const [modalStockValorizado, setModalStockValorizado] = useState(false);
  const [modalListadoCostos, setModalListadoCostos] = useState(false);
  const [modalMovArticulo, setModalMovArticulo] = useState(false);
  const [modalKardexMarca, setModalKardexMarca] = useState(false);
  //#endregion

  //#region Compras
  const [modalTodasLasCompras, setModalTodasLasCompras] = useState(false);
  const [modalComprasDetalle, setModalComprasDetalle] = useState(false);
  const [modalComprasPorProveedor, setModalComprasPorProveedor] =
    useState(false);
  const [modalOrdenDeCompra, setModalOrdenDeCompra] = useState(false);
  const [modalOrdenDeCompraPendiente, setModalOrdenDeCompraPendiente] =
    useState(false);
  const [modalReporteDeCompras, setModalReporteDeCompras] = useState(false);
  const [modalEntradaAlmacen, setModalEntradaAlmacen] = useState(false);
  const [modalLetrasDeCambio, setModalLetrasDeCambio] = useState(false);
  const [modalGuiasDeCompra, setModalGuiasDeCompra] = useState(false);
  const [modalGuiasDeCompraDetalle, setModalGuiasDeCompraDetalle] =
    useState(false);
  const [modalDeudasPorPagar, setModalDeudasPorPagar] = useState(false);
  //#endregion

  //#region Ventas
  const [modalVentaTipoDocumento, setModalVentaTipoDocumento] = useState(false);
  const [modalVentaTiendaMarca, setModalVentaTiendaMarca] = useState(false);
  const [modalRegistroVentas, setModalRegistroVentas] = useState(false);
  const [modalRegistroVentaDetalle, setModalRegistroVentaDetalle] =
    useState(false);
  const [modalRegistroventaUbigueo, setModalRegistroventaUbigueo] =
    useState(false);
  const [modalRegistroSalidaCilindros, setModalRegistroSalidaCilindros] =
    useState(false);
  const [modalVentasPorCliente, setModalVentasPorCliente] = useState(false);
  const [modalVentasPorClienteDocumento, setModalVentasPorClienteDocumento] =
    useState(false);
  const [modalVentasPorPersonal, setModalVentasPorPersonal] = useState(false);
  const [modalVentasPorPersonalDetalle, setModalVentasPorPersonalDetalle] =
    useState(false);
  const [modalVentasPorPersonalArticulo, setModalVentasPorPersonalArticulo] =
    useState(false);
  const [modalGuiasDeRemision, setModalGuiasDeRemision] = useState(false);
  const [modalGuiaValorizada, setModalGuiaValorizada] = useState(false);
  const [modalReporteDocumentos, setModalReporteDocumentos] = useState(false);
  const [modalInformeCilindros, setModalInformeCilindros] = useState(false);
  //#endregion

  //#region Cobranzas
  const [modalCobranzasLetrasCambio, setModalCobranzasLetrasCambio] =
    useState(false);
  const [modalCuentasPorCobrar, setModalCuentasPorCobrar] = useState(false);
  const [modalCuentasPorCobrarVendidos, setModalCuentasPorCobrarVendidos] =
    useState(false);
  const [modalInformeCobranzas, setModalInformeCobranzas] = useState(false);
  const [modalInformePlanillaPagos, setModalInformePlanillaPagos] =
    useState(false);
  const [modalInformeControlPlanillas, setModalInformeControlPlanillas] =
    useState(false);
  const [modalInformeGeneralDetallado, setModalInformeGeneralDetallado] =
    useState(false);
  //#endregion

  //#region Finanzas
  const [modalReporteIngresosEgresos, setModalReporteIngresosEgresos] =
    useState(false);
  const [modalPagosPendientes, setModalPagosPendientes] = useState(false);
  const [modalReporteIngresosTienda, setModalReporteIngresosTienda] =
    useState(false);
  //#endregion

  //#region Gerencia
  const [
    modalInformeGerenciaComprasArticulos,
    setModalInformeGerenciaComprasArticulos,
  ] = useState(false);
  const [
    modalInformeGerenciaCostosProductos,
    setModalInformeGerenciaCostosProductos,
  ] = useState(false);
  const [
    modalInformeGerenciaOrdenDeCompra,
    setModalInformeGerenciaOrdenDeCompra,
  ] = useState(false);
  const [
    modalInformeGerenciaRegistroComprasMes,
    setModalInformeGerenciaRegistroComprasMes,
  ] = useState(false);
  const [modalInformeGerenciaTiendas, setModalInformeGerenciaTiendas] =
    useState(false);
  const [modalInformeGerenciaUtilidades, setModalInformeGerenciaUtilidades] =
    useState(false);
  const [
    modalInformeGerenciaVentasArticulos,
    setModalInformeGerenciaVentasArticulos,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorArticuloVendedor,
    setModalInformeGerenciaVentasPorArticuloVendedor,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorMarcaArituculos,
    setModalInformeGerenciaVentasPorMarcaArituculos,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorVendedorClientes,
    setModalInformeGerenciaVentasPorVendedorClientes,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorVendedorMes,
    setModalInformeGerenciaVentasPorVendedorMes,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorVendedorMesDia,
    setModalInformeGerenciaVentasPorVendedorMesDia,
  ] = useState(false);
  //#endregion
  //#endregion

  //#region Informes
  const Sistemas = [
    {
      id: 1,
      title: "Reporte de Clientes",
      AbrirModal: () => {
        setModalCliente(true);
      },
    },
    {
      id: 2,
      title: "Reporte de Proveedores",
      AbrirModal: () => {
        setModalProveedor(true);
      },
    },
    {
      id: 3,
      title: "Reporte de Vendedores",
      AbrirModal: () => {
        setModalPersonal(true);
      },
    },
    {
      id: 4,
      title: "Reporte de Vendedores y Clientes",
      AbrirModal: () => {
        setModalPersonalCliente(true);
      },
    },
  ];
  const Articulos = [
    {
      id: 1,
      title: "Toma de Inventario",
      AbrirModal: () => {
        setModalTomaInventario(true);
      },
    },
    {
      id: 2,
      title: "Stock Valorizado",
      AbrirModal: () => {
        setModalStockValorizado(true);
      },
    },
    {
      id: 3,
      title: "Listado de Costos",
      AbrirModal: () => {
        setModalListadoCostos(true);
      },
    },
    {
      id: 4,
      title: "Movimientos de Artículos",
      AbrirModal: () => {
        setModalMovArticulo(true);
      },
    },
    {
      id: 5,
      title: "Kardex por Marca",
      AbrirModal: () => {
        setModalKardexMarca(true);
      },
    },
  ];
  const Compras = [
    {
      id: 1,
      title: "Todas las Compras",
      AbrirModal: () => {
        setModalTodasLasCompras(true);
      },
    },
    {
      id: 2,
      title: "Compras Detalle",
      AbrirModal: () => {
        setModalComprasDetalle(true);
      },
    },
    {
      id: 3,
      title: "Compras por Proveedor",
      AbrirModal: () => {
        setModalComprasPorProveedor(true);
      },
    },
    {
      id: 4,
      title: "Órdenes de Compra",
      AbrirModal: () => {
        setModalOrdenDeCompra(true);
      },
    },
    {
      id: 5,
      title: "Orden de Compra Pendiente",
      AbrirModal: () => {
        setModalOrdenDeCompraPendiente(true);
      },
    },
    {
      id: 6,
      title: "Reporte de Compra(Logistica)",
      AbrirModal: () => {
        setModalReporteDeCompras(true);
      },
    },
    {
      id: 7,
      title: "Entrada Almacén",
      AbrirModal: () => {
        setModalEntradaAlmacen(true);
      },
    },
    {
      id: 8,
      title: "Letras de Cambio",
      AbrirModal: () => {
        setModalLetrasDeCambio(true);
      },
    },
    {
      id: 9,
      title: "Guías de Compra",
      AbrirModal: () => {
        setModalGuiasDeCompra(true);
      },
    },
    {
      id: 10,
      title: "Guía de compra Detalle",
      AbrirModal: () => {
        setModalGuiasDeCompraDetalle(true);
      },
    },
    {
      id: 11,
      title: "Deudas por Pagar",
      AbrirModal: () => {
        setModalDeudasPorPagar(true);
      },
    },
  ];
  const Ventas = [
    {
      id: 1,
      title: "Ventas por Tipo de Documento",
      AbrirModal: () => {
        setModalVentaTipoDocumento(true);
      },
    },
    {
      id: 2,
      title: "Ventas por Tienda y Marca",
      AbrirModal: () => {
        setModalVentaTiendaMarca(true);
      },
    },
    {
      id: 3,
      title: "Registro de Ventas",
      AbrirModal: () => {
        setModalRegistroVentas(true);
      },
    },
    {
      id: 4,
      title: "Registro de Venta Detalle",
      AbrirModal: () => {
        setModalRegistroVentaDetalle(true);
      },
    },
    {
      id: 5,
      title: "Registro de Ventas por Ubigeo",
      AbrirModal: () => {
        setModalRegistroventaUbigueo(true);
      },
    },
    {
      id: 6,
      title: "Registro de Salida de Cilindros",
      AbrirModal: () => {
        setModalRegistroSalidaCilindros(true);
      },
    },
    {
      id: 7,
      title: "Ventas por Cliente",
      AbrirModal: () => {
        setModalVentasPorCliente(true);
      },
    },
    {
      id: 8,
      title: "Ventas por Cliente y Documento",
      AbrirModal: () => {
        setModalVentasPorClienteDocumento(true);
      },
    },
    {
      id: 9,
      title: "Ventas por Personal",
      AbrirModal: () => {
        setModalVentasPorPersonal(true);
      },
    },
    {
      id: 10,
      title: "Ventas por Personal y Detalle",
      AbrirModal: () => {
        setModalVentasPorPersonalDetalle(true);
      },
    },
    {
      id: 11,
      title: "Ventas por Personal y Artículo",
      AbrirModal: () => {
        setModalVentasPorPersonalArticulo(true);
      },
    },
    {
      id: 12,
      title: "Guías de Remisión",
      AbrirModal: () => {
        setModalGuiasDeRemision(true);
      },
    },
    {
      id: 13,
      title: "Guías Valorizadas",
      AbrirModal: () => {
        setModalGuiaValorizada(true);
      },
    },
    {
      id: 14,
      title: "Reporte de Documentos",
      AbrirModal: () => {
        setModalReporteDocumentos(true);
      },
    },
    {
      id: 15,
      title: "Reporte de Cilindros",
      AbrirModal: () => {
        setModalInformeCilindros(true);
      },
    },
  ];
  const Cobranzas = [
    {
      id: 1,
      title: "Letras de Cambio",
      AbrirModal: () => {
        setModalLetrasDeCambio(true);
      },
    },
    {
      id: 2,
      title: "Cuentas por Cobrar",
      AbrirModal: () => {
        setModalCuentasPorCobrar(true);
      },
    },
    {
      id: 3,
      title: "Cuentas por Cobrar Vencidos",
      AbrirModal: () => {
        setModalCuentasPorCobrarVendidos(true);
      },
    },
    {
      id: 4,
      title: "Reporte de Cobranzas",
      AbrirModal: () => {
        setModalInformeCobranzas(true);
      },
    },
    {
      id: 5,
      title: "Reporte Planilla Pagos",
      AbrirModal: () => {
        setModalInformePlanillaPagos(true);
      },
    },
    {
      id: 6,
      title: "Reporte de Control de Planillas",
      AbrirModal: () => {
        setModalInformeControlPlanillas(true);
      },
    },
    {
      id: 7,
      title: "Reporte de General Detallado",
      AbrirModal: () => {
        setModalInformeGeneralDetallado(true);
      },
    },
  ];
  const Finanzas = [
    {
      id: 1,
      title: "Reporte Ingresos/Egresos",
      AbrirModal: () => {
        setModalReporteIngresosEgresos(true);
      },
    },
    {
      id: 2,
      title: "Pagos Pendientes/Realizados",
      AbrirModal: () => {
        setModalPagosPendientes(true);
      },
    },
    {
      id: 3,
      title: "Reporte de Ingresos de Tiendas",
      AbrirModal: () => {
        setModalReporteIngresosTienda(true);
      },
    },
  ];
  const Gerencia = [
    {
      id: 1,
      title: "Reporte de Tiendas",
      AbrirModal: () => {
        setModalInformeGerenciaTiendas(true);
      },
    },
    {
      id: 2,
      title: "Reporte de Utilidades",
      AbrirModal: () => {
        setModalInformeGerenciaUtilidades(true);
      },
    },
    {
      id: 3,
      title: "Reporte Costo de Productos",
      AbrirModal: () => {
        setModalInformeGerenciaCostosProductos(true);
      },
    },
    {
      id: 4,
      title: "Compras por Artículos",
      AbrirModal: () => {
        setModalInformeGerenciaComprasArticulos(true);
      },
    },
    {
      id: 5,
      title: "Ventas por Artículos",
      AbrirModal: () => {
        setModalInformeGerenciaVentasArticulos(true);
      },
    },
    {
      id: 6,
      title: "Ventas por Vendedor y Cliente por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorVendedorClientes(true);
      },
    },
    {
      id: 7,
      title: "Ventas por Marca y Artículo por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorMarcaArituculos(true);
      },
    },
    {
      id: 8,
      title: "Ventas por Vendedor por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorVendedorMes(true);
      },
    },
    {
      id: 9,
      title: "Ventas por Vendedor por Mes y Día",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorVendedorMesDia(true);
      },
    },
    {
      id: 10,
      title: "Ventas por Artículo y Vendedor",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorArticuloVendedor(true);
      },
    },
    {
      id: 11,
      title: "Orden de Compra Pendiente-Cronograma",
      AbrirModal: () => {
        setModalInformeGerenciaOrdenDeCompra(true);
      },
    },
    {
      id: 12,
      title: "Registros de Compras por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaRegistroComprasMes(true);
      },
    },
  ];
  const Grafico = [
    {
      id: 1,
      title: "Ventas por Vendedor y Ubigeo",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
  ];
  const Contable = [
    {
      id: 1,
      title: "Reporte Contable",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
  ];
  //#endregion

  //#region  Render
  return (
    <div className="p-4">
      <Accordion>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Sistemas
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Sistemas.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className="vertical-align-middle">
                Informes de Artículos
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Articulos.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Compras
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Compras.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes de Ventas</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Ventas.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Cobranzas
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Cobranzas.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Finanzas
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Finanzas.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Gerencia
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Gerencia.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">
                Informes de Grafico
              </span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Grafico.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Contables</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {Contable.map((item) => (
              <li
                className={G.AcordionUl}
                key={item.id}
                onClick={item.AbrirModal}
              >
                <p key={item.id}>{item.title}</p>
              </li>
            ))}
          </ul>
        </AccordionTab>
      </Accordion>

      {/* Sistema */}
      {modalCliente && <ReporteClientes setModal={setModalCliente} />}
      {modalProveedor && <ReporteProveedores setModal={setModalProveedor} />}
      {modalPersonal && <ReportePersonal setModal={setModalPersonal} />}
      {modalPersonalCliente && (
        <ReportePersonalCliente setModal={setModalPersonalCliente} />
      )}
      {/* Sistema */}

      {/* Artículo */}
      {modalKardexMarca && (
        <KardexMarca setModal={setModalKardexMarca} />
      )}
      {modalListadoCostos && (
        <ListadoCostos setModal={setModalListadoCostos} />
      )}
      {modalMovArticulo && (
        <MovimientoDeArticulos setModal={setModalMovArticulo} />
      )}
      {modalStockValorizado && (
        <StockValorizado setModal={setModalStockValorizado} />
      )}
      {modalTomaInventario && (
        <TomaInventario
          setModal={setModalTomaInventario}
          foco={document.getElementById("pr_id_4")}
        />
      )}
      {/* Artículo */}

      {/* Compra */}
      {modalComprasDetalle && (
        <ComprasDetalle setModal={setModalComprasDetalle} />
      )}
      {modalComprasPorProveedor && (
        <ComprasPorProveedor setModal={setModalComprasPorProveedor} />
      )}
      {modalDeudasPorPagar && (
        <DeudasPorPagar setModal={setModalDeudasPorPagar} />
      )}
      {modalEntradaAlmacen && (
        <EntradaAlmacen setModal={setModalEntradaAlmacen} />
      )}
      {modalGuiasDeCompra && <GuiasDeCompra setModal={setModalGuiasDeCompra} />}
      {modalGuiasDeCompraDetalle && (
        <GuiasDeCompraDetalle setModal={setModalGuiasDeCompraDetalle} />
      )}
      {modalLetrasDeCambio && (
        <LetrasCambio setModal={setModalLetrasDeCambio} />
      )}
      {modalOrdenDeCompra && <OrdenDeCompra setModal={setModalOrdenDeCompra} />}
      {modalOrdenDeCompraPendiente && (
        <OrdenDeCompraPendiente setModal={setModalOrdenDeCompraPendiente} />
      )}
      {modalReporteDeCompras && (
        <ReporteCompra setModal={setModalReporteDeCompras} />
      )}
      {modalTodasLasCompras && (
        <TodasLasCompras setModal={setModalTodasLasCompras} />
      )}
      {/* Compra */}

      {/* Venta */}
      {modalGuiasDeRemision && (
        <GuiasDeRemision setModal={setModalGuiasDeRemision} />
      )}
      {modalGuiaValorizada && (
        <GuiaValorizada setModal={setModalGuiaValorizada} />
      )}
      {modalInformeCilindros && (
        <InformeCilindros setModal={setModalInformeCilindros} />
      )}
      {modalRegistroSalidaCilindros && (
        <RegistroSalidaCilindros setModal={setModalRegistroSalidaCilindros} />
      )}
      {modalRegistroVentaDetalle && (
        <RegistroVentaDetalle setModal={setModalRegistroVentaDetalle} />
      )}
      {modalRegistroVentas && (
        <RegistroVentas setModal={setModalRegistroVentas} />
      )}
      {modalRegistroventaUbigueo && (
        <RegistroVentaUbigueo setModal={setModalRegistroventaUbigueo} />
      )}
      {modalReporteDocumentos && (
        <ReporteDocumentos setModal={setModalReporteDocumentos} />
      )}
      {modalVentasPorCliente && (
        <VentasPorCliente setModal={setModalVentasPorCliente} />
      )}
      {modalVentasPorClienteDocumento && (
        <VentasPorClienteDocumento
          setModal={setModalVentasPorClienteDocumento}
        />
      )}
      {modalVentasPorPersonal && (
        <VentasPorPersonal setModal={setModalVentasPorPersonal} />
      )}
      {modalVentasPorPersonalArticulo && (
        <VentasPorPersonalArticulo
          setModal={setModalVentasPorPersonalArticulo}
        />
      )}
      {modalVentasPorPersonalDetalle && (
        <VentasPorPersonalDetalle setModal={setModalVentasPorPersonalDetalle} />
      )}
      {modalVentaTiendaMarca && (
        <VentaTiendaMarca setModal={setModalVentaTiendaMarca} />
      )}
      {modalVentaTipoDocumento && (
        <VentaTipoDocumento setModal={setModalVentaTipoDocumento} />
      )}
      {/* Venta */}

      {/* Cobranza */}
      {modalCobranzasLetrasCambio && (
        <LetrasDeCambio setModal={setModalCobranzasLetrasCambio} />
      )}
      {modalInformeGeneralDetallado && (
        <InformeGeneralDetallado setModal={setModalInformeGeneralDetallado} />
      )}
      {modalCuentasPorCobrar && (
        <CuentasPorCobrar setModal={setModalCuentasPorCobrar} />
      )}
      {modalCuentasPorCobrarVendidos && (
        <CuentasPorCobrarVencidos setModal={setModalCuentasPorCobrarVendidos} />
      )}
      {modalInformeCobranzas && (
        <InformeCobranzas setModal={setModalInformeCobranzas} />
      )}
      {modalInformePlanillaPagos && (
        <InformePlanillaPagos setModal={setModalInformePlanillaPagos} />
      )}
      {modalInformeControlPlanillas && (
        <InfomeControlPlanillas setModal={setModalInformeControlPlanillas} />
      )}
      {/* Cobranza */}

      {/* Finanza */}
      {modalReporteIngresosEgresos && (
        <ReporteIngresosEgresos
          setModal={setModalReporteIngresosEgresos}
        />
      )}
      {modalPagosPendientes && (
        <PagosPendientes setModal={setModalPagosPendientes} />
      )}
      {modalReporteIngresosTienda && (
        <ReporteIngresosTiendas setModal={setModalReporteIngresosTienda} />
      )}
      {/* Finanza */}

      {/* Gerencia */}
      {modalInformeGerenciaComprasArticulos && (
        <InformeGerenciaComprasArticulos
          setModal={setModalInformeGerenciaComprasArticulos}
        />
      )}
      {modalInformeGerenciaCostosProductos && (
        <InformeGerenciaCostosProductos
          setModal={setModalInformeGerenciaCostosProductos}
        />
      )}
      {modalInformeGerenciaOrdenDeCompra && (
        <InformeGerenciaOrdenDeCompra
          setModal={setModalInformeGerenciaOrdenDeCompra}
        />
      )}
      {modalInformeGerenciaRegistroComprasMes && (
        <InformeGerenciaRegistroComprasMes
          setModal={setModalInformeGerenciaRegistroComprasMes}
        />
      )}
      {modalInformeGerenciaTiendas && (
        <InformeGerenciaTiendas setModal={setModalInformeGerenciaTiendas} />
      )}
      {modalInformeGerenciaUtilidades && (
        <InformeGerenciaUtilidades
          setModal={setModalInformeGerenciaUtilidades}
        />
      )}
      {modalInformeGerenciaVentasArticulos && (
        <InformeGerenciaVentasArticulos
          setModal={setModalInformeGerenciaVentasArticulos}
        />
      )}
      {modalInformeGerenciaVentasPorArticuloVendedor && (
        <InformeGerenciaVentasPorArticuloVendedor
          setModal={setModalInformeGerenciaVentasPorArticuloVendedor}
        />
      )}
      {modalInformeGerenciaVentasPorMarcaArituculos && (
        <InformeGerenciaVentasPorMarcaArituculos
          setModal={setModalInformeGerenciaVentasPorMarcaArituculos}
        />
      )}
      {modalInformeGerenciaVentasPorVendedorClientes && (
        <InformeGerenciaVentasPorVendedorClientes
          setModal={setModalInformeGerenciaVentasPorVendedorClientes}
        />
      )}
      {modalInformeGerenciaVentasPorVendedorMes && (
        <InformeGerenciaVentasPorVendedorMes
          setModal={setModalInformeGerenciaVentasPorVendedorMes}
        />
      )}
      {modalInformeGerenciaVentasPorVendedorMesDia && (
        <InformeGerenciaVentasPorVendedorMesDia
          setModal={setModalInformeGerenciaVentasPorVendedorMesDia}
        />
      )}
      {/* Gerencia */}

      <ToastContainer />
    </div>
  );
  //#endregion
};

export default Informe;
