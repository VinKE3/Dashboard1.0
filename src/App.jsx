import { BrowserRouter, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// Layout
import LayoutAdmin from "./layouts/LayoutAdmin";
// Pages auth
import Login from "./pages/auth/Login";
// Pages admin
import Home from "./pages/admin/Home";
import Profile from "./pages/admin/Profile";
import Error404 from "./pages/Error404";
import Tabla from "./components/Tabla";
// Pages ventas
// import Clientes from "./pages/ventas/clientes/Clientes";
import ConductoresTransportistas from "./pages/ventas/conductoresTransportistas/ConductoresTransportistas";
import DocumentosDeVenta from "./pages/ventas/documentosVenta/DocumentosVenta";
import GuiasDeRemision from "./pages/ventas/guiasRemision/GuiasRemision";
import Cotizaciones from "./pages/ventas/cotizaciones/Cotizaciones";
import SalidasDeArticulos from "./pages/ventas/salidaDeArticulos/SalidaDeArticulos";
import RegistroVentaArticulo from "./pages/ventas/registroVentaArituculo/RegistroVentaArticulo";
//Pages compras
import Proveedores from "./pages/compras/proveedores/Proveedores";
import DocumentosDeCompra from "./pages/compras/documentoDeCompra/DocumentosDeCompra";
import OrdenesDeCompra from "./pages/compras/ordenesDeCompra/OrdenesDeCompra";
import EntradaDeArticulos from "./pages/compras/entradaDeArticulos/EntradaDeArticulos";
import RegistroCompraArticulo from "./pages/compras/registroCompraArticulo/RegistroCompraArticulo";
//Pages mantenimiento
import Usuarios from "./pages/mantenimiento/usuarios/Usuarios";
import Clientes from "./pages/mantenimiento/cliente/Cliente";
import TiposDeCambio from "./pages/mantenimiento/tiposDeCambio/TiposDeCambio";
import Lineas from "./pages/mantenimiento/lineas/Lineas";
import Sublineas from "./pages/mantenimiento/sublineas/Sublineas";
import Marcas from "./pages/mantenimiento/marcas/Marcas";
import UnidadesDeMedida from "./pages/mantenimiento/unidadesDeMedida/UnidadesDeMedida";
import TipoDePago from "./pages/mantenimiento/tipoDePago/TipoDePago";
import Cargos from "./pages/mantenimiento/cargos/Cargos";
import EntidadesBancarias from "./pages/mantenimiento/entidadesBancarias/EntidadesBancarias";
import CuentasCorrientes from "./pages/mantenimiento/cuentasCorrientes/CuentasCorrientes";
import Conductor from "./pages/mantenimiento/conductor/Conductor";
import Departamentos from "./pages/mantenimiento/departamentos/Departamentos";
import Provincias from "./pages/mantenimiento/provincias/Provincias";
import Distrito from "./pages/mantenimiento/distritos/Distrito";
import Almacenes from "./pages/mantenimiento/almacenes/Almacenes";
import CajaChicaConfiguracion from "./pages/mantenimiento/cajaChicaConfiguracion/CajaChicaConfiguracion";
//Pages almacen
import Almacen from "./pages/almacen/Almacen";
//Pages personal
import Personal from "./pages/personal/Personal";
//pages tesoreria
import CajaChica from "./pages/tesoreria/cajaChica/CajaChica";
import CobrosCuentaBancaria from "./pages/tesoreria/cobrosCuentasBancaria/CobrosCuentaBancaria";
import CuentasPorCobrar from "./pages/tesoreria/cuentasPorCobrar/CuentasPorCobrar";
import CuentasPorPagar from "./pages/tesoreria/cuentasPorPagar/CuentasPorPagar";
import LetrasCambioCobro from "./pages/tesoreria/letrasCambioCobro/LetrasCambioCobro";
import LetrasCambioPago from "./pages/tesoreria/letrasCambioPago/LetrasCambioPago";
import PagosCuentaBnacaria from "./pages/tesoreria/pagosCuentasBancaria/PagosCuentaBnacaria";
import PagosEnEfectivo from "./pages/tesoreria/pagosEnEfectivo/PagosEnEfectivo";
import ReciboDeEgreso from "./pages/tesoreria/reciboDeEgreso/ReciboDeEgreso";
import ReciboDeIngreso from "./pages/tesoreria/reciboDeIngreso/ReciboDeIngreso";
import Retenciones from "./pages/tesoreria/retenciones/Retenciones";

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
          <Route path="/mantenimiento/usuarios" element={<Usuarios />} />
          <Route path="/mantenimiento/clientes" element={<Clientes />} />
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
          <Route path="/mantenimiento/conductor" element={<Conductor />} />
          <Route
            path="/mantenimiento/departamentos"
            element={<Departamentos />}
          />
          <Route path="/mantenimiento/provincias" element={<Provincias />} />
          <Route path="/mantenimiento/distritos" element={<Distrito />} />
          <Route path="/mantenimiento/almacenes" element={<Almacenes />} />
          <Route
            path="/mantenimiento/caja-chica-configuracion"
            element={<CajaChicaConfiguracion />}
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
