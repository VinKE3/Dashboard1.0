import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import { Checkbox } from "primereact/checkbox";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [subLineas, setSubLineas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [monedas, setMonedas] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (
      target.name == "isActivo" ||
      target.name == "precioIncluyeIGV" ||
      target.name == "activarCostoDescuento" ||
      target.name == "controlarStock" ||
      target.name == "actualizarPrecioCompra"
    ) {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }

    if (target.name == "lineaId") {
      setData((prevData) => ({
        ...prevData,
        subLineaId: "",
      }));
    }
  };
  //#endregion

  //#region Funciones API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
    setLineas(result.data.data.lineas);
    setSubLineas(result.data.data.subLineas);
    setMarcas(result.data.data.marcas);
    setUnidadesMedida(result.data.data.unidadesMedida);
    setMonedas(result.data.data.monedas);
  };
  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      titulo="Articulo"
      menu={["Mantenimiento", "Articulo"]}
      cerrar={false}
      tamañoModal={[Global.ModalFull, Global.Form + " !py-0"]}
    >
      <div
        className={Global.ContenedorBasico + " mb-2 " + Global.FondoContenedor}
      >
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputMitad}>
            <label htmlFor="tipoExistenciaId" className={Global.LabelStyle}>
              Tipo de Existencia
            </label>
            <select
              id="tipoExistenciaId"
              name="tipoExistenciaId"
              value={data.tipoExistenciaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {tipoDeExistencia.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputMitad}>
            <label htmlFor="marcaId" className={Global.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              value={data.marcaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {marcas.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputMitad}>
            <label htmlFor="lineaId" className={Global.LabelStyle}>
              Linea
            </label>
            <select
              id="lineaId"
              name="lineaId"
              value={data.lineaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {lineas.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputMitad}>
            <label htmlFor="subLineaId" className={Global.LabelStyle}>
              SubLinea
            </label>
            <select
              id="subLineaId"
              name="subLineaId"
              value={data.subLineaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option value="">--SELECCIONAR--</option>
              {subLineas
                .filter((model) => model.lineaId == data.lineaId)
                .map((map) => (
                  <option key={map.subLineaId} value={map.subLineaId}>
                    {map.descripcion}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputMitad}>
            <label htmlFor="codigoBarras" className={Global.LabelStyle}>
              Cod. Barras
            </label>
            <input
              type="text"
              id="codigoBarras"
              name="codigoBarras"
              autoComplete="off"
              placeholder="Código de Barras"
              readOnly={modo == "Registrar" ? false : true}
              value={data.codigoBarras}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="descripcion" className={Global.LabelStyle}>
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              autoComplete="off"
              placeholder="Descripción"
              readOnly={modo == "Registrar" ? false : true}
              value={data.descripcion}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input25pct}>
            <label htmlFor="unidadMedidaId" className={Global.LabelStyle}>
              U. Medida
            </label>
            <select
              id="unidadMedidaId"
              name="unidadMedidaId"
              readOnly={modo == "Consultar" ? true : false}
              value={data.unidadMedidaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {unidadesMedida.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="peso" className={Global.LabelStyle}>
              Peso
            </label>
            <input
              type="number"
              id="peso"
              name="peso"
              autoComplete="off"
              placeholder="Peso"
              readOnly={modo == "Consultar" ? true : false}
              value={data.peso ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="stock" className={Global.LabelStyle}>
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              autoComplete="off"
              placeholder="Stock"
              readOnly={modo == "Consultar" ? true : false}
              value={data.stock ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="stockMinimo" className={Global.LabelStyle}>
              Stock Min
            </label>
            <input
              type="number"
              id="stockMinimo"
              name="stockMinimo"
              autoComplete="off"
              placeholder="Stock Mínimo"
              readOnly={modo == "Consultar" ? true : false}
              value={data.stockMinimo ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      <div
        className={Global.ContenedorBasico + " mb-3 " + Global.FondoContenedor}
      >
        <p className={"my-0 py-0 font-bold text-base text-light"}>
          Precio Compra
        </p>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input36}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="precioIncluyeIGV"
                name="precioIncluyeIGV"
                readOnly={modo == "Consultar" ? true : false}
                value={data.precioIncluyeIGV}
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.precioIncluyeIGV ? true : ""}
              ></Checkbox>
            </div>
            <label htmlFor="precioIncluyeIGV" className={Global.InputStyle}>
              Incluye IGV
            </label>
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="precioCompra" className={Global.LabelStyle}>
              Costo del Producto
            </label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              placeholder="Costo del Producto"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioCompra ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input20pct}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="activarCostoDescuento"
                name="activarCostoDescuento"
                readOnly={modo == "Consultar" ? true : false}
                value={data.activarCostoDescuento}
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.activarCostoDescuento ? true : ""}
              ></Checkbox>
            </div>
            <label
              htmlFor="activarCostoDescuento"
              className={Global.InputStyle}
            >
              Costo Descuento
            </label>
          </div>
          <div className={Global.Input25pct}>
            <label
              htmlFor="precioCompraDescuento"
              className={Global.LabelStyle}
            >
              Costo con Descto.
            </label>
            <input
              type="number"
              id="precioCompraDescuento"
              name="precioCompraDescuento"
              placeholder="Costo con Descto"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioCompraDescuento ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      <div
        className={Global.ContenedorBasico + " mb-2 " + Global.FondoContenedor}
      >
        <p className={"my-0 py-0 font-bold text-base text-light"}>
          Precio Venta
        </p>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              disabled={modo == "Consultar" ? true : false}
              value={data.monedaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {monedas.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input25pct}>
            <label htmlFor="porcentajeUtilidad1" className={Global.LabelStyle}>
              % Gan. 01
            </label>
            <input
              type="number"
              id="porcentajeUtilidad1"
              name="porcentajeUtilidad1"
              autoComplete="off"
              placeholder="% Ganancia"
              readOnly={modo == "Consultar" ? true : false}
              value={data.porcentajeUtilidad1 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="porcentajeUtilidad2" className={Global.LabelStyle}>
              % Gan. 02
            </label>
            <input
              type="number"
              id="porcentajeUtilidad2"
              name="porcentajeUtilidad2"
              autoComplete="off"
              placeholder="% Ganancia"
              readOnly={modo == "Consultar" ? true : false}
              value={data.porcentajeUtilidad2 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.Input25pct}>
            <label htmlFor="porcentajeUtilidad3" className={Global.LabelStyle}>
              % Gan. 03
            </label>
            <input
              type="number"
              id="porcentajeUtilidad3"
              name="porcentajeUtilidad3"
              autoComplete="off"
              placeholder="% Ganancia"
              readOnly={modo == "Consultar" ? true : false}
              value={data.porcentajeUtilidad3 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="porcentajeUtilidad4" className={Global.LabelStyle}>
              % Gan. 04
            </label>
            <input
              type="number"
              id="porcentajeUtilidad4"
              name="porcentajeUtilidad4"
              autoComplete="off"
              placeholder="% Ganancia"
              readOnly={modo == "Consultar" ? true : false}
              value={data.porcentajeUtilidad4 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input25pct}>
            <label htmlFor="precioVenta1" className={Global.LabelStyle}>
              P. Venta 01
            </label>
            <input
              type="number"
              id="precioVenta1"
              name="precioVenta1"
              autoComplete="off"
              placeholder="Precio Venta"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioVenta1 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="precioVenta2" className={Global.LabelStyle}>
              P. Venta 02
            </label>
            <input
              type="number"
              id="precioVenta2"
              name="precioVenta2"
              autoComplete="off"
              placeholder="Precio Venta"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioVenta2 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.Input25pct}>
            <label htmlFor="precioVenta3" className={Global.LabelStyle}>
              P. Venta 03
            </label>
            <input
              type="number"
              id="precioVenta3"
              name="precioVenta3"
              autoComplete="off"
              placeholder="Precio Venta"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioVenta3 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input25pct}>
            <label htmlFor="precioVenta4" className={Global.LabelStyle}>
              P. Venta 04
            </label>
            <input
              type="number"
              id="precioVenta4"
              name="precioVenta4"
              autoComplete="off"
              placeholder="Precio Venta"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioVenta4 ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorBasico + Global.FondoContenedor}>
        <div className={Global.InputFull}>
          <label htmlFor="observacion" className={Global.LabelStyle}>
            Observacion
          </label>
          <input
            type="text"
            id="observacion"
            name="observacion"
            autoComplete="off"
            placeholder="Observacion"
            readOnly={modo == "Consultar" ? false : true}
            value={data.observacion ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="isActivo"
                name="isActivo"
                readOnly={modo == "Consultar" ? true : false}
                value={data.isActivo}
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.isActivo ? true : ""}
              ></Checkbox>
            </div>
            <label htmlFor="isActivo" className={Global.InputStyle}>
              Activo
            </label>
          </div>
          <div className={Global.InputFull}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="controlarStock"
                name="controlarStock"
                readOnly={modo == "Consultar" ? true : false}
                value={data.controlarStock}
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.controlarStock ? true : ""}
              ></Checkbox>
            </div>
            <label htmlFor="controlarStock" className={Global.InputStyle}>
              Control De Stock
            </label>
          </div>
          <div className={Global.InputFull}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="actualizarPrecioCompra"
                name="actualizarPrecioCompra"
                readOnly={modo == "Consultar" ? true : false}
                value={data.actualizarPrecioCompra}
                onChange={(e) => {
                  ValidarData(e);
                }}
                checked={data.actualizarPrecioCompra ? true : ""}
              ></Checkbox>
            </div>
            <label
              htmlFor="actualizarPrecioCompra"
              className={Global.InputStyle}
            >
              Actualizar Precio
            </label>
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
