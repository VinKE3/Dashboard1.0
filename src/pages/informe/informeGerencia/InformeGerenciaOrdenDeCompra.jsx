import { useEffect, useState, useMemo } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../../../components/Global";
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
//#endregion

const InformeGerenciaOrdenDeCompra = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    MarcaId: "",
  });
  const [dataMarca, setDataMarca] = useState([]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    GetTablas();
  }, []);

  const HandleData = async ({ target }) => {
    if (
      target.value === "agruparMarca" ||
      target.value === "agruparLinea" ||
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

  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    const res = await ApiMasy.get(`api/Mantenimiento/Marca/Listar`);

    setDataMarca(res.data.data.data);
  };

  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Enviar = async (origen = 1) => {
    let model = await Reporte(`Informes/Sistema/ReporteClientes`, origen);
    if (model != null) {
      const enlace = document.createElement("a");
      enlace.href = model.url;
      enlace.download = model.fileName;
      enlace.click();
      enlace.remove();
    }
  };

  return (
    <ModalBasic
      titulo="Lista de Movimientos por Marca y Articulo"
      tamañoModal={[G.ModalPequeño, G.Form]}
      setModal={setModal}
      childrenFooter={
        <>
          <button
            type="button"
            onClick={() => Enviar(1)}
            className={G.BotonModalBase + G.BotonRojo}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => Enviar(2)}
            className={G.BotonModalBase + G.BotonVerde}
          >
            EXCEL
          </button>
          <button
            type="button"
            onClick={() => setModal(false)}
            className={G.BotonModalBase + G.BotonCerrarModal}
          >
            CERRAR
          </button>
        </>
      }
    >
      <div className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}>
        <div className={G.ContenedorFiltro + " !my-0"}>
          <div className={G.Input42pct}>
            <label htmlFor="fechaInicio" className={G.LabelStyle}>
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              onChange={ValidarData}
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
              onChange={ValidarData}
              name="fechaFin"
              value={data.fechaFin ?? ""}
              className={G.InputBoton}
            />
          </div>
        </div>
      </div>
      <div className={G.InputFull}>
        <label htmlFor="marcaId" className={G.LabelStyle}>
          Marca
        </label>
        <select
          id="marcaId"
          name="marcaId"
          value={data.MarcaId ?? ""}
          onChange={HandleData}
          className={G.InputStyle}
        >
          <option key={-1} value={""}>
            {"--TODOS--"}
          </option>
          {dataMarca.map((map) => (
            <option key={map.id} value={map.id}>
              {map.nombre}
            </option>
          ))}
        </select>
      </div>
    </ModalBasic>
  );
};

export default InformeGerenciaOrdenDeCompra;
