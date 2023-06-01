import React, { useState } from "react";
import ModalBasic from "../../../components/Modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import BotonBasico from "../../../components/Boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const VentaTiendaMarca = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
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

  const ValidarData = async ({ target }) => {
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
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.InputFull}>
            <label htmlFor="tiendaId" className={Global.LabelStyle}>
              Tienda
            </label>
            {/* <select
              id="cargoId"
              name="cargoId"
              autoFocus
              value={data.cargoId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
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
          <div className={Global.InputFull}>
            <label htmlFor="marcaId" className={Global.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              autoFocus
              value={data.marcaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
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
          <div className={Global.ContenedorFiltro + " !my-0"}>
            <div className={Global.InputFull}>
              <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="fechaFin" className={Global.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
            </div>
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="facturas"
                    name="facturas"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.facturas ? true : ""}
                  />
                </div>
                <label htmlFor="facturas" className={Global.InputBoton}>
                  Facturas
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="boletas"
                    name="boletas"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.boletas ? true : ""}
                  />
                </div>
                <label htmlFor="boletas" className={Global.InputBoton}>
                  Boletas
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="guiasRemision"
                    name="guiasRemision"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.guiasRemision ? true : ""}
                  />
                </div>
                <label htmlFor="guiasRemision" className={Global.InputBoton}>
                  Guias Remision
                </label>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={Global.BotonAgregar}
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
