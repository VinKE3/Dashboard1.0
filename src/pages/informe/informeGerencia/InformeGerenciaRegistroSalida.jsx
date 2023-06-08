import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
 
import styled from "styled-components";
 
import * as G from "../../../components/Global";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(6),
  & th:nth-child(7) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: right;
    width: 80px;
  }
  & th:last-child {
    text-align: center;
    width: 80px;
    max-width: 80px;
  }
`;
const InformeGerenciaRegistroSalida = () => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
    personalId: "",
  });
  const [dataLocal, setDataLocal] = useState([]);
  const [filtroLocal, setFiltroLocal] = useState({
    cliente: "",
  });
  return (
    <div
      className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
    >
      <div className={G.ContenedorInputsFiltro + " !my-0"}>
        <div className={G.InputFull}>
          <label name="tipoExistenciaId" className={G.LabelStyle}>
            Tipo de Existencia
          </label>
          <select
            id="tipoExistenciaId"
            name="tipoExistenciaId"
            autoFocus
            value={data.personalId ?? ""}
            onChange={ValidarFiltro}
            className={G.InputStyle}
          >
            <option key={-1} value={""}>
              {"--TODOS--"}
            </option>
            {dataTipoExistencia.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {" "}
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={G.Input42pct}>
          <label htmlFor="fechaInicio" className={G.LabelStyle}>
            Desde
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={filtro.fechaInicio ?? ""}
            onChange={ValidarFiltro}
            className={G.InputStyle}
          />
        </div>
        <div className={G.Input42pct}>
          <label htmlFor="fechaFin" className={G.LabelStyle}>
            Hasta
          </label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={filtro.fechaFin ?? ""}
            onChange={ValidarFiltro}
            className={G.InputBoton}
          />
          <button
            id="buscar"
            className={
              G.BotonBuscar + G.Anidado + G.BotonPrimary
            }
            onClick={Filtro}
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformeGerenciaRegistroSalida;
