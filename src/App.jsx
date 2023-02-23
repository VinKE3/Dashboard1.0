import { BrowserRouter, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/md-dark-indigo/theme.css";

import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";
// Layouts
import LayoutAdmin from "./layouts/LayoutAdmin";
// Pages auth
import Login from "./pages/auth/Login";
// Pages admin
import Home from "./pages/admin/Home";
import Profile from "./pages/admin/Profile";
import Error404 from "./pages/Error404";
import Tabla from "./components/Tabla";
// Pages ventas
import Clientes from "./pages/ventas/Clientes";
import ConductoresTransportistas from "./pages/ventas/ConductoresTransportistas";
import DocumentosDeVenta from "./pages/ventas/DocumentosVenta";
import GuiasDeRemision from "./pages/ventas/GuiasRemision";
import Cotizaciones from "./pages/ventas/Cotizaciones";
import SalidasDeArticulos from "./pages/ventas/SalidaDeArticulos";
import RegistroVentaArticulo from "./pages/ventas/RegistroVentaArticulo";
//Pages compras
import Proveedores from "./pages/compras/Proveedores";
import DocumentosDeCompra from "./pages/compras/DocumentosDeCompra";
import OrdenesDeCompra from "./pages/compras/OrdenesDeCompra";
import EntradaDeArticulos from "./pages/compras/EntradaDeArticulos";
import RegistroCompraArticulo from "./pages/compras/RegistroCompraArticulo";
//Pages mantenimiento
import TiposDeCambio from "./pages/mantenimiento/TiposDeCambio";
import Lineas from "./pages/mantenimiento/Lineas";
import Sublineas from "./pages/mantenimiento/Sublineas";
import Marcas from "./pages/mantenimiento/Marcas";
import UnidadesDeMedida from "./pages/mantenimiento/UnidadesDeMedida";
import TipoDePago from "./pages/mantenimiento/TipoDePago";
import Cargos from "./pages/mantenimiento/Cargos";
import EntidadesBancarias from "./pages/mantenimiento/EntidadesBancarias";
import CuentasCorrientes from "./pages/mantenimiento/CuentasCorrientes";
import Departamentos from "./pages/mantenimiento/Departamentos";
import Provincias from "./pages/mantenimiento/Provincias";
import Distrito from "./pages/mantenimiento/Distrito";
import Almacenes from "./pages/mantenimiento/Almacenes";
import CajaChicaConfiguracon from "./pages/mantenimiento/CajaChicaConfiguracon";
//Pages almacen
import Almacen from "./pages/almacen/Almacen";
//Pages personal
import Personal from "./pages/personal/Personal";
//pages tesoreria
import CajaChica from "./pages/tesoreria/CajaChica";
import CobrosCuentaBancaria from "./pages/tesoreria/CobrosCuentaBancaria";
import CuentasPorCobrar from "./pages/tesoreria/CuentasPorCobrar";
import CuentasPorPagar from "./pages/tesoreria/CuentasPorPagar";
import LetrasCambioCobro from "./pages/tesoreria/LetrasCambioCobro";
import LetrasCambioPago from "./pages/tesoreria/LetrasCambioPago";
import PagosCuentaBnacaria from "./pages/tesoreria/PagosCuentaBnacaria";
import PagosEnEfectivo from "./pages/tesoreria/PagosEnEfectivo";
import ReciboDeEgreso from "./pages/tesoreria/ReciboDeEgreso";
import ReciboDeIngreso from "./pages/tesoreria/ReciboDeIngreso";
import Retenciones from "./pages/tesoreria/Retenciones";

//page demo tabla
import Demo from "./components/Demo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/** VENTAS */}
          <Route path="/ventas/clientes" element={<Clientes />} />
          <Route
            path="/ventas/conductores-transportistas"
            element={<ConductoresTransportistas />}
          />
          <Route
            path="/ventas/documentos-de-venta"
            element={<DocumentosDeVenta />}
          />
          <Route
            path="/ventas/guias-de-remision"
            element={<GuiasDeRemision />}
          />
          <Route path="/ventas/cotizaciones" element={<Cotizaciones />} />
          <Route
            path="/ventas/salidas-de-articulos"
            element={<SalidasDeArticulos />}
          />
          <Route
            path="/ventas/registro-de-venta-articulo"
            element={<RegistroVentaArticulo />}
          />
          {/** COMPRAS */}
          <Route path="/compras/provedores" element={<Proveedores />} />
          <Route
            path="/compras/documentos-de-compra"
            element={<DocumentosDeCompra />}
          />
          <Route
            path="/compras/ordenes-de-compra"
            element={<OrdenesDeCompra />}
          />
          <Route
            path="/compras/entrada-de-articulos"
            element={<EntradaDeArticulos />}
          />
          <Route
            path="/compras/registro-de-compra-articulo"
            element={<RegistroCompraArticulo />}
          />
          {/** MANTENIMIENTO */}
          <Route
            path="/mantenimiento/tipos-de-cambio"
            element={<TiposDeCambio />}
          />
          <Route path="/mantenimiento/lineas" element={<Lineas />} />
          <Route path="/mantenimiento/sublineas" element={<Sublineas />} />
          <Route path="/mantenimiento/marcas" element={<Marcas />} />
          <Route
            path="/mantenimiento/unidades-de-medida"
            element={<UnidadesDeMedida />}
          />
          <Route path="/mantenimiento/tipos-de-pago" element={<TipoDePago />} />
          <Route path="/mantenimiento/cargos" element={<Cargos />} />
          <Route
            path="/mantenimiento/entidades-bancarias"
            element={<EntidadesBancarias />}
          />
          <Route
            path="/mantenimiento/cuentas-corrientes"
            element={<CuentasCorrientes />}
          />
          <Route
            path="/mantenimiento/departamentos"
            element={<Departamentos />}
          />
          <Route path="/mantenimiento/provincias" element={<Provincias />} />
          <Route path="/mantenimiento/distritos" element={<Distrito />} />
          <Route path="/mantenimiento/almacenes" element={<Almacenes />} />
          <Route
            path="/mantenimiento/caja-chica-configuracion"
            element={<CajaChicaConfiguracon />}
          />
          {/** ALMACEN */}
          <Route path="almacen" element={<Almacen />} />
          {/** PERSONAL */}
          <Route path="personal" element={<Personal />} />
          {/** TESORERIA */}
          <Route
            path="/tesoreria/cuentas-por-cobrar"
            element={<CuentasPorCobrar />}
          />
          <Route
            path="/tesoreria/cobros-cuentas-bancarias"
            element={<CobrosCuentaBancaria />}
          />
          <Route path="/tesoreria/retenciones" element={<Retenciones />} />
          <Route
            path="/tesoreria/letras-de-cambio-cobro"
            element={<LetrasCambioCobro />}
          />
          <Route
            path="/tesoreria/cuentas-por-pagar"
            element={<CuentasPorPagar />}
          />
          <Route
            path="/tesoreria/pagos-en-efectivo"
            element={<PagosEnEfectivo />}
          />
          <Route
            path="/tesoreria/pagos-cuenta-bancaria"
            element={<PagosCuentaBnacaria />}
          />
          <Route
            path="/tesoreria/letras-de-cambio-pago"
            element={<LetrasCambioPago />}
          />
          <Route path="/tesoreria/caja-chica" element={<CajaChica />} />
          <Route
            path="/tesoreria/recibo-de-ingreso"
            element={<ReciboDeIngreso />}
          />
          <Route
            path="/tesoreria/recibo-de-egreso"
            element={<ReciboDeEgreso />}
          />
          {/** OTROS */}
          <Route path="tabla" element={<Tabla />} />
          <Route path="demo" element={<Demo />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
        {/** ERROR */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
