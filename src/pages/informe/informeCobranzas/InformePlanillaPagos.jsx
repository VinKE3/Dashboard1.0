import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const InformePlanillaPagos = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
    checkFiltro: "sinDetalle",
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
      target.value === "sinDetalle" ||
      target.value === "conDetalle" ||
      target.value === "reporte"
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
      <ModalBasic titulo="Informe PLanilla de Pago" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
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
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
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
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="sinDetalle"
                    name="agrupar"
                    value="sinDetalle"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "sinDetalle"}
                  />
                </div>
                <label
                  htmlFor="sinDetalle"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Sin Detalle de Planilla
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="conDetalle"
                    name="agrupar"
                    value="conDetalle"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "conDetalle"}
                  />
                </div>
                <label
                  htmlFor="conDetalle"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Con Detalle de Planilla
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="reporte"
                    name="agrupar"
                    value="reporte"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporte"}
                  />
                </div>
                <label
                  htmlFor="reporte"
                  className={Global.LabelCheckStyle + " !py-1 "}
                >
                  Reporte Mensual
                </label>
              </div>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={Global.BotonAgregar}
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

export default InformePlanillaPagos;
