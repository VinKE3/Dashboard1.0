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

const InformeCilindros = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
    checkFiltro: "reporteSalidaCilindros",
  });

  const [personal, setPersonal] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Personal();
  }, []);

  const ValidarData = async ({ target }) => {
    if (
      target.value === "reporteSalidaCilindros" ||
      target.value === "reporteEntradaCilindros" ||
      target.value === "reporteCilindrosVendidos" ||
      target.value === "reporteCilindrosPendientes" ||
      target.value === "reporteCilindrosSobrantes"
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

  const Personal = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Informe De Cilindros" setModal={setModal}>
        <div
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {personal.map((personal) => (
                <option key={personal.id} value={personal.id}>
                  {personal.personal}
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
                    inputId="reporteSalidaCilindros"
                    name="agrupar"
                    value="reporteSalidaCilindros"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporteSalidaCilindros"}
                  />
                </div>
                <label
                  htmlFor="reporteSalidaCilindros"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Reporte Salida Cilindros
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteEntradaCilindros"
                    name="agrupar"
                    value="reporteEntradaCilindros"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporteEntradaCilindros"}
                  />
                </div>
                <label
                  htmlFor="reporteEntradaCilindros"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Reporte Entrada Cilindros
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteCilindrosVendidos"
                    name="agrupar"
                    value="reporteCilindrosVendidos"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosVendidos"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosVendidos"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Reporte Cilindros Vendidos
                </label>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="reporteCilindrosPendientes"
                    name="agrupar"
                    value="reporteCilindrosPendientes"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosPendientes"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosPendientes"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Reporte Cilindros Pendientes
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="reporteCilindrosSobrantes"
                    name="agrupar"
                    value="reporteCilindrosSobrantes"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "reporteCilindrosSobrantes"}
                  />
                </div>
                <label
                  htmlFor="reporteCilindrosSobrantes"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Reporte Cilindros Sobrantes
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

export default InformeCilindros;
