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
            navigate("/Venta/Cliente");
          },
        },
        {
          label: "Conductores - Transportistas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Venta/conductorTransportista");
          },
        },
        {
          label: "Documentos de Venta",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Venta/documentoVenta");
          },
        },
        {
          label: "Guias de Remision",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Venta/guiaRemision");
          },
        },
        {
          label: "Cotizacion",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Venta/cotizacion");
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
            navigate("/Compra/proveedor");
          },
        },
        {
          label: "Documentos de Compra",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Compra/documentoCompra");
          },
        },
        {
          label: "Órdenes de Compra",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Compra/ordenCompra");
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
            navigate("/Mantenimiento/tipoCambio");
          },
        },
        {
          label: "Linea",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/linea");
          },
        },
        {
          label: "SubLinea",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/subLinea");
          },
        },
        {
          label: "Marca",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/marca");
          },
        },
        {
          label: "Unidades de Medida",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/unidadMedida");
          },
        },
        {
          label: "Tipos de Pago",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/tipoCobroPago");
          },
        },
        {
          label: "Cargo",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/cargo");
          },
        },
        {
          label: "Entidades Bancarias",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/entidadBancaria");
          },
        },
        {
          label: "Cuentas Corrientes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/cuentaCorriente");
          },
        },
        {
          label: "Empresa de Transporte",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/empresaTransporte");
          },
        },
        {
          label: "Departamento",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/departamento");
          },
        },
        {
          label: "Provincia",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/provincia");
          },
        },
        {
          label: "Distritos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/distrito");
          },
        },
        {
          label: "Almacenes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Mantenimiento/almacenes");
          },
        },
      ],
    },
    {
      label: "Almacen",
      icon: "pi pi-fw pi-truck",
      command: () => {
        navigate("/Almacen");
      },
    },
    {
      label: "Personal",
      icon: "pi pi-fw pi-users",
      command: () => {
        navigate("/Personal");
      },
    },
    {
      label: "Tesoreria",
      icon: "pi pi-fw pi-money-bill",
      items: [],
    },
    {
      label: "Informes",
      icon: "pi pi-fw pi-file",
      items: [
        {
          label: "Articulos",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Informe/InformeArticulo");
          },
        },
        {
          label: "Ventas",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Informe/Venta");
          },
        },
        {
          label: "Compras",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Informe/Compra");
          },
        },
        {
          label: "Tesoreria",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Informe/Tesoreria");
          },
        },
        {
          label: "Clientes",
          icon: "pi pi-fw pi-angle-double-right",
          command: () => {
            navigate("/Venta/Cliente");
          },
        },
      ],
    },
    {
      label: "Herramientas",
      icon: "pi pi-fw pi-eraser",
      items: [],
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
