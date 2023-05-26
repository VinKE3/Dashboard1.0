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
          path: "/Venta/Cliente",
          title: "Clientes",
        },
        {
          path: "/Venta/ConductorTransportista",
          title: "Conductores - Transportistas",
        },
        {
          path: "/Venta/Cotizacion",
          title: "Cotización",
        },
        {
          path: "/Venta/DocumentoVenta",
          title: "Documentos de Venta",
        },
        {
          path: "/Venta/Retencion",
          title: "Retención",
        },
        {
          path: "/Venta/LetraCambioVenta",
          title: "Letra de Cambio",
        },
        {
          path: "/Venta/GuiaRemision",
          title: "Guías de Remision",
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
          path: "/Compra/Proveedor",
          title: "Proveedores",
        },
        {
          path: "/Compra/OrdenCompra",
          title: "Órdenes de Compra",
        },
        {
          path: "/Compra/DocumentoCompra",
          title: "Documentos de Compra",
        },
        {
          path: "/Compra/FacturaNegociable",
          title: "Factura Negociable",
        },
        {
          path: "/Compra/LetraCambioCompra",
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
          path: "/Compra/GuiaCompra",
          title: "Guías De Compra",
        },
        {
          path: "/Finanza/CuentaPorPagar",
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
          path: "/Mantenimiento/TipoCambio",
          title: "Tipos de Cambio",
        },
        {
          path: "/Mantenimiento/Articulo",
          title: "Artículos",
        },
        {
          path: "/Mantenimiento/Linea",
          title: "Lineas",
        },
        {
          path: "/Mantenimiento/SubLinea",
          title: "SubLineas",
        },
        {
          path: "/Mantenimiento/Marca",
          title: "Marcas",
        },
        {
          path: "/Mantenimiento/UnidadMedida",
          title: "Unidades de Medida",
        },
        {
          path: "/Mantenimiento/TipoCobroPago",
          title: "Tipos de Pago",
        },
        {
          path: "/Mantenimiento/Cargo",
          title: "Cargos",
        },
        {
          path: "/Mantenimiento/EntidadBancaria",
          title: "Entidad Bancaria",
        },
        {
          path: "/Mantenimiento/CuentaCorriente",
          title: "Cuentas Corrientes",
        },
        {
          path: "/Mantenimiento/Departamento",
          title: "Departamentos",
        },
        {
          path: "/Mantenimiento/Provincia",
          title: "Provincias",
        },
        {
          path: "/Mantenimiento/Distrito",
          title: "Distritos",
        },
        {
          path: "/Personal",
          title: "Personal",
        },
        {
          path: "/Mantenimiento/EmpresaTransporte",
          title: "Empresas de Transporte",
        },
        {
          path: "/Mantenimiento/Vehiculo",
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
          path: "/Finanza/MovimientoBancario",
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
          path: "/Cobranza/CuentaPorCobrar",
          title: "Cuentas por Cobrar",
        },
        {
          path: "/Cobranza/PlanillaCobro",
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
          path: "/Compra/BloquearCompra",
          title: "Bloquear Compra",
        },
        {
          path: "/Venta/BloquearVenta",
          title: "Bloquear Venta",
        },
        {
          path: "/Finanza/BloquearMovimientoBancario",
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
