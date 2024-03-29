import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Modal from "./Modal";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";

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
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [objeto, setObjeto] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar("", index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar("", index + 1);
    }
  }, [respuestaAlert]);

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
        Listar("", 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setVisible(true);
      setPermisos([true, true, true, true, true]);
      Listar("", 1);
    } else {
      GetPermisos();
    }
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
  const GetPermisos = async () => {
    const result = await GetUsuarioId(
      store.session.get("usuarioId"),
      "TipoCambio"
    );
    setPermisos([
      result.registrar,
      result.modificar,
      result.eliminar,
      result.consultar,
      result.anular,
    ]);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let anio = document.getElementById("anio").value;
    let mes = document.getElementById("mes").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (anio == new Date().getFullYear() && mes == 0) {
      Listar("", boton);
    } else {
      Listar(`&anio=${anio}&mes=${mes}`, boton);
    }
  };
  const FiltradoSelect = (e) => {
    let anio = document.getElementById("anio").value;
    let mes = e.target.value;
    setFiltro(`&anio=${anio}&mes=${mes}`, index + 1);
    if (mes != 0) setIndex(0);
    if (anio == new Date().getFullYear() && mes == 0) {
      Listar("", index);
    } else {
      Listar(`&anio=${anio}&mes=${mes}`, index + 1);
    }
  };
  const FiltradoNumber = (e) => {
    clearTimeout(timer);
    let anio = e.target.value;
    let mes = document.getElementById("mes").value;
    setFiltro(`&anio=${anio}&mes=${mes}`, index + 1);
    if (anio != String(new Date().getFullYear())) setIndex(0);
    const newTimer = setTimeout(() => {
      if (anio == new Date().getFullYear() && mes == 0) {
        Listar("", index);
      } else {
        Listar(`&anio=${anio}&mes=${mes}`, index + 1);
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(0);
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
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Linea"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
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
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Tipo de Cambio</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputsFiltro}>
                <label htmlFor="anio" className={Global.LabelStyle + Global.FiltroStyle}>
                  Año:
                </label>
                <input
                  type="number"
                  name="anio"
                  id="anio"
                  autoFocus
                  defaultValue={new Date().getFullYear()}
                  onChange={FiltradoNumber}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.InputsFiltro}>
                <label id="mes" className={Global.LabelStyle + Global.FiltroStyle}>
                  Mes:
                </label>
                <select
                  id="mes"
                  name="mes"
                  onChange={FiltradoSelect}
                  className={Global.InputBoton}
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
                  className={Global.BotonBuscar + Global.Anidado + Global.BotonPrimary}
                  onClick={FiltradoButton}
                >
                  <FaSearch />
                </button>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Registrar"
                botonClass={Global.BotonRegistrar}
                botonIcon={faPlus}
                click={() => AbrirModal()}
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
