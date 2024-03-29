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
//*Pages ventas
import ConductoresTransportistas from "./pages/ventas/conductoresTransportistas/ConductoresTransportistas";
import DocumentosDeVenta from "./pages/ventas/documentosVenta/DocumentosVenta";
import GuiasDeRemision from "./pages/ventas/guiasRemision/GuiasRemision";
import Cotizaciones from "./pages/ventas/cotizaciones/Cotizaciones";
import SalidasDeArticulos from "./pages/ventas/salidaDeArticulos/SalidaDeArticulos";
import RegistroVentaArticulo from "./pages/ventas/registroVentaArituculo/RegistroVentaArticulo";
import BloquearVenta from "./pages/ventas/bloquearVenta/BloquearVenta";
//*Pages compras
import Proveedores from "./pages/compras/proveedores/Proveedores";
import DocumentosDeCompra from "./pages/compras/documentoDeCompra/DocumentosDeCompra";
import OrdenesDeCompra from "./pages/compras/ordenesDeCompra/OrdenesDeCompra";
import EntradaDeArticulos from "./pages/compras/entradaDeArticulos/EntradaDeArticulos";
import RegistroCompraArticulo from "./pages/compras/registroCompraArticulo/RegistroCompraArticulo";
import BloquearCompra from "./pages/compras/bloquearCompra/BloquearCompra";
//*Pages mantenimiento
import Articulo from "./pages/mantenimiento/articulo/Articulo";
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
import Empresa from "./pages/mantenimiento/empresa/Empresa";
import Correlativos from "./pages/mantenimiento/correlativos/Correlativos";
import EmpresaDeTransporte from "./pages/mantenimiento/empresaDeTransporte/EmpresaDeTransporte";
//*Pages almacen
import Almacen from "./pages/almacen/Almacen";
//*Pages Finanzas
import BloquearMovimientoBancario from "./pages/finanzas/bloquearMovimientoBancario/BloquearMovimientoBancario";
//*Pages personal
import Personal from "./pages/personal/Personal";
//*pages tesoreria
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
import BloquearReciboEgreso from "./pages/tesoreria/bloquearReciboEgreso/BloquearReciboEgreso";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/** //!VENTAS */}
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
          <Route path="/ventas/bloquear-venta" element={<BloquearVenta />} />
          {/** //!COMPRAS */}
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
          <Route path="/compras/bloquear-compra" element={<BloquearCompra />} />
          {/** //!MANTENIMIENTO */}
          <Route path="/mantenimiento/usuarios" element={<Usuarios />} />
          <Route path="/mantenimiento/articulos" element={<Articulo />} />
          <Route
            path="/mantenimiento/correlativos"
            element={<Correlativos />}
          />
          <Route path="/mantenimiento/empresa" element={<Empresa />} />
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
          <Route
            path="/mantenimiento/empresa-de-transporte"
            element={<EmpresaDeTransporte />}
          />
          {/** //!ALMACEN */}
          <Route path="almacen" element={<Almacen />} />
          {/** //!FINANZAS */}
          <Route
            path="/finanzas/bloquear-movimiento-bancario"
            element={<BloquearMovimientoBancario />}
          />
          {/** //!PERSONAL */}
          <Route path="personal" element={<Personal />} />
          {/** //!TESORERIA */}
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
          <Route
            path="/tesoreria/bloquear-recibo-de-egreso"
            element={<BloquearReciboEgreso />}
          />
        </Route>
        {/** //!ERROR */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
