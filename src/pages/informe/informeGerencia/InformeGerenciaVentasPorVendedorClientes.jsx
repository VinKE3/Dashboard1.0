import { useEffect, useState, useMemo } from "react";
import ModalBasic from "../../../components/Modal/ModalBasic";
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
const InformeGerenciaVentasPorVendedorClientes = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
  });
  const [personal, setPersonal] = useState([]);
  const [dataLocal, setDataLocal] = useState([]);
  const [filtroLocal, setFiltroLocal] = useState({
    cliente: "",
  });

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Personal();
  }, []);

  const ValidarData = async ({ target }) => {
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

  return (
    <ModalBasic
      titulo="Reporte Utilidades"
      tamañoModal={[Global.ModalGrande, Global.Form]}
      setModal={setModal}
    >
      <div
        className={Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
      >
        <div className={Global.ContenedorFiltro + " !my-0"}>
          <div className={Global.Input42pct}>
            <label htmlFor="fechaInicio" className={Global.LabelStyle}>
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              onChange={ValidarData}
              name="fechaInicio"
              value={data.fechaInicio ?? ""}
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
              onChange={ValidarData}
              name="fechaFin"
              value={data.fechaFin ?? ""}
              className={Global.InputBoton}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
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
          <div className={Global.InputFull}>
            <label htmlFor="cliente" className={Global.LabelStyle}>
              Cliente
            </label>
            <input
              type="text"
              id="cliente"
              onChange={ValidarData}
              name="cliente"
              value={filtroLocal.cliente ?? ""}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};

export default InformeGerenciaVentasPorVendedorClientes;
