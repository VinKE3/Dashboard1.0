import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/theme.css";
//Layout
import LayoutAdmin from "./layouts/LayoutAdmin";
//Layout
//Pages auth
import Login from "./pages/auth/Login";
//Pages auth
//Pages admin
import Home from "./pages/admin/Home";
//Pages admin
import Error404 from "./pages/Error404";
//Pages venta
import Cliente from "./pages/venta/cliente/Cliente";
import ConductorTransportista from "./pages/venta/conductorTransportista/ConductorTransportista";
import Cotizacion from "./pages/venta/cotizacion/Cotizacion";
import DocumentoVenta from "./pages/venta/documentoVenta/DocumentoVenta";
import GuiaRemision from "./pages/venta/guiaRemision/GuiaRemision";
import LetraCambioVenta from "./pages/venta/letraCambioVenta/LetraCambioVenta";
import Retencion from "./pages/venta/retencion/Retencion";
//Pages venta
//Pages compra
import DocumentoCompra from "./pages/compra/documentoCompra/DocumentoCompra";
import FacturaNegociable from "./pages/compra/facturaNegociable/FacturaNegociable";
import GuiaCompra from "./pages/compra/guiaCompra/GuiaCompra";
import LetraCambioCompra from "./pages/compra/letraCambioCompra/LetraCambioCompra";
import OrdenCompra from "./pages/compra/ordenCompra/OrdenCompra";
import Proveedor from "./pages/compra/proveedor/Proveedor";
//Pages compra
//Pages mantenimiento
import Cargo from "./pages/mantenimiento/cargo/Cargo";
import Correlativo from "./pages/mantenimiento/correlativo/Correlativo";
import CuentaCorriente from "./pages/mantenimiento/cuentaCorriente/CuentaCorriente";
import Departamento from "./pages/mantenimiento/departamento/Departamento";
import Distrito from "./pages/mantenimiento/distrito/Distrito";
import Empresa from "./pages/mantenimiento/empresa/Empresa";
import EmpresaTransporte from "./pages/mantenimiento/empresaTransporte/EmpresaTransporte";
import EntidadBancaria from "./pages/mantenimiento/entidadBancaria/EntidadBancaria";
import Linea from "./pages/mantenimiento/linea/Linea";
import Marca from "./pages/mantenimiento/marca/Marca";
import Provincia from "./pages/mantenimiento/provincia/Provincia";
import SubLinea from "./pages/mantenimiento/subLinea/SubLinea";
import TipoCambio from "./pages/mantenimiento/tipoCambio/TipoCambio";
import TipoCobroPago from "./pages/mantenimiento/tipoCobroPago/TipoCobroPago";
import UnidadMedida from "./pages/mantenimiento/unidadMedida/UnidadMedida";
import Usuario from "./pages/mantenimiento/usuario/Usuario";
import Vehiculo from "./pages/mantenimiento/vehiculo/Vehiculo";
//Pages mantenimiento
//Pages almacen
import CuadreStock from "./pages/almacen/cuadreStock/CuadreStock";
import EntradaAlmacen from "./pages/almacen/entradaAlmacen/EntradaAlmacen";
import EntradaCilindros from "./pages/almacen/entradaCilindros/EntradaCilindros";
import MovimientoArticulo from "./pages/almacen/movimientoArticulo/MovimientoArticulo";
import SalidaAlmacen from "./pages/almacen/salidaAlmacen/SalidaAlmacen";
import SalidaCilindros from "./pages/almacen/salidaCilindros/SalidaCilindros";
//Pages almacen
//Pages Finanzas
import MovimientoBancario from "./pages/finanza/movimientoBancario/MovimientoBancario";
//Pages Cobranzas
import CuentaPorCobrar from "./pages/cobranza/cuentaPorCobrar/CuentaPorCobrar";
import PLanillaCobro from "./pages/cobranza/planillaCobro/PlanillaCobro";
//Pages Cobranzas
//Pages Personal
import Personal from "./pages/personal/Personal";
//Pages Personal
//Pages tesoreria
import Cef from "./pages/compra/cef/Cef";
import Cheque from "./pages/compra/cheque/Cheque";
import CuentaPorPagar from "./pages/finanza/cuentaPorPagar/CuentaPorPagar";
import Articulo from "./pages/mantenimiento/articulo/Articulo";
//Pages tesoreria
//Pages Bloqueos
import BloquearCompra from "./pages/compra/bloquearCompra/BloquearCompra";
import BloquearMovimientoBancario from "./pages/finanza/bloquearMovimientoBancario/BloquearMovimientoBancario";
import BloquearVenta from "./pages/venta/bloquearVenta/BloquearVenta";
//Pages Bloqueos
//Pages Herramientas
import Informe from "./pages/informe/Informe";
//Pages Herramientas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/*VENTAS */}
          <Route path="/venta/cliente" element={<Cliente />} />
          <Route
            path="/venta/conductorTransportista"
            element={<ConductorTransportista />}
          />
          <Route path="/venta/cotizacion" element={<Cotizacion />} />
          <Route path="/venta/documentoVenta" element={<DocumentoVenta />} />
          <Route path="/venta/guiaRemision" element={<GuiaRemision />} />
          <Route
            path="/venta/letraCambioVenta"
            element={<LetraCambioVenta />}
          />
          <Route path="/venta/retencion" element={<Retencion />} />
          <Route path="/venta/bloquearVenta" element={<BloquearVenta />} />
          {/*VENTAS */}
          {/*COMPRAS */}
          <Route path="/compra/proveedor" element={<Proveedor />} />
          <Route path="/compra/documentoCompra" element={<DocumentoCompra />} />
          <Route
            path="/compra/letraCambioCompra"
            element={<LetraCambioCompra />}
          />
          <Route path="/compra/ordenCompra" element={<OrdenCompra />} />
          <Route path="/compra/guiaCompra" element={<GuiaCompra />} />
          <Route path="/compra/cef" element={<Cef />} />
          <Route path="/compra/cheque" element={<Cheque />} />

          <Route path="/compra/bloquearCompra" element={<BloquearCompra />} />
          <Route
            path="/compra/facturaNegociable"
            element={<FacturaNegociable />}
          />
          {/*COMPRAS */}

          {/* MANTENIMIENTO */}
          <Route path="/mantenimiento/usuario" element={<Usuario />} />
          <Route path="/mantenimiento/correlativo" element={<Correlativo />} />
          <Route path="/mantenimiento/empresa" element={<Empresa />} />
          <Route path="/mantenimiento/articulo" element={<Articulo />} />
          <Route path="/mantenimiento/tipoCambio" element={<TipoCambio />} />
          <Route path="/mantenimiento/linea" element={<Linea />} />
          <Route path="/mantenimiento/subLinea" element={<SubLinea />} />
          <Route path="/mantenimiento/marca" element={<Marca />} />
          <Route
            path="/mantenimiento/unidadMedida"
            element={<UnidadMedida />}
          />
          <Route
            path="/mantenimiento/tipoCobroPago"
            element={<TipoCobroPago />}
          />
          <Route path="/mantenimiento/cargo" element={<Cargo />} />
          <Route
            path="/mantenimiento/entidadBancaria"
            element={<EntidadBancaria />}
          />
          <Route
            path="/mantenimiento/cuentaCorriente"
            element={<CuentaCorriente />}
          />
          <Route
            path="/mantenimiento/departamento"
            element={<Departamento />}
          />
          <Route path="/mantenimiento/provincia" element={<Provincia />} />
          <Route path="/mantenimiento/distrito" element={<Distrito />} />
          <Route
            path="/mantenimiento/empresaTransporte"
            element={<EmpresaTransporte />}
          />
          <Route path="/mantenimiento/vehiculo" element={<Vehiculo />} />
          {/* MANTENIMIENTO */}

          {/*ALMACEN */}
          <Route
            path="almacen/movimientoArticulo"
            element={<MovimientoArticulo />}
          />
          <Route path="almacen/entradaAlmacen" element={<EntradaAlmacen />} />
          <Route path="almacen/salidaAlmacen" element={<SalidaAlmacen />} />
          <Route
            path="almacen/entradaCilindros"
            element={<EntradaCilindros />}
          />
          <Route path="almacen/salidaCilindro" element={<SalidaCilindros />} />
          <Route path="almacen/cuadreStock" element={<CuadreStock />} />
          {/*ALMACEN */}

          {/* FINANZAS */}
          <Route
            path="/finanza/bloquearMovimientoBancario"
            element={<BloquearMovimientoBancario />}
          />
          <Route path="/finanza/cuentaPorPagar" element={<CuentaPorPagar />} />
          <Route
            path="/finanza/movimientoBancario"
            element={<MovimientoBancario />}
          />
          {/* FINANZAS */}

          {/*PERSONAL */}
          <Route path="personal" element={<Personal />} />
          {/*PERSONAL */}

          {/*COBRANZAS */}
          <Route
            path="cobranza/cuentaPorCobrar"
            element={<CuentaPorCobrar />}
          />
          <Route path="cobranza/planillaCobro" element={<PLanillaCobro />} />
          {/*COBRANZAS */}

          {/*INFORMES */}
          <Route path="/informe/informe" element={<Informe />} />
          {/*INFORMES */}
        </Route>

        {/*ERROR */}
        <Route path="*" element={<Error404 />} />
        {/*ERROR */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
