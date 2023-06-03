import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const VentaTiendaMarca = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    marcaId: "",
    tiendaId: "",
    boletas: true,
    facturas: true,
    guiasRemision: true,
  });
  const [marcas, setMarcas] = useState([]);
  const [moneda, setMoneda] = useState([]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Marcas();
    Monedas();
  }, []);

  const HandleData = async ({ target }) => {
    if (
      target.name === "facturas" ||
      target.name === "boletas" ||
      target.name === "guiasRemision"
    ) {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const Marcas = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Marca/Listar`);
    setMarcas(result.data.data.data);
  };

  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Ventas por Tienda y Marca" setModal={setModal}>
        <div
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="tiendaId" className={G.LabelStyle}>
              Tienda
            </label>
            {/* <select
              id="cargoId"
              name="cargoId"
              autoFocus
              value={data.cargoId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.descripcion}
                </option>
              ))}
            </select> */}
          </div>
          <div className={G.InputFull}>
            <label htmlFor="marcaId" className={G.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              autoFocus
              value={data.marcaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputsFiltro + " !my-0"}>
            <div className={G.InputFull}>
              <label htmlFor="fechaInicio" className={G.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputFull}>
              <label htmlFor="fechaFin" className={G.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={HandleData}
                className={G.InputBoton}
              />
            </div>
          </div>

          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="facturas"
                    name="facturas"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.facturas ? true : ""}
                  />
                </div>
                <label htmlFor="facturas" className={G.InputBoton}>
                  Facturas
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="boletas"
                    name="boletas"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.boletas ? true : ""}
                  />
                </div>
                <label htmlFor="boletas" className={G.InputBoton}>
                  Boletas
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="guiasRemision"
                    name="guiasRemision"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.guiasRemision ? true : ""}
                  />
                </div>
                <label htmlFor="guiasRemision" className={G.InputBoton}>
                  Guias Remision
                </label>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonAgregar}
              botonIcon={faPlus}
              click={() => Imprimir()}
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default VentaTiendaMarca;
