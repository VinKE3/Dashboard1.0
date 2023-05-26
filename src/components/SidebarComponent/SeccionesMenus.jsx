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
      id: "venta",
      icon: <FaBalanceScale className="text-primary" />,
      items: [
        {
          path: "/venta/cliente",
          title: "Clientes",
        },
        {
          path: "/venta/conductorTransportista",
          title: "Conductores - Transportistas",
        },
        {
          path: "/venta/cotizacion",
          title: "Cotización",
        },
        {
          path: "/venta/documentoVenta",
          title: "Documentos de venta",
        },
        {
          path: "/venta/retencion",
          title: "Retención",
        },
        {
          path: "/venta/letraCambioVenta",
          title: "Letra de Cambio",
        },
        {
          path: "/venta/guiaRemision",
          title: "Guías de Remision",
        },
      ],
    },
    //?Compras
    {
      title: "Compras",
      id: "compra",
      icon: <FaClipboardCheck className="text-primary" />,
      items: [
        {
          path: "/compra/proveedor",
          title: "Proveedores",
        },
        {
          path: "/compra/ordenCompra",
          title: "Órdenes de compra",
        },
        {
          path: "/compra/documentoCompra",
          title: "Documentos de compra",
        },
        {
          path: "/compra/facturaNegociable",
          title: "Factura Negociable",
        },
        {
          path: "/compra/letraCambioCompra",
          title: "Letra de Cambio",
        },
        {
          path: "/compra/cef",
          title: "C.E.F.",
        },
        {
          path: "/compra/cheque",
          title: "Cheques",
        },
        {
          path: "/compra/guiaCompra",
          title: "Guías De compra",
        },
        {
          path: "/finanza/cuentaPorPagar",
          title: "Cuentas por Pagar",
        },
      ],
    },
    //?mantenimiento
    {
      title: "Mantenimiento",
      id: "mantenimiento",
      icon: <FaTools className="text-primary" />,
      items: [
        {
          path: "/mantenimiento/tipoCambio",
          title: "Tipos de Cambio",
        },
        {
          path: "/mantenimiento/articulo",
          title: "Artículos",
        },
        {
          path: "/mantenimiento/linea",
          title: "Lineas",
        },
        {
          path: "/mantenimiento/subLinea",
          title: "SubLineas",
        },
        {
          path: "/mantenimiento/marca",
          title: "Marcas",
        },
        {
          path: "/mantenimiento/unidadMedida",
          title: "Unidades de Medida",
        },
        {
          path: "/mantenimiento/tipoCobroPago",
          title: "Tipos de Pago",
        },
        {
          path: "/mantenimiento/cargo",
          title: "Cargos",
        },
        {
          path: "/mantenimiento/entidadBancaria",
          title: "Entidad Bancaria",
        },
        {
          path: "/mantenimiento/cuentaCorriente",
          title: "Cuentas Corrientes",
        },
        {
          path: "/mantenimiento/departamento",
          title: "Departamentos",
        },
        {
          path: "/mantenimiento/provincia",
          title: "Provincias",
        },
        {
          path: "/mantenimiento/distrito",
          title: "Distritos",
        },
        {
          path: "/personal",
          title: "Personal",
        },
        {
          path: "/mantenimiento/empresaTransporte",
          title: "Empresas de Transporte",
        },
        {
          path: "/mantenimiento/vehiculo",
          title: "Vehículos",
        },
      ],
    },
    //?almacen
    {
      title: "Almacén",
      id: "almacen",
      icon: <FaIndustry className="text-primary" />,
      items: [
        {
          path: "/almacen/movimientoArticulo",
          title: "Movimiento de Artículos",
        },
        {
          path: "/almacen/cuadreStock",
          title: "Cuadre de Stock",
        },
        {
          path: "/almacen/entradaAlmacen",
          title: "Entrada de Almacén",
        },
        {
          path: "/almacen/salidaAlmacen",
          title: "Salida de Almacén",
        },
        {
          path: "/almacen/entradaCilindros",
          title: "Entrada de Cilindros",
        },
        {
          path: "/almacen/salidaCilindro",
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
          path: "/finanza/movimientoBancario",
          title: "Movimiento Bancario",
        },
      ],
    },
    //?Cobranzas
    {
      title: "Cobranzas",
      id: "cobranza",
      icon: <FaMoneyBillAlt className="text-primary" />,
      items: [
        {
          path: "/cobranza/cuentaPorCobrar",
          title: "Cuentas por Cobrar",
        },
        {
          path: "/cobranza/planillaCobro",
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
          path: "/compra/bloquearCompra",
          title: "Bloquear compra",
        },
        {
          path: "/venta/bloquearVenta",
          title: "Bloquear venta",
        },
        {
          path: "/finanza/bloquearMovimientoBancario",
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
      title: "Informe",
      id: "Informe",
      icon: <FaFileAlt className="text-primary" />,
      items: [
        {
          path: "/informe/informeArticulo",
          title: "Artículos",
        },
        {
          path: "/informe/informeVenta",
          title: "Ventas",
        },
        {
          path: "/informe/informeCompra",
          title: "Compras",
        },
        {
          path: "/informe/informeTesoreria",
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
