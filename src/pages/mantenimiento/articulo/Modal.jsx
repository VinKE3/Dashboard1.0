import React, { useState, useEffect } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { Fieldset } from "primereact/fieldset";
import ApiMasy from "../../../api/ApiMasy";
import { Checkbox } from "primereact/checkbox";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [subLineasFiltradas, setSubLineasFiltradas] = useState([]);
  const [data, setData] = useState(objeto);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [subLineas, setSubLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [checked, setChecked] = useState(true);
  const [checkedIgv, setCheckedIgv] = useState(true);
  const [checkedDescuento, setCheckedDescuento] = useState(true);
  const [checkedStock, setCheckedStock] = useState(true);
  const [checkedCompra, setCheckedCompra] = useState(true);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
  }, [data]);

  useEffect(() => {
    checked;
    checkedIgv;
    checkedDescuento;
    checkedStock;
    checkedCompra;
  }, [checked, checkedDescuento, checkedIgv, checkedStock, checkedCompra]);

  useEffect(() => {
    const dataObjects = [tipoDeExistencia, marcas, unidadesMedida, monedas];
    const elementIds = [
      "tipoDeExistenciaId",
      "marcaId",
      "unidadMedidaId",
      "monedaId",
    ];
    dataObjects.forEach((obj, index) => {
      if (Object.entries(obj).length > 0) {
        const element = document.getElementById(elementIds[index]);
        if (element) {
          element.value = data[elementIds[index]];
        }
      }
    });
  }, [tipoDeExistencia, marcas, unidadesMedida, monedas, data]);

  useEffect(() => {
    if (lineas.length > 0 && !selectedLinea) {
      setSelectedLinea(lineas[0]);
      const subLineasFiltradas = subLineas.filter(
        (sublinea) => sublinea.lineaId === lineas[0].id
      );
      setSubLineasFiltradas(subLineasFiltradas);
    }
  }, [lineas, selectedLinea]);

  useEffect(() => {
    if (data && data.lineaId) {
      const selected = lineas.find((linea) => linea.id === data.lineaId);
      setSelectedLinea(selected);
      const subLineasFiltradas = subLineas.filter(
        (sublinea) => sublinea.lineaId === data.lineaId
      );
      setSubLineasFiltradas(subLineasFiltradas);
    }
  }, [data, lineas, subLineas]);

  useEffect(() => {
    subLineasFiltradas;
    if (subLineasFiltradas.length > 0) {
      document.getElementById("subLineaId").value = data.subLineaId;
      // document.getElementById("subLineaId").selectedIndex = 1;
    }
  }, [subLineasFiltradas]);

  useEffect(() => {
    lineas;
    if (Object.entries(lineas).length > 0) {
      document.getElementById("lineaId").value = data.lineaId;
      const subLineasFiltradas = subLineas.filter(
        (sublinea) => sublinea.lineaId === data.lineaId
      );
      setSubLineasFiltradas(subLineasFiltradas);
    }
  }, [lineas]);

  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones

  const GetTablas = async () => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "lineaId") {
      const subLineasFiltradas = subLineas.filter(
        (sublinea) => sublinea.lineaId === value
      );
      setSubLineasFiltradas(subLineasFiltradas);
      document.getElementById("subLineaId").selectedIndex = 0;
    }
    setData({ ...data, [name]: value });
  };

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
  };

  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Articulo"]}
      tamañoModal={[Global.ModalGrande, Global.Form]}
      titulo="Articulo"
    >
      <div className="gap-3 grid">
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="tipoExistenciaId" className={Global.LabelStyle}>
                Tipo de Existencia
              </label>
              <select
                id="tipoExistenciaId"
                name="tipoExistenciaId"
                onChange={handleInputChange}
                className={Global.InputStyle}
                disabled={modo === "Consultar" ? true : false}
                value={data.tipoExistenciaId}
              >
                <option value="-1">--Seleccionar Tipo--</option>
                {tipoDeExistencia.map((existencia) => (
                  <option key={existencia.id} value={existencia.id}>
                    {existencia.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="marcaId" className={Global.LabelStyle}>
                Marca
              </label>
              <select
                id="marcaId"
                name="marcaId"
                onChange={handleInputChange}
                className={Global.InputStyle}
                disabled={modo === "Consultar" ? true : false}
                value={data.marcaId}
              >
                <option value="-1">--Seleccionar Marca--</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="lineaId" className={Global.LabelStyle}>
                  Linea
                </label>
                <select
                  id="lineaId"
                  name="lineaId"
                  onChange={handleInputChange}
                  className={Global.InputStyle}
                  disabled={modo === "Consultar" ? true : false}
                  value={data.lineaId}
                >
                  <option value="-1">--Seleccione Línea--</option>
                  {lineas.map((linea) => (
                    <option key={linea.id} value={linea.id}>
                      {linea.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="subLineaId" className={Global.LabelStyle}>
                  SubLinea
                </label>
                <select
                  id="subLineaId"
                  name="subLineaId"
                  onChange={handleInputChange}
                  className={Global.InputStyle}
                  disabled={modo === "Consultar" ? true : false}
                >
                  <option value="-1">--Seleccione SubLinea--</option>
                  {subLineasFiltradas.map((sublinea) => (
                    <option
                      key={sublinea.subLineaId}
                      value={sublinea.subLineaId}
                    >
                      {sublinea.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="codigoBarras" className={Global.LabelStyle}>
                  Codigo De Barras
                </label>
                <input
                  type="text"
                  id="codigoBarras"
                  name="codigoBarras"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
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
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.descripcion}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="unidadMedidaId" className={Global.LabelStyle}>
                  Unidad de Medida
                </label>
                <select
                  id="unidadMedidaId"
                  name="unidadMedidaId"
                  onChange={handleInputChange}
                  disabled={modo === "Consultar" ? true : false}
                  className={Global.InputStyle}
                  value={data.unidadMedidaId}
                >
                  <option value="-1">--Seleccione Unidad de Medida--</option>
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="peso" className={Global.LabelStyle}>
                  Peso
                </label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.peso}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="stock" className={Global.LabelStyle}>
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={true}
                  value={data.stock}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="stockMinimo" className={Global.LabelStyle}>
                  Stock Minimo
                </label>
                <input
                  type="number"
                  id="stockMinimo"
                  name="stockMinimo"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.stockMinimo}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <Checkbox
                  inputId="precioIncluyeIGV"
                  name="precioIncluyeIGV"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.precioIncluyeIGV}
                  onChange={(e) => {
                    setCheckedIgv(e.checked);
                    ValidarData(e);
                  }}
                  checked={data.precioIncluyeIGV ? checkedIgv : ""}
                ></Checkbox>
              </div>
              <label htmlFor="precioIncluyeIGV" className={Global.InputStyle}>
                Precio Incluye IGV
              </label>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="precioCompra" className={Global.LabelStyle}>
                Costo de Producto
              </label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                placeholder="00"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.precioCompra}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="activarCostoDescuento"
                    name="activarCostoDescuento"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.activarCostoDescuento}
                    onChange={(e) => {
                      setCheckedDescuento(e.checked);
                      ValidarData(e);
                    }}
                    checked={data.activarCostoDescuento ? checkedDescuento : ""}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="activarCostoDescuento"
                  className={Global.InputStyle}
                >
                  Activar Costo Descuento
                </label>
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="precioCompraDescuento"
                  className={Global.LabelStyle}
                >
                  Costo Con Descuento
                </label>
                <input
                  type="number"
                  id="precioCompraDescuento"
                  name="precioCompraDescuento"
                  placeholder="00"
                  autoComplete="off"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.precioCompraDescuento}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label htmlFor="monedaId" className={Global.LabelStyle}>
                Moneda
              </label>
              <select
                id="monedaId"
                name="monedaId"
                onChange={handleInputChange}
                disabled={modo === "Consultar" ? true : false}
                className={Global.InputStyle}
                value={data.monedaId}
              >
                <option value="-1">--Seleccione Moneda--</option>
                {monedas.map((moneda) => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label
                  htmlFor="porcentajeUtilidad1"
                  className={Global.LabelStyle}
                >
                  % Gan. 01
                </label>
                <input
                  type="number"
                  id="porcentajeUtilidad1"
                  name="porcentajeUtilidad1"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.porcentajeUtilidad1}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="porcentajeUtilidad2"
                  className={Global.LabelStyle}
                >
                  % Gan. 02
                </label>
                <input
                  type="number"
                  id="porcentajeUtilidad2"
                  name="porcentajeUtilidad2"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.porcentajeUtilidad2}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.InputFull}>
                <label
                  htmlFor="porcentajeUtilidad3"
                  className={Global.LabelStyle}
                >
                  % Gan. 03
                </label>
                <input
                  type="number"
                  id="porcentajeUtilidad3"
                  name="porcentajeUtilidad3"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.porcentajeUtilidad3}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="porcentajeUtilidad4"
                  className={Global.LabelStyle}
                >
                  % Gan. 04
                </label>
                <input
                  type="number"
                  id="porcentajeUtilidad4"
                  name="porcentajeUtilidad4"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.porcentajeUtilidad4}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="precioVenta1" className={Global.LabelStyle}>
                  P.Venta 01
                </label>
                <input
                  type="number"
                  id="precioVenta1"
                  name="precioVenta1"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.precioVenta1}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="precioVenta2" className={Global.LabelStyle}>
                  P.Venta 02
                </label>
                <input
                  type="number"
                  id="precioVenta2"
                  name="precioVenta2"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? false : true}
                  value={data.precioVenta2}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.InputFull}>
                <label htmlFor="precioVenta3" className={Global.LabelStyle}>
                  P.Venta 03
                </label>
                <input
                  type="number"
                  id="precioVenta3"
                  name="precioVenta3"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? false : true}
                  value={data.precioVenta3}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="precioVenta4" className={Global.LabelStyle}>
                  P.Venta 04
                </label>
                <input
                  type="number"
                  id="precioVenta4"
                  name="precioVenta4"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={modo == "Consultar" ? false : true}
                  value={data.precioVenta4}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
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
              readOnly={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className="pt-3">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.isActivo}
                    onChange={(e) => {
                      setChecked(e.checked);
                      ValidarData(e);
                    }}
                    checked={data.isActivo ? checked : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="precioIncluyeIGV" className={Global.InputStyle}>
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
                      setCheckedStock(e.checked);
                      ValidarData(e);
                    }}
                    checked={data.controlarStock ? checkedStock : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="precioIncluyeIGV" className={Global.InputStyle}>
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
                      setCheckedCompra(e.checked);
                      ValidarData(e);
                    }}
                    checked={data.actualizarPrecioCompra ? checkedCompra : ""}
                  ></Checkbox>
                </div>
                <label htmlFor="precioIncluyeIGV" className={Global.InputStyle}>
                  Actualizar Precio
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
