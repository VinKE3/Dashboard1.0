import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const InformeCobranzas = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    checkFiltro: "todos",
    monedaId: "",
  });

  const [monedas, setMonedas] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
    if (
      target.value === "cancelados" ||
      target.value === "pendientes" ||
      target.value === "todos"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMonedas(result.data.data.monedas);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Informe Cobranzas" setModal={setModal}>
        <div
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={ValidarData}
              className={G.InputStyle}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
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
                onChange={ValidarData}
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
                onChange={ValidarData}
                className={G.InputBoton}
              />
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="cancelados"
                    name="agrupar"
                    value="cancelados"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "cancelados"}
                  />
                </div>
                <label
                  htmlFor="cancelados"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Cancelados
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="pendientes"
                    name="agrupar"
                    value="pendientes"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "pendientes"}
                  />
                </div>
                <label
                  htmlFor="pendientes"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Pendientes
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="todos"
                    name="agrupar"
                    value="todos"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "todos"}
                  />
                </div>
                <label
                  htmlFor="todos"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Todos
                </label>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={G.BotonAgregar}
                botonIcon={faPlus}
                click={() => Imprimir()}
              />
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default InformeCobranzas;
