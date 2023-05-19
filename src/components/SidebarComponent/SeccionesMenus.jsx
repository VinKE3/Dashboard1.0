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
  FaMoneyBillAlt,
} from "react-icons/fa";

function seccionesList() {
  const secciones = [
    //?Archivo
    {
      title: "Archivo",
      id: "archivo",
      icon: <FaUsers className="text-primary" />,
      items: [
        {
          path: "/compras/bloquear-compra",
          title: "Bloquear Compra",
        },
        {
          path: "/ventas/bloquear-venta",
          title: "Bloquear Venta",
        },
        {
          path: "/finanzas/bloquear-movimiento-bancario",
          title: "Bloquear Movimiento Bancario",
        },
      ],
    },
    //?Mantenimiento
    {
      title: "Mantenimiento",
      id: "mantenimiento",
      icon: <FaTools className="text-primary" />,
      items: [
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
          path: "/ventas/clientes",
          title: "Clientes",
        },
        {
          path: "/compras/provedores",
          title: "Provedores",
        },
        {
          path: "/personal",
          title: "Ver Personal",
        },
        {
          path: "/mantenimiento/vehiculos",
          title: "Vehiculos",
        },
        {
          path: "/ventas/conductores-transportistas",
          title: "Conductores - Transportistas",
        },
        {
          path: "/mantenimiento/empresa-de-transporte",
          title: "Empresa de Transporte",
        },
        {
          path: "/mantenimiento/articulos",
          title: "Articulos",
        },
      ],
    },
    //?Almacen
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
    //?Finanzas
    {
      title: "Finanzas",
      id: "finanzas",
      icon: <FaDollarSign className="text-primary" />,
      items: [
        {
          path: "/finanzas/movimiento-bancario",
          title: "Movimiento Bancario",
        },
      ],
    },
    //?Compras
    {
      title: "Compras",
      id: "compras",
      icon: <FaClipboardCheck className="text-primary" />,
      items: [
        {
          path: "/compras/ordenes-de-compra",
          title: "Ordenes de Compra",
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
          path: "/compras/cef",
          title: "C.E.F.",
        },
        {
          path: "/compras/cheque",
          title: "Programación Cheques",
        },
        {
          path: "/compras/documentos-de-compra",
          title: "Documentos de Compra",
        },
        {
          path: "/compras/guias-de-compra",
          title: "Guías De Compra",
        },
        {
          path: "/finanzas/cuentas-por-pagar",
          title: "Cuentas por Pagar",
        },
      ],
    },
    //?Ventas
    {
      title: "Ventas",
      id: "ventas",
      icon: <FaBalanceScale className="text-primary" />,
      items: [
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
          path: "/ventas/retenciones",
          title: "Retencion",
        },
      ],
    },
    //?Cobranzas
    {
      title: "Cobranzas",
      id: "cobranzas",
      icon: <FaMoneyBillAlt className="text-primary" />,
      items: [
        {
          path: "/cobranzas/cuentas-por-cobrar",
          title: "Cuentas Por Cobrar",
        },
        {
          path: "/cobranzas/planilla-cobro",
          title: "Planilla Cobro",
        },
      ],
    },
    //?Tesoreria
    {
      title: "Tesoreria",
      id: "tesoreria",
      icon: <FaMoneyCheck className="text-primary" />,
      items: [
        {
          path: "/tesoreria/bloquear-recibo-de-egreso",
          title: "Bloquear Recibo de Egreso",
        },
      ],
    },
    //?Informes
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
    //?Herramientas
    {
      title: "Herramientas",
      id: "herramientas",
      icon: <FaToolbox className="text-primary" />,

      items: [
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
