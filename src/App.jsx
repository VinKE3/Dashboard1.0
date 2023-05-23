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
import GuiasDeRemision from "./pages/ventas/guiaRemision/GuiaRemision";
import Cotizaciones from "./pages/ventas/cotizaciones/Cotizaciones";
import BloquearVenta from "./pages/ventas/bloquearVenta/BloquearVenta";
import Retencion from "./pages/ventas/retencion/Retencion";
import Cliente from "./pages/ventas/cliente/Cliente";
//*Pages compras
import Proveedores from "./pages/compras/proveedores/Proveedores";
import FacturaNegociable from "./pages/compras/facturaNegociable/FacturaNegociable";
import LetraCambioCompra from "./pages/compras/letraCambioCompra/LetraCambioCompra";
import DocumentosDeCompra from "./pages/compras/documentoDeCompra/DocumentosDeCompra";
import OrdenesDeCompra from "./pages/compras/ordenesDeCompra/OrdenesDeCompra";
import BloquearCompra from "./pages/compras/bloquearCompra/BloquearCompra";
import GuiasDeCompra from "./pages/compras/guiasDeCompra/GuiasDeCompra";
//*Pages mantenimiento
import Usuarios from "./pages/mantenimiento/usuarios/Usuarios";
import TiposDeCambio from "./pages/mantenimiento/tiposDeCambio/TiposDeCambio";
import Lineas from "./pages/mantenimiento/lineas/Lineas";
import Sublineas from "./pages/mantenimiento/sublineas/Sublineas";
import Marcas from "./pages/mantenimiento/marcas/Marcas";
import UnidadesDeMedida from "./pages/mantenimiento/unidadesDeMedida/UnidadesDeMedida";
import TipoDePago from "./pages/mantenimiento/tipoDePago/TipoDePago";
import Cargos from "./pages/mantenimiento/cargos/Cargos";
import EntidadesBancarias from "./pages/mantenimiento/entidadesBancarias/EntidadesBancarias";
import CuentasCorrientes from "./pages/mantenimiento/cuentasCorrientes/CuentasCorrientes";
import Departamentos from "./pages/mantenimiento/departamentos/Departamentos";
import Provincias from "./pages/mantenimiento/provincias/Provincias";
import Distrito from "./pages/mantenimiento/distritos/Distrito";
import CajaChicaConfiguracion from "./pages/mantenimiento/cajaChicaConfiguracion/CajaChicaConfiguracion";
import Empresa from "./pages/mantenimiento/empresa/Empresa";
import Correlativos from "./pages/mantenimiento/correlativos/Correlativos";
import EmpresaDeTransporte from "./pages/mantenimiento/empresaDeTransporte/EmpresaDeTransporte";
import Vehiculos from "./pages/mantenimiento/vehiculos/Vehiculos";
//*Pages almacen
import MovimientosArticulos from "./pages/almacen/movimientoArticulos/MovimientosArticulos";
import CuadreStock from "./pages/almacen/cuadreStock/CuadreStock";
import EntradaArticulos from "./pages/almacen/entradaArticulos/EntradaArticulos";
import SalidaArticulos from "./pages/almacen/salidaArticulos/SalidaArticulos";
import EntradaCilindros from "./pages/almacen/entradaCilindros/EntradaCilindros";
import SalidaCilindros from "./pages/almacen/salidaCilindros/SalidaCilindros";
//*Pages Finanzas
import BloquearMovimientoBancario from "./pages/finanzas/bloquearMovimientoBancario/BloquearMovimientoBancario";
import MovimientoBancario from "./pages/finanzas/movimientoBancario/MovimientoBancario";
//*Pages personal
import Personal from "./pages/personal/Personal";
//*pages tesoreria
import CajaChica from "./pages/tesoreria/cajaChica/CajaChica";
import CobrosCuentaBancaria from "./pages/tesoreria/cobrosCuentasBancaria/CobrosCuentaBancaria";
import LetrasCambioCobro from "./pages/tesoreria/letrasCambioCobro/LetrasCambioCobro";
import LetrasCambioPago from "./pages/tesoreria/letrasCambioPago/LetrasCambioPago";
import PagosCuentaBnacaria from "./pages/tesoreria/pagosCuentasBancaria/PagosCuentaBnacaria";
import PagosEnEfectivo from "./pages/tesoreria/pagosEnEfectivo/PagosEnEfectivo";
import ReciboDeEgreso from "./pages/tesoreria/reciboDeEgreso/ReciboDeEgreso";
import ReciboDeIngreso from "./pages/tesoreria/reciboDeIngreso/ReciboDeIngreso";
import Retenciones from "./pages/tesoreria/retenciones/Retenciones";
import BloquearReciboEgreso from "./pages/tesoreria/bloquearReciboEgreso/BloquearReciboEgreso";
import Cef from "./pages/compras/cef/Cef";
import Cheque from "./pages/compras/cheque/Cheque";
import Articulo from "./pages/mantenimiento/articulo/Articulo";
import CuentasPorPagar from "./pages/finanzas/cuentasPorPagar/CuentasPorPagar";
//*pages Herramientas
import InformeArticulo from "./pages/informes/articulos/InformeArticulo";
import InformeCompra from "./pages/informes/compras/InformeCompra";
import InformeVenta from "./pages/informes/ventas/InformeVenta";
import InformeTesoreria from "./pages/informes/tesoreria/InformeTesoreria";
//*pages Cobranzas
import CuentaPorCobrar from "./pages/cobranzas/cuentaPorCobrar/CuentaPorCobrar";
import PLanillaCobro from "./pages/cobranzas/planillaCobro/PLanillaCobro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          {/** //!VENTAS */}
          <Route path="/ventas/clientes" element={<Cliente />} />
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
          <Route path="/ventas/bloquear-venta" element={<BloquearVenta />} />

          <Route path="/ventas/retenciones" element={<Retencion />} />
          {/** //!COMPRAS */}
          <Route path="/compras/provedores" element={<Proveedores />} />
          <Route
            path="/compras/documentos-de-compra"
            element={<DocumentosDeCompra />}
          />
          <Route
            path="/compras/letra-cambio-compra"
            element={<LetraCambioCompra />}
          />
          <Route
            path="/compras/ordenes-de-compra"
            element={<OrdenesDeCompra />}
          />
          <Route path="/compras/guias-de-compra" element={<GuiasDeCompra />} />
          <Route path="/compras/cef" element={<Cef />} />
          <Route path="/compras/cheque" element={<Cheque />} />

          <Route path="/compras/bloquear-compra" element={<BloquearCompra />} />
          <Route
            path="/compras/factura-negociable"
            element={<FacturaNegociable />}
          />
          {/** //!MANTENIMIENTO */}
          <Route path="/mantenimiento/usuarios" element={<Usuarios />} />
          <Route
            path="/mantenimiento/correlativos"
            element={<Correlativos />}
          />
          <Route path="/mantenimiento/empresa" element={<Empresa />} />
          <Route path="/mantenimiento/articulos" element={<Articulo />} />
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
          <Route
            path="/mantenimiento/caja-chica-configuracion"
            element={<CajaChicaConfiguracion />}
          />
          <Route
            path="/mantenimiento/empresa-de-transporte"
            element={<EmpresaDeTransporte />}
          />
          <Route path="/mantenimiento/vehiculos" element={<Vehiculos />} />
          {/** //!ALMACEN */}
          <Route
            path="almacen/movimientos-articulos"
            element={<MovimientosArticulos />}
          />
          <Route
            path="almacen/entrada-articulos"
            element={<EntradaArticulos />}
          />
          <Route
            path="almacen/salida-articulos"
            element={<SalidaArticulos />}
          />
          <Route
            path="almacen/entrada-cilindros"
            element={<EntradaCilindros />}
          />
          <Route
            path="almacen/salida-cilindros"
            element={<SalidaCilindros />}
          />
          <Route path="almacen/cuadre-stock" element={<CuadreStock />} />
          {/** //!FINANZAS */}
          <Route
            path="/finanzas/bloquear-movimiento-bancario"
            element={<BloquearMovimientoBancario />}
          />
          <Route
            path="/finanzas/cuentas-por-pagar"
            element={<CuentasPorPagar />}
          />
          <Route
            path="/finanzas/movimiento-bancario"
            element={<MovimientoBancario />}
          />
          {/** //!PERSONAL */}
          <Route path="personal" element={<Personal />} />
          {/** //!COBRANZAS */}
          <Route
            path="cobranzas/cuentas-por-cobrar"
            element={<CuentaPorCobrar />}
          />
           <Route
            path="cobranzas/planilla-cobro"
            element={<PLanillaCobro />}
          />
          {/** //!TESORERIA */}
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
          {/** //!INFORMES */}
          <Route path="/informes/articulos" element={<InformeArticulo />} />
          <Route path="/informes/ventas" element={<InformeVenta />} />
          <Route path="/informes/compras" element={<InformeCompra />} />
          <Route path="/informes/tesoreria" element={<InformeTesoreria />} />
        </Route>

        {/** //!ERROR */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
