import { Link } from "react-router-dom";
// Icons
import { RiLogoutCircleRLine } from "react-icons/ri";
import { authHelper } from "../../helpers/AuthHelper";
import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";

const SidebarRoutes = ({ showMenu, onClickShowMenu, onClickButton }) => {
  const navigate = useNavigate();
  const { borrarTodosLosTokens } = authHelper;

  const handleLogout = () => {
    borrarTodosLosTokens();
    window.location.href = "/login";
  };

  const onClickShowMenuHandle = (e) => {
    e.preventDefault();
    onClickShowMenu();
  };

  const items = [
    {
      label: "Ventas",
      icon: "pi pi-fw pi-dollar",
      items: [
        {
          label: "Clientes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/clientes");
          },
        },
        {
          label: "Conductores - Transportistas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/conductores-transportistas");
          },
        },
        {
          label: "Documentos de Venta",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/documentos-de-venta");
          },
        },
        {
          label: "Guias de Remision",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/guias-de-remision");
          },
        },
        {
          label: "Cotizaciones",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/cotizaciones");
          },
        },
        {
          label: "Salidas de Articulos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/salidas-de-articulos");
          },
        },
        {
          label: "Registro de Venta - Articulo",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/registro-de-venta-articulo");
          },
        },
      ],
    },
    {
      label: "Compras",
      icon: "pi pi-fw pi-cart-plus",
      items: [
        {
          label: "Provedores",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/compras/provedores");
          },
        },
        {
          label: "Documentos de Compra",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/compras/documentos-de-compra");
          },
        },
        {
          label: "Ordenes de Compra",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/compras/ordenes-de-compra");
          },
        },
        {
          label: "Entrada de Articulos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/compras/entrada-de-articulos");
          },
        },
        {
          label: "Registro de Compra - Articulo",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/compras/registro-de-compra-articulo");
          },
        },
      ],
    },
    {
      label: "Mantenimiento",
      icon: "pi pi-fw pi-wrench",
      items: [
        {
          label: "Tipos de Cambio",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/tipos-de-cambio");
          },
        },
        {
          label: "Lineas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/lineas");
          },
        },
        {
          label: "Sublineas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/sublineas");
          },
        },
        {
          label: "Marcas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/marcas");
          },
        },
        {
          label: "Unidades de Medida",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/unidades-de-medida");
          },
        },
        {
          label: "Tipos de Pago",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/tipos-de-pago");
          },
        },
        {
          label: "Cargos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/cargos");
          },
        },
        {
          label: "Entidades Bancarias",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/entidades-bancarias");
          },
        },
        {
          label: "Cuentas Corrientes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/cuentas-corrientes");
          },
        },
        {
          label: "Empresa de Transporte",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/empresa-de-transporte");
          },
        },
        {
          label: "Departamentos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/departamentos");
          },
        },
        {
          label: "Provincias",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/provincias");
          },
        },
        {
          label: "Distritos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/distritos");
          },
        },
        {
          label: "Almacenes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/almacenes");
          },
        },
        {
          label: "Caja Chica - Configuracion",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/mantenimiento/caja-chica-configuracion");
          },
        },
      ],
    },
    {
      label: "Almacen",
      icon: "pi pi-fw pi-truck",
      command: () => {
        navigate("/almacen");
      },
    },
    {
      label: "Personal",
      icon: "pi pi-fw pi-users",
      command: () => {
        navigate("/personal");
      },
    },
    {
      label: "Tesoreria",
      icon: "pi pi-fw pi-money-bill",
      items: [
        {
          label: "Cuentas por Cobrar",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/cuentas-por-cobrar");
          },
        },
        {
          label: "Cobros - Cuentas Bancarias",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/cobros-cuentas-bancarias");
          },
        },
        {
          label: "Retenciones",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/retenciones");
          },
        },
        {
          label: "Letras de Cambio - Cobro",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/letras-de-cambio-cobro");
          },
        },
        {
          label: "Cuentas por Pagar",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/cuentas-por-pagar");
          },
        },
        {
          label: "Pagos en Efectivo",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/pagos-en-efectivo");
          },
        },
        {
          label: "Pagos - Cuenta Bancaria",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/pagos-cuenta-bancaria");
          },
        },
        {
          label: "Letras de Cambio - Pago",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/letras-de-cambio-pago");
          },
        },
        {
          label: "Caja Chica",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/caja-chica");
          },
        },
        {
          label: "Recibo de Ingreso",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/recibo-de-ingreso");
          },
        },
        {
          label: "Recibo de Egreso",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/tesoreria/recibo-de-egreso");
          },
        },
      ],
    },
    {
      label: "Informes",
      icon: "pi pi-fw pi-file",
      items: [
        {
          label: "Articulos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/informes/articulos");
          },
        },
        {
          label: "Ventas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/informes/ventas");
          },
        },
        {
          label: "Compras",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/informes/compras");
          },
        },
        {
          label: "Tesoreria",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/informes/tesoreria");
          },
        },
        {
          label: "Clientes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/ventas/clientes");
          },
        },
      ],
    },
    {
      label: "Herramientas",
      icon: "pi pi-fw pi-eraser",
      items: [
        {
          label: "Movimientos de Articulos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/herramientas/movimientos-de-articulos");
          },
        },
        {
          label: "Cambiar Contraseña",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/herramientas/cambiar-contraseña");
          },
        },
      ],
    },
  ];

  return (
    <div
      className={`h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto top-0 bg-secondary-100 p-4 flex flex-col z-50 ${
        showMenu ? "left-0" : "-left-full"
      } transition-all`}
    >
      <div className="h-[8vh]">
        <h1 className="text-center text-2xl font-bold text-white h-[6vh] bg-secondary-900 rounded-lg">
          <Link to={"/"}>
            AKRON<span className="text-primary text-4xl">.</span>
          </Link>
        </h1>
      </div>
      <div className="h-[90vh] overflow-y-scroll">
        <PanelMenu model={items} className="w-full md:w-25rem" />
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-2 px-4 rounded-lg bg-secondary-900 hover:text-primary transition-colors w-full"
        >
          <RiLogoutCircleRLine className="text-primary" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default SidebarRoutes;
