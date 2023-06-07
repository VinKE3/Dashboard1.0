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
//#endregion

const InformeGerenciaVentasPorVendedorMesDia = ({ setModal }) => {
  const [data, setData] = useState({
    añoActual: moment().format("YYYY"),
    mesActual: parseInt(moment().format("MM")).toString(),
  });

  const meses = [
    {
      id: 1,
      nombre: "Enero",
    },
    {
      id: 2,
      nombre: "Febrero",
    },
    {
      id: 3,
      nombre: "Marzo",
    },
    {
      id: 4,
      nombre: "Abril",
    },
    {
      id: 5,
      nombre: "Mayo",
    },
    {
      id: 6,
      nombre: "Junio",
    },
    {
      id: 7,
      nombre: "Julio",
    },
    {
      id: 8,
      nombre: "Agosto",
    },
    {
      id: 9,
      nombre: "Septiembre",
    },
    {
      id: 10,
      nombre: "Octubre",
    },
    {
      id: 11,
      nombre: "Noviembre",
    },
    {
      id: 12,
      nombre: "Diciembre",
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

  return (
    <ModalBasic
      titulo="Lista de Ventas por Vendedor por Mes y Día"
      tamañoModal={[Global.ModalGrande, Global.Form]}
      setModal={setModal}
    >
      <div
        className={Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
      >
        <div className={Global.ContenedorFiltro + " !my-0"}>
          <div className={Global.InputFull}>
            <label htmlFor="añoActual" className={Global.LabelStyle}>
              Año
            </label>
            <input
              type="string"
              id="añoActual"
              onChange={ValidarData}
              name="añoActual"
              value={data.añoActual ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="mesActual" className={Global.LabelStyle}>
              Mes
            </label>
            <select
              name="mesActual"
              id="mesActual"
              onChange={ValidarData}
              value={data.mesActual ?? ""}
              className={Global.InputStyle}
            >
              {meses.map((mes) => (
                <option key={mes.id} value={mes.id}>
                  {mes.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};

export default InformeGerenciaVentasPorVendedorMesDia;
