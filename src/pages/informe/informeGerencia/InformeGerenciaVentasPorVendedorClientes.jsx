import { useEffect, useState, useMemo } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
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
//#endregion
const InformeGerenciaVentasPorVendedorClientes = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    marcaId: "",
  });
  const [personal, setDataPersonal] = useState([]);
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

  const Personal = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
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
      tamañoModal={[G.ModalGrande, G.Form]}
      setModal={setModal}
    >
      <div className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}>
        <div className={G.ContenedorInputsFiltro + " !my-0"}>
          <div className={G.Input42pct}>
            <label htmlFor="fechaInicio" className={G.LabelStyle}>
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              onChange={HandleData}
              name="fechaInicio"
              value={data.fechaInicio ?? ""}
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
              onChange={HandleData}
              name="fechaFin"
              value={data.fechaFin ?? ""}
              className={G.InputBoton}
            />
          </div>
          <div className={G.InputFull}>
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="marcaId"
              name="marcaId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {personal.map((res, index) => (
                <option key={index} value={res.id}>
                  {res.personal}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="cliente" className={G.LabelStyle}>
              Cliente
            </label>
            <input
              type="text"
              id="cliente"
              onChange={HandleData}
              name="cliente"
              value={filtroLocal.cliente ?? ""}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};

export default InformeGerenciaVentasPorVendedorClientes;
