import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/Tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
//#region Estilos
const TablaStyle = styled.div`
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const TipodeCambio = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    anio: moment().format("YYYY"),
    mes: "",
  });
  const [cadena, setCadena] = useState(
    `&anio=${filtro.anio}&mes=${filtro.mes}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //Modal
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&anio=${filtro.anio}&mes=${filtro.mes}`);
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);

  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (eliminar) {
      Listar(cadena, index + 1);
    }
  }, [eliminar]);

  useEffect(() => {
    if (Object.entries(permisos).length > 0) {
      if (
        !permisos[0] &&
        !permisos[1] &&
        !permisos[2] &&
        !permisos[3] &&
        !permisos[4]
      ) {
        setVisible(false);
      } else {
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("TipoCambio", setPermisos);
  }, []);
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
  const ValidarData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const Filtro = async () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setIndex(0);
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (id, modo = "Nuevo") => {
    setModo(modo);
    if (modo == "Nuevo") {
      setObjeto({
        id: moment().format("YYYY-MM-DD"),
        precioCompra: "0",
        precioVenta: "0",
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
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
            setEliminar={setEliminar}
            permisos={permisos}
            menu={["Mantenimiento", "TipoCambio"]}
            id={row.values.id}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.id, "Modificar")}
          />
        ),
      },
    ],
    [permisos]
  );
  const meses = [
    {
      numero: "",
      nombre: "TODOS",
    },
    {
      numero: 1,
      nombre: "ENERO",
    },
    {
      numero: 2,
      nombre: "FEBRERO",
    },
    {
      numero: 3,
      nombre: "MARZO",
    },
    {
      numero: 4,
      nombre: "ABRIL",
    },
    {
      numero: 5,
      nombre: "MAYO",
    },
    {
      numero: 6,
      nombre: "JUNIO",
    },
    {
      numero: 7,
      nombre: "JULIO",
    },
    {
      numero: 8,
      nombre: "AGOSTO",
    },
    {
      numero: 9,
      nombre: "SETIEMBRE",
    },
    {
      numero: 10,
      nombre: "OCTUBRE",
    },
    {
      numero: 11,
      nombre: "NOVIEMBRE",
    },
    {
      numero: 12,
      nombre: "DICIEMBRE",
    },
  ];

  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Tipo de Cambio</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputsFiltro}>
                <label
                  htmlFor="anio"
                  className={Global.LabelStyle}
                >
                  Año:
                </label>
                <input
                  type="number"
                  name="anio"
                  id="anio"
                  autoFocus
                  min={0}
                  value={filtro.anio}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.InputsFiltro}>
                <label
                  id="mes"
                  className={Global.LabelStyle}
                >
                  Mes:
                </label>
                <select
                  id="mes"
                  name="mes"
                  value={filtro.mes}
                  onChange={ValidarData}
                  className={Global.InputBoton}
                >
                  {meses.map((map) => (
                    <option key={map.numero} value={map.numero}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
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
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={Global.BotonRegistrar}
                botonIcon={faPlus}
                click={() => AccionModal()}
              />
            )}
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
          {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default TipodeCambio;
