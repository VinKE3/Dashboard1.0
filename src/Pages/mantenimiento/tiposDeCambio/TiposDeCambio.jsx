import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment/moment";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//#region Estilos
const TablaStyle = styled.div`
  & th {
    text-align: left;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const TipodeCambio = () => {
  //#region UseState
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(1);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [botones, setBotones] = useState([true, true, true]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaModal, setRespuestaModal] = useState(false);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    filtro;
  }, [filtro]);
  useEffect(() => {
    total;
  }, [total]);
  useEffect(() => {
    index;
  }, [index]);

  useEffect(() => {
    modo;
  }, [modo]);
  useEffect(() => {
    if (!modal) {
      Listar(filtro, index);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index);
    }
  }, [respuestaAlert]);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/TipoCambio/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let anio = document.getElementById("anio").value;
    let mes = document.getElementById("mes").value;
    let boton = e.selected + 1;
    setIndex(e.selected + 1);
    if (anio == new Date().getFullYear() && mes == 0) {
      Listar("", boton);
    } else {
      Listar(`&anio=${anio}&mes=${mes}`, boton);
    }
  };
  const FiltradoSelect = (e) => {
    let anio = document.getElementById("anio").value;
    let mes = e.target.value;
    setFiltro(`&anio=${anio}&mes=${mes}`, index);
    if (mes != 0) setIndex(1);
    if (anio == new Date().getFullYear() && mes == 0) {
      Listar("", index);
    } else {
      Listar(`&anio=${anio}&mes=${mes}`, index);
    }
  };
  const FiltradoNumber = (e) => {
    clearTimeout(timer);
    let anio = e.target.value;
    let mes = document.getElementById("mes").value;
    setFiltro(`&anio=${anio}&mes=${mes}`, index);
    if (anio != String(new Date().getFullYear())) setIndex(1);
    const newTimer = setTimeout(() => {
      if (anio == new Date().getFullYear() && mes == 0) {
        Listar("", index);
      } else {
        Listar(`&anio=${anio}&mes=${mes}`, index);
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(1);
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let tipoCambio = {
        id: moment().format("YYYY-MM-DD"),
        precioCompra: "0",
        precioVenta: "0",
      };
      setObjeto(tipoCambio);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas y Selects
  const columnas = [
    {
      Header: "Fecha",
      accessor: "id",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Precio Compra",
      accessor: "precioCompra",
    },
    {
      Header: "Precio Venta",
      accessor: "precioVenta",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          id={row.values.id}
          mostrar={botones}
          Click1={() => AbrirModal(row.values.id, "Consultar")}
          Click2={() => AbrirModal(row.values.id, "Modificar")}
          menu={"TipoCambio"}
          setRespuestaAlert={setRespuestaAlert}
        />
      ),
    },
  ];
  const Meses = [
    {
      Numero: "",
      Nombre: "TODOS",
    },
    {
      Numero: 1,
      Nombre: "ENERO",
    },
    {
      Numero: 2,
      Nombre: "FEBRERO",
    },
    {
      Numero: 3,
      Nombre: "MARZO",
    },
    {
      Numero: 4,
      Nombre: "ABRIL",
    },
    {
      Numero: 5,
      Nombre: "MAYO",
    },
    {
      Numero: 6,
      Nombre: "JUNIO",
    },
    {
      Numero: 7,
      Nombre: "JULIO",
    },
    {
      Numero: 8,
      Nombre: "AGOSTO",
    },
    {
      Numero: 9,
      Nombre: "SETIEMBRE",
    },
    {
      Numero: 10,
      Nombre: "OCTUBRE",
    },
    {
      Numero: 11,
      Nombre: "NOVIEMBRE",
    },
    {
      Numero: 12,
      Nombre: "DICIEMBRE",
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className="mb-4 py-2 text-xl font-bold">Tipo de Cambio</h2>

        {/* Filtro*/}
        <div className="flex flex-col sm:flex-row sm:justify-between mt-2 mb-2 py-1 sm:py-0 rounded-1 border-gray-200 overflow-hidden text-sm">
          <div className="w:1 sm:w-1/3 flex flex-1 my-1 sm:my-0 sm:mr-3 rounded-1 overflow-hidden">
            <label
              htmlFor="anio"
              className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
            >
              Año:
            </label>
            <input
              type="number"
              name="anio"
              id="anio"
              className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              defaultValue={new Date().getFullYear()}
              onChange={FiltradoNumber}
              autoFocus
            />
          </div>

          <div className="w:1 sm:w-1/3 flex flex-1 my-1 sm:my-0 rounded-1 overflow-hidden">
            <label
              id="mes-form"
              className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
            >
              Mes:
            </label>
            <select
              id="mes"
              name="mes"
              className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={FiltradoSelect}
            >
              {Meses.map((meses) => (
                <option key={meses.Numero} value={meses.Numero}>
                  {" "}
                  {meses.Nombre}
                </option>
              ))}
            </select>
            <button
              id="buscar"
              className="px-3 rounded-none rounded-r-lg bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={FiltradoButton}
            >
              <FaSearch />
            </button>
          </div>
        </div>
        {/* Filtro*/}

        {/* Boton */}
        <BotonBasico
          botonText="Registrar"
          botonClass="boton-crud-registrar"
          botonIcon={faPlus}
          click={() => AbrirModal()}
        />
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table
            columnas={columnas}
            datos={datos}
            total={total}
            index={index}
            Click={(e) => FiltradoPaginado(e)}
          />
        </TablaStyle>
        {/* Tabla */}
      </div>
      {modal && (
        <Modal
          setModal={setModal}
          modo={modo}
          setRespuestaModal={setRespuestaModal}
          objeto={objeto}
        />
      )}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default TipodeCambio;
