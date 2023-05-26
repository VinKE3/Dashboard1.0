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
//Pages Venta
import Cliente from "./pages/Venta/Cliente/Cliente";
import ConductorTransportista from "./pages/Venta/ConductorTransportista/ConductorTransportista";
import Cotizacion from "./pages/Venta/Cotizacion/Cotizacion";
import DocumentoVenta from "./pages/Venta/DocumentoVenta/DocumentoVenta";
import Retencion from "./pages/Venta/Retencion/Retencion";
import LetraCambioVenta from "./pages/Venta/LetraCambioVenta/LetraCambioVenta";
import GuiaRemision from "./pages/Venta/GuiaRemision/GuiaRemision";
//Pages Venta
//Pages Compra
import Proveedor from "./pages/Compra/Proveedor/Proveedor";
import FacturaNegociable from "./pages/Compra/FacturaNegociable/FacturaNegociable";
import LetraCambioCompra from "./pages/Compra/LetraCambioCompra/LetraCambioCompra";
import DocumentoCompra from "./pages/Compra/DocumentoCompra/DocumentoCompra";
import OrdenCompra from "./pages/Compra/OrdenCompra/OrdenCompra";
import GuiaCompra from "./pages/Compra/GuiaCompra/GuiaCompra";
//Pages Compra
//Pages Mantenimiento
import Usuario from "./pages/Mantenimiento/Usuario/Usuario";
import TipoCambio from "./pages/Mantenimiento/TipoCambio/TipoCambio";
import Linea from "./pages/Mantenimiento/Linea/Linea";
import SubLinea from "./pages/Mantenimiento/SubLinea/SubLinea";
import Marca from "./pages/Mantenimiento/Marca/Marca";
import UnidadMedida from "./pages/Mantenimiento/UnidadMedida/UnidadMedida";
import TipoCobroPago from "./pages/Mantenimiento/TipoCobroPago/TipoCobroPago";
import Cargo from "./pages/Mantenimiento/Cargo/Cargo";
import EntidadBancaria from "./pages/Mantenimiento/EntidadBancaria/EntidadBancaria";
import CuentaCorriente from "./pages/Mantenimiento/CuentaCorriente/CuentaCorriente";
import Departamento from "./pages/Mantenimiento/Departamento/Departamento";
import Provincia from "./pages/Mantenimiento/Provincia/Provincia";
import Distrito from "./pages/Mantenimiento/Distrito/Distrito";
import Empresa from "./pages/Mantenimiento/Empresa/Empresa";
import Correlativo from "./pages/Mantenimiento/Correlativo/Correlativo";
import EmpresaTransporte from "./pages/Mantenimiento/EmpresaTransporte/EmpresaTransporte";
import Vehiculo from "./pages/Mantenimiento/Vehiculo/Vehiculo";
//Pages Mantenimiento
//Pages Almacen
import MovimientoArticulo from "./pages/Almacen/MovimientoArticulo/MovimientoArticulo";
import CuadreStock from "./pages/Almacen/CuadreStock/CuadreStock";
import EntradaAlmacen from "./pages/Almacen/EntradaAlmacen/EntradaAlmacen";
import SalidaAlmacen from "./pages/Almacen/SalidaAlmacen/SalidaAlmacen";
import EntradaCilindros from "./pages/Almacen/EntradaCilindros/EntradaCilindros";
import SalidaCilindros from "./pages/Almacen/SalidaCilindros/SalidaCilindros";
//Pages Almacen
//Pages Finanzas
import MovimientoBancario from "./pages/Finanza/MovimientoBancario/MovimientoBancario";
//Pages Finanzas
//Pages Personal
import Personal from "./pages/Personal/Personal";
//Pages Personal
//Pages Tesoreria
import Cef from "./pages/Compra/CEF/Cef";
import Cheque from "./pages/Compra/Cheque/Cheque";
import Articulo from "./pages/Mantenimiento/Articulo/Articulo";
import CuentaPorPagar from "./pages/Finanza/CuentaPorPagar/CuentaPorPagar";
//Pages Tesoreria
//Pages Bloqueos
import BloquearVenta from "./pages/Venta/BloquearVenta/BloquearVenta";
import BloquearCompra from "./pages/Compra/BloquearCompra/BloquearCompra";
import BloquearMovimientoBancario from "./pages/Finanza/BloquearMovimientoBancario/BloquearMovimientoBancario";
//Pages Bloqueos
//Pages Herramientas
import InformeArticulo from "./pages/Informe/InformeArticulo/InformeArticulo";
import InformeCompra from "./pages/Informe/InformeCompra/InformeCompra";
import InformeVenta from "./pages/Informe/InformeVenta/InformeVenta";
import InformeTesoreria from "./pages/Informe/InformeTesoreria/InformeTesoreria";
//Pages Herramientas
//Pages Cobranzas
import CuentaPorCobrar from "./pages/Cobranza/CuentaPorCobrar/CuentaPorCobrar";
import PLanillaCobro from "./pages/Cobranza/PlanillaCobro/PlanillaCobro";
//Pages Cobranzas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/*VENTAS */}
          <Route path="/Venta/Cliente" element={<Cliente />} />
          <Route
            path="/Venta/ConductorTransportista"
            element={<ConductorTransportista />}
          />
          <Route path="/Venta/Cotizacion" element={<Cotizacion />} />
          <Route path="/Venta/DocumentoVenta" element={<DocumentoVenta />} />
          <Route path="/Venta/GuiaRemision" element={<GuiaRemision />} />
          <Route path="/Venta/LetraCambioVenta" element={<LetraCambioVenta />} />
          <Route path="/Venta/Retencion" element={<Retencion />} />
          <Route path="/Venta/BloquearVenta" element={<BloquearVenta />} />
          {/*VENTAS */}
          {/*COMPRAS */}
          <Route path="/Compra/Proveedor" element={<Proveedor />} />
          <Route path="/Compra/DocumentoCompra" element={<DocumentoCompra />} />
          <Route
            path="/Compra/LetraCambioCompra"
            element={<LetraCambioCompra />}
          />
          <Route path="/Compra/OrdenCompra" element={<OrdenCompra />} />
          <Route path="/Compra/GuiaCompra" element={<GuiaCompra />} />
          <Route path="/Compra/CEF" element={<Cef />} />
          <Route path="/Compra/Cheque" element={<Cheque />} />

          <Route path="/Compra/BloquearCompra" element={<BloquearCompra />} />
          <Route
            path="/Compra/FacturaNegociable"
            element={<FacturaNegociable />}
          />
          {/*COMPRAS */}

          {/* MANTENIMIENTO */}
          <Route path="/Mantenimiento/Usuario" element={<Usuario />} />
          <Route path="/Mantenimiento/Correlativo" element={<Correlativo />} />
          <Route path="/Mantenimiento/Empresa" element={<Empresa />} />
          <Route path="/Mantenimiento/Articulo" element={<Articulo />} />
          <Route path="/Mantenimiento/TipoCambio" element={<TipoCambio />} />
          <Route path="/Mantenimiento/Linea" element={<Linea />} />
          <Route path="/Mantenimiento/SubLinea" element={<SubLinea />} />
          <Route path="/Mantenimiento/Marca" element={<Marca />} />
          <Route
            path="/Mantenimiento/UnidadMedida"
            element={<UnidadMedida />}
          />
          <Route
            path="/Mantenimiento/TipoCobroPago"
            element={<TipoCobroPago />}
          />
          <Route path="/Mantenimiento/Cargo" element={<Cargo />} />
          <Route
            path="/Mantenimiento/EntidadBancaria"
            element={<EntidadBancaria />}
          />
          <Route
            path="/Mantenimiento/CuentaCorriente"
            element={<CuentaCorriente />}
          />
          <Route
            path="/Mantenimiento/Departamento"
            element={<Departamento />}
          />
          <Route path="/Mantenimiento/Provincia" element={<Provincia />} />
          <Route path="/Mantenimiento/Distrito" element={<Distrito />} />
          <Route
            path="/Mantenimiento/EmpresaTransporte"
            element={<EmpresaTransporte />}
          />
          <Route path="/Mantenimiento/Vehiculo" element={<Vehiculo />} />
          {/* MANTENIMIENTO */}

          {/*ALMACEN */}
          <Route
            path="Almacen/MovimientoArticulo"
            element={<MovimientoArticulo />}
          />
          <Route path="Almacen/EntradaAlmacen" element={<EntradaAlmacen />} />
          <Route path="Almacen/SalidaAlmacen" element={<SalidaAlmacen />} />
          <Route
            path="Almacen/EntradaCilindros"
            element={<EntradaCilindros />}
          />
          <Route path="Almacen/SalidaCilindro" element={<SalidaCilindros />} />
          <Route path="Almacen/CuadreStock" element={<CuadreStock />} />
          {/*ALMACEN */}

          {/* FINANZAS */}
          <Route
            path="/Finanza/BloquearMovimientoBancario"
            element={<BloquearMovimientoBancario />}
          />
          <Route path="/Finanza/CuentaPorPagar" element={<CuentaPorPagar />} />
          <Route
            path="/Finanza/MovimientoBancario"
            element={<MovimientoBancario />}
          />
          {/* FINANZAS */}

          {/*PERSONAL */}
          <Route path="Personal" element={<Personal />} />
          {/*PERSONAL */}

          {/*COBRANZAS */}
          <Route
            path="Cobranza/CuentaPorCobrar"
            element={<CuentaPorCobrar />}
          />
          <Route path="Cobranza/PlanillaCobro" element={<PLanillaCobro />} />
          {/*COBRANZAS */}

          {/*TESORERIA */}

          {/*INFORMES */}
          <Route
            path="/Informe/InformeArticulo"
            element={<InformeArticulo />}
          />
          <Route path="/Informe/InformeVenta" element={<InformeVenta />} />
          <Route path="/Informe/InformeCompra" element={<InformeCompra />} />
          <Route
            path="/Informe/InformeTesoreria"
            element={<InformeTesoreria />}
          />
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
