import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const InformeGerenciaVentasArticulos = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    tipoReporteId: "1",
  });
  const TipoReporte = [
    {
      id: 1,
      nombre: "VENTA POR ARTICULO",
    },
    {
      id: 2,
      nombre: "SALIDA CON GUIAS",
    },
    {
      id: 3,
      nombre: "ARTICULOS MAS VENDIDO",
    },
    {
      id: 4,
      nombre: "SALIDA DE PRODUCCION",
    },
  ];

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Informe Ventas por Articulos" setModal={setModal}>
        <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
          <div className={G.ContenedorFiltro + " !my-0"}>
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
          <div className={G.InputFull}>
            <label htmlFor="tipoReporteId" className={G.LabelStyle}>
              Tipo de Reporte
            </label>
            <select
              id="tipoReporteId"
              name="tipoReporteId"
              autoFocus
              value={data.tipoReporteId ?? ""}
              onChange={ValidarData}
              className={G.InputStyle}
            >
              {TipoReporte.map((reporte) => (
                <option key={reporte.id} value={reporte.id}>
                  {reporte.nombre}
                </option>
              ))}
            </select>
          </div>

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
      </ModalBasic>
    </>
  );
};

export default InformeGerenciaVentasArticulos;
