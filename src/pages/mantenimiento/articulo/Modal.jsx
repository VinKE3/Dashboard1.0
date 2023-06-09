import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import { Checkbox } from "primereact/checkbox";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoExistencia, setDataTipoExistencia] = useState([]);
  const [dataLinea, setDataLinea] = useState([]);
  const [dataSubLinea, setDataSubLinea] = useState([]);
  const [dataMarca, setDataMarca] = useState([]);
  const [dataUnidadMedida, setDataUnidadMedida] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (
      target.name == "isActivo" ||
      target.name == "controlarStock" ||
      target.name == "visualizarStock" ||
      target.name == "tieneIGV" ||
      target.name == "tienePercepcionCompra"
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
      let model = dataSubLinea.find((map) => map.lineaId == target.value);
      setData((prevData) => ({
        ...prevData,
        subLineaId: model == undefined ? "" : model.subLineaId,
      }));
    }
  };
  //#endregion

  //#region Funciones API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setDataTipoExistencia(result.data.data.tiposExistencia);
    setDataLinea(result.data.data.lineas);
    setDataSubLinea(result.data.data.subLineas);
    setDataMarca(result.data.data.marcas);
    setDataUnidadMedida(result.data.data.unidadesMedida);
    setDataMoneda(result.data.data.monedas);
    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposExistencia = result.data.data.tiposExistencia.find((map) => map);
      let lineas = result.data.data.lineas.find((map) => map);
      let subLineas = result.data.data.subLineas.find(
        (map) => map.lineaId == lineas.id
      );
      let marcas = result.data.data.marcas.find((map) => map);
      let unidadesMedida = result.data.data.unidadesMedida.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoExistenciaId: tiposExistencia.id,
        lineaId: lineas.id,
        subLineaId: subLineas.subLineaId,
        marcaId: marcas.id,
        unidadMedidaId: unidadesMedida.id,
        monedaId: monedas.id,
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
      titulo="Articulo"
      menu={"Mantenimiento/Articulo"}
      cerrar={false}
      foco={document.getElementById("tablaArticulo")}
      tamañoModal={[G.ModalFull, G.Form]}
    >
      <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
        <div className={G.ContenedorInputs}>
          <div className={G.InputMitad}>
            <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
              Tipo de Existencia
            </label>
            <select
              id="tipoExistenciaId"
              name="tipoExistenciaId"
              autoFocus
              disabled={modo == "Consultar"}
              value={data.tipoExistenciaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataTipoExistencia.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputMitad}>
            <label htmlFor="marcaId" className={G.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              disabled={modo == "Consultar"}
              value={data.marcaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataMarca.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.InputMitad}>
            <label htmlFor="lineaId" className={G.LabelStyle}>
              Línea
            </label>
            <select
              id="lineaId"
              name="lineaId"
              value={data.lineaId ?? ""}
              onChange={HandleData}
              disabled={modo != "Nuevo" ? true : ""}
              className={modo != "Nuevo" ? G.InputStyle : G.InputStyle}
            >
              {dataLinea.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputMitad}>
            <label htmlFor="subLineaId" className={G.LabelStyle}>
              SubLínea
            </label>
            <select
              id="subLineaId"
              name="subLineaId"
              value={data.subLineaId ?? ""}
              onChange={HandleData}
              disabled={modo != "Nuevo" ? true : ""}
              className={modo != "Nuevo" ? G.InputStyle : G.InputStyle}
            >
              <option value="">--SELECCIONAR--</option>
              {dataSubLinea
                .filter((model) => model.lineaId == data.lineaId)
                .map((map) => (
                  <option key={map.subLineaId} value={map.subLineaId}>
                    {map.descripcion}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.InputMitad}>
            <label htmlFor="codigoBarras" className={G.LabelStyle}>
              Código de Barras
            </label>
            <input
              type="text"
              id="codigoBarras"
              name="codigoBarras"
              autoComplete="off"
              placeholder="Código de Barras"
              disabled={modo == "Nuevo" ? false : true}
              value={data.codigoBarras}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.InputMitad}>
            <label htmlFor="descripcion" className={G.LabelStyle}>
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              autoComplete="off"
              placeholder="Descripción"
              disabled={modo == "Consultar"}
              value={data.descripcion}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.Input25pct}>
            <label htmlFor="unidadMedidaId" className={G.LabelStyle}>
              U. Medida
            </label>
            <select
              id="unidadMedidaId"
              name="unidadMedidaId"
              disabled={modo == "Consultar"}
              value={data.unidadMedidaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataUnidadMedida.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="peso" className={G.LabelStyle}>
              Peso
            </label>
            <input
              type="number"
              id="peso"
              name="peso"
              placeholder="Peso"
              autoComplete="off"
              min={0}
              disabled={modo == "Consultar"}
              value={data.peso ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="stock" className={G.LabelStyle}>
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              autoComplete="off"
              placeholder="Stock"
              disabled={true}
              value={data.stock ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <div className={G.InputTercio}>
              <div className={G.CheckStyle}>
                <Checkbox
                  inputId="visualizarStock"
                  name="visualizarStock"
                  disabled={modo == "Consultar"}
                  value={data.visualizarStock}
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.visualizarStock ? true : ""}
                ></Checkbox>
              </div>
              <label
                htmlFor="visualizarStock"
                className={G.LabelCheckStyle + " rounded-r-none"}
              >
                Visualizar Stock
              </label>
            </div>
            <div className={G.InputTercio}>
              <div className={G.CheckStyle + " rounded-l-none"}>
                <Checkbox
                  inputId="tieneIGV"
                  name="tieneIGV"
                  disabled={modo == "Consultar"}
                  value={data.tieneIGV}
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.tieneIGV ? true : ""}
                ></Checkbox>
              </div>
              <label
                htmlFor="tieneIGV"
                className={G.LabelCheckStyle + " rounded-r-none"}
              >
                Tiene Igv
              </label>
            </div>
            <div className={G.InputTercio}>
              <div className={G.CheckStyle + " rounded-l-none"}>
                <Checkbox
                  inputId="tienePercepcionCompra"
                  name="tienePercepcionCompra"
                  disabled={modo == "Consultar"}
                  value={data.tienePercepcionCompra}
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.tienePercepcionCompra ? true : ""}
                ></Checkbox>
              </div>
              <label
                htmlFor="tienePercepcionCompra"
                className={G.LabelCheckStyle}
              >
                Precio Compra
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
        <p className={G.Subtitulo}>Precio Venta</p>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              disabled={modo == "Consultar"}
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {dataMoneda.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.Input25pct}>
            <label htmlFor="porcentajeUtilidad1" className={G.LabelStyle}>
              % Gan. 01
            </label>
            <input
              type="number"
              id="porcentajeUtilidad1"
              name="porcentajeUtilidad1"
              autoComplete="off"
              placeholder="% Ganancia"
              min={0}
              disabled={modo == "Consultar"}
              value={data.porcentajeUtilidad1 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="porcentajeUtilidad2" className={G.LabelStyle}>
              % Gan. 02
            </label>
            <input
              type="number"
              id="porcentajeUtilidad2"
              name="porcentajeUtilidad2"
              autoComplete="off"
              placeholder="% Ganancia"
              min={0}
              disabled={modo == "Consultar"}
              value={data.porcentajeUtilidad2 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>

          <div className={G.Input25pct}>
            <label htmlFor="porcentajeUtilidad3" className={G.LabelStyle}>
              % Gan. 03
            </label>
            <input
              type="number"
              id="porcentajeUtilidad3"
              name="porcentajeUtilidad3"
              autoComplete="off"
              placeholder="% Ganancia"
              min={0}
              disabled={modo == "Consultar"}
              value={data.porcentajeUtilidad3 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="porcentajeUtilidad4" className={G.LabelStyle}>
              % Gan. 04
            </label>
            <input
              type="number"
              id="porcentajeUtilidad4"
              name="porcentajeUtilidad4"
              autoComplete="off"
              placeholder="% Ganancia"
              min={0}
              disabled={modo == "Consultar"}
              value={data.porcentajeUtilidad4 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.Input25pct}>
            <label htmlFor="precioVenta1" className={G.LabelStyle}>
              P. Venta 01
            </label>
            <input
              type="number"
              id="precioVenta1"
              name="precioVenta1"
              autoComplete="off"
              placeholder="Precio Venta"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioVenta1 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="precioVenta2" className={G.LabelStyle}>
              P. Venta 02
            </label>
            <input
              type="number"
              id="precioVenta2"
              name="precioVenta2"
              autoComplete="off"
              placeholder="Precio Venta"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioVenta2 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>

          <div className={G.Input25pct}>
            <label htmlFor="precioVenta3" className={G.LabelStyle}>
              P. Venta 03
            </label>
            <input
              type="number"
              id="precioVenta3"
              name="precioVenta3"
              autoComplete="off"
              placeholder="Precio Venta"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioVenta3 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.Input25pct}>
            <label htmlFor="precioVenta4" className={G.LabelStyle}>
              P. Venta 04
            </label>
            <input
              type="number"
              id="precioVenta4"
              name="precioVenta4"
              autoComplete="off"
              placeholder="Precio Venta"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioVenta4 ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
      <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
        <p className={G.Subtitulo}>Equivalencia En otras Unidades</p>
      </div>
      <div className={G.ContenedorBasico + G.FondoContenedor}>
        <div className={G.InputFull}>
          <label htmlFor="observacion" className={G.LabelStyle}>
            Observación
          </label>
          <input
            type="text"
            id="observacion"
            name="observacion"
            autoComplete="off"
            placeholder="Observación"
            disabled={modo == "Consultar"}
            value={data.observacion ?? ""}
            onChange={HandleData}
            className={G.InputStyle}
          />
        </div>
        <div className={G.ContenedorInputs}>
          <div className="w-full justify-center flex ">
            <div className={G.InputMitad}>
              <div className={G.InputMitad}>
                <div className={G.CheckStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    disabled={modo == "Consultar"}
                    value={data.isActivo}
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.isActivo ? true : ""}
                  />
                </div>
                <label
                  htmlFor="isActivo"
                  className={G.LabelCheckStyle + " rounded-r-none"}
                >
                  Activo
                </label>
              </div>
              <div className={G.InputMitad}>
                <div className={G.CheckStyle + " rounded-l-none"}>
                  <Checkbox
                    inputId="controlarStock"
                    name="controlarStock"
                    disabled={modo == "Consultar"}
                    value={data.controlarStock}
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.controlarStock ? true : ""}
                  />
                </div>
                <label
                  htmlFor="controlarStock"
                  className={G.LabelCheckStyle + " rounded-r-lg"}
                >
                  Control De Stock
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
