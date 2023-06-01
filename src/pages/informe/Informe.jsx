import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useState } from "react";
import TomaDeInventario from "./informeArticulos/TomaDeInventario";
import StockValorizado from "./informeArticulos/StockValorizado";
import ListadoDeCostos from "./informeArticulos/ListadoDeCostos";
import MovimientoDeArticulos from "./informeArticulos/MovimientoDeArticulos";
import KardexPorMarca from "./informeArticulos/KardexPorMarca";
import TodasLasCompras from "./informeCompras/TodasLasCompras";
import ComprasDetalle from "./informeCompras/ComprasDetalle";
import ComprasPorProveedor from "./informeCompras/ComprasPorProveedor";
import OrdenDeCompra from "./informeCompras/OrdenDeCompra";
import OrdenDeCompraPendiente from "./informeCompras/OrdenDeCompraPendiente";
import ReporteCompra from "./informeCompras/ReporteCompra";
import EntradaAlmacen from "./informeCompras/EntradaAlmacen";
import LetrasCambio from "./informeCompras/LetrasCambio";
import GuiasDeCompra from "./informeCompras/GuiasDeCompra";
import GuiasDeCompraDetalle from "./informeCompras/GuiasDeCompraDetalle";
import DeudasPorPagar from "./informeCompras/DeudasPorPagar";
import VentaTipoDocumento from "./informeVentas/VentaTipoDocumento";
import VentaTiendaMarca from "./informeVentas/VentaTiendaMarca";
import RegistroVentas from "./informeVentas/RegistroVentas";
import RegistroVentaDetalle from "./informeVentas/RegistroVentaDetalle";
import RegistroVentaUbigueo from "./informeVentas/RegistroVentaUbigueo";
import RegistroSalidaCilindros from "./informeVentas/RegistroSalidaCilindros";
import VentasPorCliente from "./informeVentas/VentasPorCliente";
import VentasPorClienteDocumento from "./informeVentas/VentasPorClienteDocumento";
import VentasPorPersonal from "./informeVentas/VentasPorPersonal";
import VentasPorPersonalDetalle from "./informeVentas/VentasPorPersonalDetalle";
import VentasPorPersonalArticulo from "./informeVentas/VentasPorPersonalArticulo";
import GuiasDeRemision from "./informeVentas/GuiasDeRemision";
import GuiaValorizada from "./informeVentas/GuiaValorizada";
import ReporteDocumentos from "./informeVentas/ReporteDocumentos";
import InformeCilindros from "./informeVentas/InformeCilindros";
import LetrasDeCambio from "./informeCobranzas/LetrasDeCambio";
import InformeGeneralDetallado from "./informeCobranzas/InformeGeneralDetallado";
import CuentasPorCobrar from "./informeCobranzas/CuentasPorCobrar";
import CuentasPorCobrarVencidos from "./informeCobranzas/CuentasPorCobrarVencidos";
import InformeCobranzas from "./informeCobranzas/InformeCobranzas";
import InformePlanillaPagos from "./informeCobranzas/InformePlanillaPagos";
import InfomeControlPlanillas from "./informeCobranzas/InfomeControlPlanillas";
import ReporteIngresosEgresos from "./informeFinanzas/ReporteIngresosEgresos";
import PagosPendientes from "./informeFinanzas/PagosPendientes";
import ReporteIngresosTiendas from "./informeFinanzas/ReporteIngresosTiendas";
import InformeGerenciaUtilidades from "./informeGerencia/InformeGerenciaUtilidades";
import InformeGerenciaCostosProductos from "./informeGerencia/InformeGerenciaCostosProductos";
import InformeGerenciaComprasArticulos from "./informeGerencia/InformeGerenciaComprasArticulos";
import InformeGerenciaVentasPorVendedorClientes from "./informeGerencia/InformeGerenciaVentasPorVendedorClientes";
const Informe = () => {
  //?INFORMES MODALES
  //#region Informe Modal Articulos
  //?Informe Modal Articulos
  const [modalTomaInventario, setModalTomaInventario] = useState(false);
  const [modalStockValorizado, setModalStockValorizado] = useState(false);
  const [modalListadoDeCostos, setModalListadoDeCostos] = useState(false);
  const [modalMovimientoDeArticulos, setModalMovimientoDeArticulos] =
    useState(false);
  const [modalKardexPorMarca, setModalKardexPorMarca] = useState(false);
  //?Informe Modal Compras
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
  //?Informe Modal Ventas
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
  //?Informe Modal Cobranzas
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
  //?Informe Modal Finanzas
  const [modalReporteIngresosEgresos, setModalReporteIngresosEgresos] =
    useState(false);
  const [modalPagosPendientes, setModalPagosPendientes] = useState(false);
  const [modalReporteIngresosTienda, setModalReporteIngresosTienda] =
    useState(false);
  //?Informe Modal Gerencia
  const [modalInformeGerenciaTiendas, setModalInformeGerenciaTiendas] =
    useState(false);
  const [modalInformeGerenciaUtilidades, setModalInformeGerenciaUtilidades] =
    useState(false);
  const [
    modalInformeGerenciaCostosProductos,
    setModalInformeGerenciaCostosProductos,
  ] = useState(false);
  const [
    modalInformeGerenciaComprasArticulos,
    setModalInformeGerenciaComprasArticulos,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasArticulos,
    setModalInformeGerenciaVentasArticulos,
  ] = useState(false);
  const [
    modalInformeGerenciaRegistroSalida,
    setModalInformeGerenciaRegistroSalida,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorVendedorCliente,
    setModalInformeGerenciaVentasPorVendedorCliente,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasPorMarcaArticulo,
    setModalInformeGerenciaVentasPorMarcaArticulo,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasVendedorMes,
    setModalInformeGerenciaVentasVendedorMes,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasVendedorMesDia,
    setModalInformeGerenciaVentasVendedorMesDia,
  ] = useState(false);
  const [
    modalInformeGerenciaVentasArticuloVendedor,
    setModalInformeGerenciaVentasArticuloVendedor,
  ] = useState(false);
  const [modalInformeGerenciaOrdenCompra, setModalInformeGerenciaOrdenCompra] =
    useState(false);
  const [
    modalInformeGerenciaRegistroComprasMes,
    setModalInformeGerenciaRegistroComprasMes,
  ] = useState(false);
  //#endregion

  //?INFORMES
  //#region Informes
  //? Informes Sistemas
  const InformesSistemas = [
    {
      id: 1,
      title: "Reporte de  Clientes",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
    {
      id: 2,
      title: "Reporte de Proveedores",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
    {
      id: 3,
      title: "Reporte de Vendedores",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
    {
      id: 4,
      title: "Reporte de Vendedores y Cliente",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
  ];
  //? Informe Articulos
  const InformeArticulos = [
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
        setModalListadoDeCostos(true);
      },
    },
    {
      id: 4,
      title: "Movimiento de Articulos",
      AbrirModal: () => {
        setModalMovimientoDeArticulos(true);
      },
    },
    {
      id: 5,
      title: "Kardex por Marca",
      AbrirModal: () => {
        setModalKardexPorMarca(true);
      },
    },
  ];
  //? Informe Compras
  const InformeCompras = [
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
      title: "Ordenes de Compra",
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
      title: "Entrada Almacen",
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
  //? Informe Ventas
  const InformeVentas = [
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
      title: "Ventas por Personal y Articulo",
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
      title: "Guia Valorizada",
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
      title: "Informe de Cilindros",
      AbrirModal: () => {
        setModalInformeCilindros(true);
      },
    },
  ];
  //? Informe Cobranzas
  const InformeDeCobranzas = [
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
      title: "Informe de Cobranzas",
      AbrirModal: () => {
        setModalInformeCobranzas(true);
      },
    },
    {
      id: 5,
      title: "Informe Planilla Pagos",
      AbrirModal: () => {
        setModalInformePlanillaPagos(true);
      },
    },
    {
      id: 6,
      title: "Informe de Control de Planillas",
      AbrirModal: () => {
        setModalInformeControlPlanillas(true);
      },
    },
    {
      id: 7,
      title: "Informe de General Detallado",
      AbrirModal: () => {
        setModalInformeGeneralDetallado(true);
      },
    },
  ];
  //? Informe Cobranzas
  const InformeFinanzas = [
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
  //? Informe Gerencia
  const InformeGerencia = [
    {
      id: 1,
      title: "Informe de Tiendas",
      AbrirModal: () => {
        setModalInformeGerenciaTiendas(true);
      },
    },
    {
      id: 2,
      title: "Informe de Utilidades",
      AbrirModal: () => {
        setModalInformeGerenciaUtilidades(true);
      },
    },
    {
      id: 3,
      title: "Informe Costo de Productos",
      AbrirModal: () => {
        setModalInformeGerenciaCostosProductos(true);
      },
    },
    {
      id: 4,
      title: "Compras por Articulos",
      AbrirModal: () => {
        setModalInformeGerenciaComprasArticulos(true);
      },
    },
    {
      id: 5,
      title: "Ventas por Articulos",
      AbrirModal: () => {
        setModalInformeGerenciaVentasArticulos(true);
      },
    },
    {
      id: 6,
      title: "Registro de Salida de Cilindros",
      AbrirModal: () => {
        setModalInformeGerenciaRegistroSalida(true);
      },
    },
    {
      id: 7,
      title: "Ventas por Vendedor y Cliente por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorVendedorCliente(true);
      },
    },
    {
      id: 8,
      title: "Ventas por Marca y Articulo por Mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasPorMarcaArticulo(true);
      },
    },
    {
      id: 9,
      title: "Ventas por Vendedor por mes",
      AbrirModal: () => {
        setModalInformeGerenciaVentasVendedorMes(true);
      },
    },
    {
      id: 10,
      title: "Ventas por Vendedor por mes y dia",
      AbrirModal: () => {
        setModalInformeGerenciaVentasVendedorMesDia(true);
      },
    },
    {
      id: 11,
      title: "Ventas por Articulo y Vendedor",
      AbrirModal: () => {
        setModalInformeGerenciaVentasArticuloVendedor(true);
      },
    },
    {
      id: 12,
      title: "Orden de Compra Pendiente-Cronograma",
      AbrirModal: () => {
        setModalInformeGerenciaOrdenCompra(true);
      },
    },
    {
      id: 13,
      title: "Registros de Compras por mes",
      AbrirModal: () => {
        setModalInformeGerenciaRegistroComprasMes(true);
      },
    },
  ];
  //? Informe Grafico
  const InformeGrafico = [
    {
      id: 1,
      title: "Ventas por Vendedor y Ubigeo",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
  ];
  //? Informe Contable
  const InformeContable = [
    {
      id: 1,
      title: "Informe Contable",
      AbrirModal: () => {
        console.log("AbrirModal");
      },
    },
  ];
  //#endregion
  return (
    <div>
      <Accordion>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Sistemas</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformesSistemas.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Articulos</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeArticulos.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Compras</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeCompras.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Ventas</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeVentas.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Cobranzas</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeDeCobranzas.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Finanzas</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeFinanzas.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Gerencia</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeGerencia.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Grafico</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeGrafico.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <div className="flex align-items-center">
              <span className=" vertical-align-middle">Informes Contable</span>
              <i className="pi pi-cog ml-2"></i>
            </div>
          }
        >
          <ul className="overflow-y-auto">
            {InformeContable.map((item) => (
              <li
                className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                key={item.id}
              >
                <button key={item.id} type="button" onClick={item.AbrirModal}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </AccordionTab>
      </Accordion>
      {modalTomaInventario && (
        <TomaDeInventario setModal={setModalTomaInventario} />
      )}
      {modalStockValorizado && (
        <StockValorizado setModal={setModalStockValorizado} />
      )}
      {modalListadoDeCostos && (
        <ListadoDeCostos setModal={setModalListadoDeCostos} />
      )}
      {modalMovimientoDeArticulos && (
        <MovimientoDeArticulos setModal={setModalMovimientoDeArticulos} />
      )}
      {modalKardexPorMarca && (
        <KardexPorMarca setModal={setModalKardexPorMarca} />
      )}
      {modalTodasLasCompras && (
        <TodasLasCompras setModal={setModalTodasLasCompras} />
      )}
      {modalComprasDetalle && (
        <ComprasDetalle setModal={setModalComprasDetalle} />
      )}
      {modalComprasPorProveedor && (
        <ComprasPorProveedor setModal={setModalComprasPorProveedor} />
      )}
      {modalOrdenDeCompra && <OrdenDeCompra setModal={setModalOrdenDeCompra} />}
      {modalOrdenDeCompraPendiente && (
        <OrdenDeCompraPendiente setModal={setModalOrdenDeCompraPendiente} />
      )}
      {modalReporteDeCompras && (
        <ReporteCompra setModal={setModalReporteDeCompras} />
      )}
      {modalEntradaAlmacen && (
        <EntradaAlmacen setModal={setModalEntradaAlmacen} />
      )}
      {modalLetrasDeCambio && (
        <LetrasCambio setModal={setModalLetrasDeCambio} />
      )}
      {modalGuiasDeCompra && <GuiasDeCompra setModal={setModalGuiasDeCompra} />}
      {modalGuiasDeCompraDetalle && (
        <GuiasDeCompraDetalle setModal={setModalGuiasDeCompraDetalle} />
      )}
      {modalDeudasPorPagar && (
        <DeudasPorPagar setModal={setModalDeudasPorPagar} />
      )}

      {modalVentaTipoDocumento && (
        <VentaTipoDocumento setModal={setModalVentaTipoDocumento} />
      )}
      {modalVentaTiendaMarca && (
        <VentaTiendaMarca setModal={setModalVentaTiendaMarca} />
      )}
      {modalRegistroVentas && (
        <RegistroVentas setModal={setModalRegistroVentas} />
      )}
      {modalRegistroVentaDetalle && (
        <RegistroVentaDetalle setModal={setModalRegistroVentaDetalle} />
      )}
      {modalRegistroventaUbigueo && (
        <RegistroVentaUbigueo setModal={setModalRegistroventaUbigueo} />
      )}
      {modalRegistroSalidaCilindros && (
        <RegistroSalidaCilindros setModal={setModalRegistroSalidaCilindros} />
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
      {modalVentasPorPersonalDetalle && (
        <VentasPorPersonalDetalle setModal={setModalVentasPorPersonalDetalle} />
      )}
      {modalVentasPorPersonalArticulo && (
        <VentasPorPersonalArticulo
          setModal={setModalVentasPorPersonalArticulo}
        />
      )}
      {modalGuiasDeRemision && (
        <GuiasDeRemision setModal={setModalGuiasDeRemision} />
      )}
      {modalGuiaValorizada && (
        <GuiaValorizada setModal={setModalGuiaValorizada} />
      )}
      {modalReporteDocumentos && (
        <ReporteDocumentos setModal={setModalReporteDocumentos} />
      )}
      {modalInformeCilindros && (
        <InformeCilindros setModal={setModalInformeCilindros} />
      )}

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
      {modalReporteIngresosEgresos && (
        <ReporteIngresosEgresos setModal={setModalReporteIngresosEgresos} />
      )}
      {modalPagosPendientes && (
        <PagosPendientes setModal={setModalPagosPendientes} />
      )}
      {modalReporteIngresosTienda && (
        <ReporteIngresosTiendas setModal={setModalReporteIngresosTienda} />
      )}
      {modalInformeGerenciaUtilidades && (
        <InformeGerenciaUtilidades
          setModal={setModalInformeGerenciaUtilidades}
        />
      )}
      {modalInformeGerenciaCostosProductos && (
        <InformeGerenciaCostosProductos
          setModal={setModalInformeGerenciaCostosProductos}
        />
      )}
      {modalInformeGerenciaVentasPorVendedorCliente && (
        <InformeGerenciaVentasPorVendedorClientes
          setModal={setModalInformeGerenciaVentasPorVendedorCliente}
        />
      )}
    </div>
  );
};

export default Informe;
