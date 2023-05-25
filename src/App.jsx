import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
//?Layout
import LayoutAdmin from "./layouts/LayoutAdmin";
//?Pages auth
import Login from "./pages/auth/Login";
//?Pages admin
import Home from "./pages/admin/Home";
import Error404 from "./pages/Error404";
//*Pages Venta
import ConductorTransportista from "./pages/Venta/ConductorTransportista/ConductorTransportista";
import DocumentoVenta from "./pages/Venta/DocumentoVenta/DocumentoVenta";
import GuiaRemision from "./pages/Venta/GuiaRemision/GuiaRemision";
import Cotizacion from "./pages/Venta/cotizacion/Cotizacion";
import BloquearVenta from "./pages/Venta/BloquearVenta/BloquearVenta";
import Retencion from "./pages/Venta/Retencion/Retencion";
import Cliente from "./pages/Venta/Cliente/Cliente";
//*Pages Compra
import Proveedor from "./pages/Compra/Proveedor/Proveedor";
import FacturaNegociable from "./pages/Compra/FacturaNegociable/FacturaNegociable";
import LetraCambioCompra from "./pages/Compra/LetraCambioCompra/LetraCambioCompra";
import DocumentoCompra from "./pages/Compra/DocumentoCompra/DocumentoCompra";
import OrdenCompra from "./pages/Compra/OrdenCompra/OrdenCompra";
import BloquearCompra from "./pages/Compra/BloquearCompra/BloquearCompra";
import GuiaCompra from "./pages/Compra/GuiaCompra/GuiaCompra";
//*Pages Mantenimiento
import Usuario from "./pages/Mantenimiento/Usuario/Usuario";
import TipoCambio from "./pages/Mantenimiento/TipoCambio/TipoCambio";
import Linea from "./pages/Mantenimiento/linea/Linea";
import SubLinea from "./pages/Mantenimiento/subLinea/SubLinea";
import Marca from "./pages/Mantenimiento/marca/Marca";
import UnidadMedida from "./pages/Mantenimiento/UnidadMedida/UnidadMedida";
import TipoCobroPago from "./pages/Mantenimiento/TipoCobroPago/TipoCobroPago";
import Cargo from "./pages/Mantenimiento/cargo/Cargo";
import EntidadBancaria from "./pages/Mantenimiento/EntidadBancaria/EntidadBancaria";
import CuentaCorriente from "./pages/Mantenimiento/CuentaCorriente/CuentaCorriente";
import Departamento from "./pages/Mantenimiento/departamento/Departamento";
import Provincia from "./pages/Mantenimiento/provincia/Provincia";
import Distrito from "./pages/Mantenimiento/distrito/Distrito";
import Empresa from "./pages/Mantenimiento/Empresa/Empresa";
import Correlativo from "./pages/Mantenimiento/Correlativo/Correlativo";
import EmpresaTransporte from "./pages/Mantenimiento/EmpresaTransporte/EmpresaTransporte";
import Vehiculo from "./pages/Mantenimiento/vehiculo/Vehiculo";
//*Pages Almacen
import MovimientoArticulo from "./pages/Almacen/MovimientoArticulo/MovimientoArticulo";
import CuadreStock from "./pages/Almacen/CuadreStock/CuadreStock";
import EntradaAlmacen from "./pages/Almacen/EntradaAlmacen/EntradaAlmacen";
import SalidaAlmacen from "./pages/Almacen/SalidaAlmacen/SalidaAlmacen";
import EntradaCilindros from "./pages/Almacen/EntradaCilindros/EntradaCilindros";
import SalidaCilindros from "./pages/Almacen/SalidaCilindros/SalidaCilindros";
//*Pages Finanzas
import BloquearMovimientoBancario from "./pages/Finanza/BloquearMovimientoBancario/BloquearMovimientoBancario";
import MovimientoBancario from "./pages/Finanza/MovimientoBancario/MovimientoBancario";
//*Pages Personal
import Personal from "./pages/Personal/Personal";
//*pages Tesoreria
import Cef from "./pages/Compra/CEF/Cef";
import Cheque from "./pages/Compra/Cheque/Cheque";
import Articulo from "./pages/Mantenimiento/Articulo/Articulo";
import CuentaPorPagar from "./pages/Finanza/CuentaPorPagar/CuentaPorPagar";
//*pages Herramientas
import InformeArticulo from "./pages/Informe/InformeArticulo/InformeArticulo";
import InformeCompra from "./pages/Informe/InformeCompra/InformeCompra";
import InformeVenta from "./pages/Informe/InformeVenta/InformeVenta";
import InformeTesoreria from "./pages/Informe/InformeTesoreria/InformeTesoreria";
//*pages Cobranzas
import CuentaPorCobrar from "./pages/Cobranza/CuentaPorCobrar/CuentaPorCobrar";
import PLanillaCobro from "./pages/Cobranza/PlanillaCobro/PLanillaCobro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/** //!VENTAS */}
          <Route path="/Venta/clientes" element={<Cliente />} />
          <Route
            path="/Venta/conductorTransportista"
            element={<ConductorTransportista />}
          />
          <Route
            path="/Venta/documentoVenta"
            element={<DocumentoVenta />}
          />
          <Route
            path="/Venta/guiaRemision"
            element={<GuiaRemision />}
          />
          <Route path="/Venta/cotizacion" element={<Cotizacion />} />
          <Route path="/Venta/bloquearVenta" element={<BloquearVenta />} />

          <Route path="/Venta/retencion" element={<Retencion />} />
          {/** //!COMPRAS */}
          <Route path="/Compra/proveedor" element={<Proveedor />} />
          <Route
            path="/Compra/documentoCompra"
            element={<DocumentoCompra />}
          />
          <Route
            path="/Compra/letraCambioCompra"
            element={<LetraCambioCompra />}
          />
          <Route
            path="/Compra/ordenCompra"
            element={<OrdenCompra />}
          />
          <Route path="/Compra/guiaCompra" element={<GuiaCompra />} />
          <Route path="/Compra/CEF" element={<Cef />} />
          <Route path="/Compra/Cheque" element={<Cheque />} />

          <Route path="/Compra/bloquearCompra" element={<BloquearCompra />} />
          <Route
            path="/Compra/facturaNegociable"
            element={<FacturaNegociable />}
          />
          {/** //!MANTENIMIENTO */}
          <Route path="/Mantenimiento/Usuario" element={<Usuario />} />
          <Route
            path="/Mantenimiento/Correlativo"
            element={<Correlativo />}
          />
          <Route path="/Mantenimiento/Empresa" element={<Empresa />} />
          <Route path="/Mantenimiento/Articulo" element={<Articulo />} />
          <Route
            path="/Mantenimiento/tipoCambio"
            element={<TipoCambio />}
          />
          <Route path="/Mantenimiento/linea" element={<Linea />} />
          <Route path="/Mantenimiento/subLinea" element={<SubLinea />} />
          <Route path="/Mantenimiento/marca" element={<Marca />} />
          <Route
            path="/Mantenimiento/unidadMedida"
            element={<UnidadMedida />}
          />
          <Route path="/Mantenimiento/tipoCobroPago" element={<TipoCobroPago />} />
          <Route path="/Mantenimiento/cargo" element={<Cargo />} />
          <Route
            path="/Mantenimiento/entidadBancaria"
            element={<EntidadBancaria />}
          />
          <Route
            path="/Mantenimiento/cuentaCorriente"
            element={<CuentaCorriente />}
          />
          <Route
            path="/Mantenimiento/departamento"
            element={<Departamento />}
          />
          <Route path="/Mantenimiento/provincia" element={<Provincia />} />
          <Route path="/Mantenimiento/distrito" element={<Distrito />} />
          <Route
            path="/Mantenimiento/empresaTransporte"
            element={<EmpresaTransporte />}
          />
          <Route path="/Mantenimiento/vehiculo" element={<Vehiculo />} />
          {/** //!ALMACEN */}
          <Route
            path="Almacen/movimientoArticulo"
            element={<MovimientoArticulo />}
          />
          <Route
            path="Almacen/entradaAlmacen"
            element={<EntradaAlmacen />}
          />
          <Route
            path="Almacen/salidaAlmacen"
            element={<SalidaAlmacen />}
          />
          <Route
            path="Almacen/entradaCilindros"
            element={<EntradaCilindros />}
          />
          <Route
            path="Almacen/salidaCilindro"
            element={<SalidaCilindros />}
          />
          <Route path="Almacen/cuadreStock" element={<CuadreStock />} />
          {/** //!FINANZAS */}
          <Route
            path="/Finanza/bloquearMovimientoBancario"
            element={<BloquearMovimientoBancario />}
          />
          <Route
            path="/Finanza/cuentaPorPagar"
            element={<CuentaPorPagar />}
          />
          <Route
            path="/Finanza/movimientoBancario"
            element={<MovimientoBancario />}
          />
          {/** //!PERSONAL */}
          <Route path="personal" element={<Personal />} />
          {/** //!COBRANZAS */}
          <Route
            path="Cobranza/cuentaPorCobrar"
            element={<CuentaPorCobrar />}
          />
           <Route
            path="Cobranza/planillaCobro"
            element={<PLanillaCobro />}
          />
          {/** //!TESORERIA */}
    
          {/** //!INFORMES */}
          <Route path="/Informe/InformeArticulo" element={<InformeArticulo />} />
          <Route path="/Informe/InformeVenta" element={<InformeVenta />} />
          <Route path="/Informe/InformeCompra" element={<InformeCompra />} />
          <Route path="/Informe/InformeTesoreria" element={<InformeTesoreria />} />
        </Route>

        {/** //!ERROR */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
