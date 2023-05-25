import {
  FaBalanceScale,
  FaClipboardCheck,
  FaTools,
  FaIndustry,
  FaUsers,
  FaFileAlt,
  FaDollarSign,
  FaMoneyBillAlt,
} from "react-icons/fa";

function seccionesList() {
  const secciones = [
    //?Ventas
    {
      title: "Ventas",
      id: "Venta",
      icon: <FaBalanceScale className="text-primary" />,
      items: [
        {
          path: "/Venta/clientes",
          title: "Clientes",
        },
        {
          path: "/Venta/conductorTransportista",
          title: "Conductores - Transportistas",
        },
        {
          path: "/Venta/documentoVenta",
          title: "Documentos de Venta",
        },
        {
          path: "/Venta/guiaRemision",
          title: "Guías de Remision",
        },
        {
          path: "/Venta/cotizacion",
          title: "Cotización",
        },
        {
          path: "/Venta/retencion",
          title: "Retención",
        },
      ],
    },
    //?Compras
    {
      title: "Compras",
      id: "Compra",
      icon: <FaClipboardCheck className="text-primary" />,
      items: [
        {
          path: "/Compra/proveedor",
          title: "Proveedores",
        },
        {
          path: "/Compra/ordenCompra",
          title: "Órdenes de Compra",
        },
        {
          path: "/Compra/facturaNegociable",
          title: "Factura Negociable",
        },
        {
          path: "/Compra/letraCambioCompra",
          title: "Letra de Cambio",
        },
        {
          path: "/Compra/CEF",
          title: "C.E.F.",
        },
        {
          path: "/Compra/Cheque",
          title: "Cheques",
        },
        {
          path: "/Compra/documentoCompra",
          title: "Documentos de Compra",
        },
        {
          path: "/Compra/guiaCompra",
          title: "Guías De Compra",
        },
        {
          path: "/Finanza/cuentaPorPagar",
          title: "Cuentas por Pagar",
        },
      ],
    },
    //?Mantenimiento
    {
      title: "Mantenimiento",
      id: "Mantenimiento",
      icon: <FaTools className="text-primary" />,
      items: [
        {
          path: "/Mantenimiento/tipoCambio",
          title: "Tipos de Cambio",
        },
        {
          path: "/Mantenimiento/InformeArticulo",
          title: "Artículos",
        },
        {
          path: "/Mantenimiento/linea",
          title: "Lineas",
        },
        {
          path: "/Mantenimiento/subLinea",
          title: "SubLineas",
        },
        {
          path: "/Mantenimiento/marca",
          title: "Marcas",
        },
        {
          path: "/Mantenimiento/unidadMedida",
          title: "Unidades de Medida",
        },
        {
          path: "/Mantenimiento/tipoCobroPago",
          title: "Tipos de Pago",
        },
        {
          path: "/Mantenimiento/cargo",
          title: "Cargos",
        },
        {
          path: "/Mantenimiento/entidadBancaria",
          title: "Entidad Bancaria",
        },
        {
          path: "/Mantenimiento/cuentaCorriente",
          title: "Cuentas Corrientes",
        },
        {
          path: "/Mantenimiento/departamento",
          title: "Departamentos",
        },
        {
          path: "/Mantenimiento/provincia",
          title: "Provincias",
        },
        {
          path: "/Mantenimiento/distrito",
          title: "Distritos",
        },
        {
          path: "/personal",
          title: "Personal",
        },
        {
          path: "/Mantenimiento/empresaTransporte",
          title: "Empresas de Transporte",
        },
        {
          path: "/Mantenimiento/vehiculo",
          title: "Vehículos",
        },
      ],
    },
    //?Almacen
    {
      title: "Almacén",
      id: "Almacen",
      icon: <FaIndustry className="text-primary" />,
      items: [
        {
          path: "/Almacen/movimientoArticulo",
          title: "Movimiento de Artículos",
        },
        {
          path: "/Almacen/cuadreStock",
          title: "Cuadre de Stock",
        },
        {
          path: "/Almacen/entradaAlmacen",
          title: "Entrada de Almacén",
        },
        {
          path: "/Almacen/salidaAlmacen",
          title: "Salida de Almacén",
        },
        {
          path: "/Almacen/entradaCilindros",
          title: "Entrada de Cilindros",
        },
        {
          path: "/Almacen/salidaCilindro",
          title: "Salida de Cilindros",
        },
      ],
    },
    //?Finanzas
    {
      title: "Finanzas",
      id: "Finanza",
      icon: <FaDollarSign className="text-primary" />,
      items: [
        {
          path: "/Finanza/movimientoBancario",
          title: "Movimiento Bancario",
        },
      ],
    },
    //?Cobranzas
    {
      title: "Cobranzas",
      id: "Cobranza",
      icon: <FaMoneyBillAlt className="text-primary" />,
      items: [
        {
          path: "/Cobranza/cuentaPorCobrar",
          title: "Cuentas por Cobrar",
        },
        {
          path: "/Cobranza/planillaCobro",
          title: "Planilla Cobro",
        },
      ],
    },
    //?Archivo
    {
      title: "Bloqueos",
      id: "archivo",
      icon: <FaUsers className="text-primary" />,
      items: [
        {
          path: "/Compra/bloquearCompra",
          title: "Bloquear Compra",
        },
        {
          path: "/Venta/bloquearVenta",
          title: "Bloquear Venta",
        },
        {
          path: "/Finanza/bloquearMovimientoBancario",
          title: "Bloquear Movimiento Bancario",
        },
      ],
    },

    //Tesoreria
    // {
    //   title: "Tesoreria",
    //   id: "Tesoreria",
    //   icon: <FaMoneyCheck className="text-primary" />,
    //   items: [
    //     {
    //       path: "/Tesoreria/bloquear-recibo-de-egreso",
    //       title: "Bloquear Recibo de Egreso",
    //     },
    //   ],
    // },
    //?Informes
    {
      title: "Informes",
      id: "Informe",
      icon: <FaFileAlt className="text-primary" />,
      items: [
        {
          path: "/Informe/InformeArticulo",
          title: "Artículos",
        },
        {
          path: "/Informe/InformeVenta",
          title: "Ventas",
        },
        {
          path: "/Informe/InformeCompra",
          title: "Compras",
        },
        {
          path: "/Informe/InformeTesoreria",
          title: "Tesoreria",
        },
      ],
    },
    //Herramientas
    // {
    //   title: "Herramientas",
    //   id: "Herramienta",
    //   icon: <FaToolbox className="text-primary" />,

    //   items: [
    //     {
    //       path: "/Herramienta/cambiar-contraseña",
    //       title: "Cambiar Contraseña",
    //     },
    //   ],
    // },
  ];

  return secciones;
}

export default seccionesList;
