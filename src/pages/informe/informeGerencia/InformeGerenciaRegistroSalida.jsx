import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import BotonCRUD from "../../../components/Boton/BotonCRUD";
import Table from "../../../components/Tabla/Table";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";

//#region Estilos
const TablaStyle = styled.div`
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
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
    personalId: "",
  });
  const [dataLocal, setDataLocal] = useState([]);
  const [filtroLocal, setFiltroLocal] = useState({
    cliente: "",
  });
  return (
    <div
      className={Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
    >
      <div className={Global.ContenedorFiltro + " !my-0"}>
        <div className={Global.InputFull}>
          <label name="tipoExistenciaId" className={Global.LabelStyle}>
            Tipo de Existencia
          </label>
          <select
            id="tipoExistenciaId"
            name="tipoExistenciaId"
            autoFocus
            value={data.personalId ?? ""}
            onChange={ValidarFiltro}
            className={Global.InputStyle}
          >
            <option key={-1} value={""}>
              {"--TODOS--"}
            </option>
            {tipoDeExistencia.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {" "}
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.Input42pct}>
          <label htmlFor="fechaInicio" className={Global.LabelStyle}>
            Desde
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={filtro.fechaInicio ?? ""}
            onChange={ValidarFiltro}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.Input42pct}>
          <label htmlFor="fechaFin" className={Global.LabelStyle}>
            Hasta
          </label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={filtro.fechaFin ?? ""}
            onChange={ValidarFiltro}
            className={Global.InputBoton}
          />
          <button
            id="buscar"
            className={
              Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
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
