import {
  FaBalanceScale,
  FaClipboardCheck,
  FaTools,
  FaIndustry,
  FaUsers,
  FaMoneyCheck,
  FaFileAlt,
  FaToolbox,
  FaDollarSign,
} from "react-icons/fa";

function seccionesList() {
  const secciones = [
    {
      title: "Ventas",
      id: "ventas",
      icon: <FaBalanceScale className="text-primary" />,
      items: [
        {
          path: "/ventas/cliente",
          title: "Clientes",
        },
        {
          path: "/ventas/conductores-transportistas",
          title: "Conductores - Transportistas",
        },
        {
          path: "/ventas/documentos-de-venta",
          title: "Documentos de Venta",
        },
        {
          path: "/ventas/guias-de-remision",
          title: "Guias de Remision",
        },
        {
          path: "/ventas/cotizaciones",
          title: "Cotizaciones",
        },
        {
          path: "/ventas/salidas-de-articulos",
          title: "Salidas de Articulos",
        },

        {
          path: "/ventas/registro-de-venta-articulo",
          title: "Registro de Venta - Articulo",
        },
        {
          path: "/ventas/bloquear-venta",
          title: "Bloquear Venta",
        },
      ],
    },
    {
      title: "Compras",
      id: "compras",
      icon: <FaClipboardCheck className="text-primary" />,
      items: [
        {
          path: "/compras/provedores",
          title: "Provedores",
        },
        {
          path: "/compras/factura-negociable",
          title: "Factura Negociable",
        },
        {
          path: "/compras/letra-cambio-compra",
          title: "Letra de Cambio",
        },
        {
          path: "/compras/documentos-de-compra",
          title: "Documentos de Compra",
        },
        {
          path: "/compras/ordenes-de-compra",
          title: "Ordenes de Compra",
        },
        {
          path: "/compras/cef",
          title: "C.E.F.",
        },
        {
          path: "/compras/cheque",
          title: "Programación Cheques",
        },
        {
          path: "/compras/bloquear-compra",
          title: "Bloquear Compra",
        },
        {
          path: "/compras/entrada-de-articulos",
          title: "Entrada de Articulos",
        },
        {
          path: "/compras/registro-de-compra-articulo",
          title: "Registro de Compra - Articulo",
        },
      ],
    },
    {
      title: "Mantenimiento",
      id: "mantenimiento",
      icon: <FaTools className="text-primary" />,
      items: [
        {
          path: "/mantenimiento/articulos",
          title: "Articulos",
        },
        {
          path: "/mantenimiento/tipos-de-cambio",
          title: "Tipos de Cambio",
        },
        {
          path: "/mantenimiento/lineas",
          title: "Lineas",
        },
        {
          path: "/mantenimiento/sublineas",
          title: "Sublineas",
        },
        {
          path: "/mantenimiento/marcas",
          title: "Marcas",
        },
        {
          path: "/mantenimiento/unidades-de-medida",
          title: "Unidades de Medida",
        },
        {
          path: "/mantenimiento/tipos-de-pago",
          title: "Tipos de Pago",
        },
        {
          path: "/mantenimiento/cargos",
          title: "Cargos",
        },
        {
          path: "/mantenimiento/entidades-bancarias",
          title: "Entidades Bancarias",
        },
        {
          path: "/mantenimiento/cuentas-corrientes",
          title: "Cuentas Corrientes",
        },
        {
          path: "/mantenimiento/empresa-de-transporte",
          title: "Empresa de Transporte",
        },
        {
          path: "/mantenimiento/departamentos",
          title: "Departamentos",
        },
        {
          path: "/mantenimiento/provincias",
          title: "Provincias",
        },
        {
          path: "/mantenimiento/distritos",
          title: "Distritos",
        },
        {
          path: "/mantenimiento/caja-chica-configuracion",
          title: "Caja Chica - Configuracion",
        },
      ],
    },
    {
      title: "Almacen",
      id: "almacen",
      icon: <FaIndustry className="text-primary" />,
      items: [
        {
          path: "/almacen/movimientos-articulos",
          title: "Movimientos de Articulos",
        },
        {
          path: "/almacen/cuadre-stock",
          title: "Cuadre de Stock",
        },
        {
          path: "/almacen/entrada-articulos",
          title: "Entrada de Articulos",
        },
        {
          path: "/almacen/salida-articulos",
          title: "Salida de Articulos",
        },
        {
          path: "/almacen/entrada-cilindros",
          title: "Entrada de Cilindros",
        },
        {
          path: "/almacen/salida-cilindros",
          title: "Salida de Cilindros",
        },
      ],
    },
    {
      title: "Finanzas",
      id: "finanzas",
      icon: <FaDollarSign className="text-primary" />,
      items: [
        {
          path: "/finanzas/bloquear-movimiento-bancario",
          title: "Bloquear Movimiento Bancario",
        },
        {
          path: "/finanzas/cuentas-por-pagar",
          title: "Cuentas por Pagar",
        },
      ],
    },
    {
      title: "Personal",
      id: "personal",
      icon: <FaUsers className="text-primary" />,
      items: [
        {
          path: "/personal",
          title: "Ver Personal",
        },
      ],
    },
    {
      title: "Tesoreria",
      id: "tesoreria",
      icon: <FaMoneyCheck className="text-primary" />,
      items: [
        {
          path: "/tesoreria/cuentas-por-cobrar",
          title: "Cuentas por Cobrar",
        },
        {
          path: "/tesoreria/cobros-cuentas-bancarias",
          title: "Cobros - Cuentas Bancarias",
        },
        {
          path: "/tesoreria/retenciones",
          title: "Retenciones",
        },
        {
          path: "/tesoreria/letras-de-cambio-cobro",
          title: "Letras de Cambio - Cobro",
        },
        {
          path: "/tesoreria/cuentas-por-pagar",
          title: "Cuentas por Pagar",
        },
        {
          path: "/tesoreria/pagos-en-efectivo",
          title: "Pagos en Efectivo",
        },
        {
          path: "/tesoreria/pagos-cuenta-bancaria",
          title: "Pagos - Cuenta Bancaria",
        },
        {
          path: "/tesoreria/letras-de-cambio-pago",
          title: "Letras de Cambio - Pago",
        },
        {
          path: "/tesoreria/caja-chica",
          title: "Caja Chica",
        },
        {
          path: "/tesoreria/recibo-de-ingreso",
          title: "recibo de Ingreso",
        },
        {
          path: "/tesoreria/recibo-de-egreso",
          title: "Recibo de Egreso",
        },
        {
          path: "/tesoreria/bloquear-recibo-de-egreso",
          title: "Bloquear Recibo de Egreso",
        },
      ],
    },
    {
      title: "Informes",
      id: "informes",
      icon: <FaFileAlt className="text-primary" />,
      items: [
        {
          path: "/informes/articulos",
          title: "Articulos",
        },
        {
          path: "/informes/ventas",
          title: "Ventas",
        },
        {
          path: "/informes/compras",
          title: "Compras",
        },
        {
          path: "/informes/tesoreria",
          title: "Tesoreria",
        },
      ],
    },
    {
      title: "Herramientas",
      id: "herramientas",
      icon: <FaToolbox className="text-primary" />,

      items: [
        {
          path: "/herramientas/movimientos-de-articulos",
          title: "Movimientos de Articulos",
        },
        {
          path: "/herramientas/cambiar-contraseña",
          title: "Cambiar Contraseña",
        },
      ],
    },
  ];

  return secciones;
}

export default seccionesList;
