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

const InformeGerenciaUtilidades = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    checkFiltro: "porDocumento",
  });

  const [monedas, setDataMoneda] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    GetTablas();
  }, []);

  const HandleData = async ({ target }) => {
    if (
      target.value === "porDocumento" ||
      target.value === "porDetalle" ||
      target.value === "porArticulo" ||
      target.value === "porPersonal"
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

  const GetTablas = async  () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setDataMoneda(result.data.data.monedas);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Reporte Utilidades" setModal={setModal}>
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
              onChange={HandleData}
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
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="porDocumento"
                    name="agrupar"
                    value="porDocumento"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porDocumento"}
                  />
                </div>
                <label
                  htmlFor="porDocumento"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Documento
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porDetalle"
                    name="agrupar"
                    value="porDetalle"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porDetalle"}
                  />
                </div>
                <label
                  htmlFor="porDetalle"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Documento Detalle
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porArticulo"
                    name="agrupar"
                    value="porArticulo"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porArticulo"}
                  />
                </div>
                <label
                  htmlFor="porArticulo"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Por Articulo
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porPersonal"
                    name="agrupar"
                    value="porPersonal"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porPersonal"}
                  />
                </div>
                <label
                  htmlFor="porPersonal"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Por Personal
                </label>
              </div>
            </div>
          </div>

          <div className={G.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={G.BotonVerde}
                botonIcon={faPlus}
                click={() => Imprimir()}
contenedor=""
              />
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default InformeGerenciaUtilidades;
