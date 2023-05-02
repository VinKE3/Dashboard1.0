import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import { faPlus, faKey, faGear } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import store from "store2";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const CuadreStock = () => {
  //#region UseState
  const { usuario } = useAuth();
  const [datos, setDatos] = useState([]);
  const [objeto, setObjeto] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [modo, setModo] = useState("Registrar");
  const [modal, setModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setPermisos([true, true, true, true]);
      Listar(filtro, 1);
    } else {
      //Consulta a la Api para traer los permisos
    }
  }, [usuario]);

  useEffect(() => {
    datos;
  }, [datos]);

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
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);

  useEffect(() => {
    Listar(filtro, 1);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };

  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Almacen/CuadreStock/${id}`);
    setObjeto(result.data.data);
  };

  const GetDetalles = async (id) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/GetDetalles?id=${id}`
    );
    setDetalle(result.data.data);
  };

  const GetAbrirCerrar = async (id) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/AbrirCerrar/${id}`
    );
    setObjeto(result.data.data);
  };

  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD")
    ) {
      Listar("", boton);
    } else {
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
    }
  };
  const FiltradoFechaInicio = (e) => {
    clearTimeout(timer);
    let fechaInicio = e.target.value;
    let fechaFin = document.getElementById("fechaFin").value;
    setFiltro(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
    if (
      fechaInicio !=
      moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD")
    )
      setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD")
      ) {
        Listar("", index);
      } else {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoFechaFin = (e) => {
    clearTimeout(timer);
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = e.target.value;
    setFiltro(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
    if (fechaFin != moment(new Date()).format("yyyy-MM-DD")) setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD")
      ) {
        Listar("", index);
      } else {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
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
      setObjeto([]);
      setDetalle([]);
    } else {
      await GetPorId(id);
      await GetDetalles(id);
    }
    setModal(true);
  };

  //#endregion

  //#region Columnas y Selects
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Estado",
      accessor: "estado",
      Cell: ({ value }) => {
        return value ? (
          <div className="">
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="">
            <Checkbox checked={false} />
          </div>
        );
      },
    },
    {
      Header: "Pendiente",
      accessor: "pendiente",
      Cell: ({ value }) => {
        return value ? (
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
        );
      },
    },
    {
      Header: "Fecha Registro",
      accessor: "fechaRegistro",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "N°",
      accessor: "numero",
    },
    {
      Header: "Responsable",
      accessor: "responsableNombreCompleto",
    },
    {
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Total Sobra",
      accessor: "totalSobra",
    },
    {
      Header: "Total Falta",
      accessor: "totalFalta",
    },
    {
      Header: "Saldo Final",
      accessor: "saldoFinal",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "CuadreStock"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <h2 className={Global.TituloH2}>Cuadre de Stock</h2>
        </div>
        {/* Filtro*/}
        <div className={Global.ContenedorFiltro}>
          <div className={Global.InputFull}>
            <label htmlFor="fechaInicio" className={Global.LabelStyle}>
              Tipo
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              onChange={FiltradoFechaInicio}
              defaultValue={moment()
                .subtract(2, "years")
                .startOf("year")
                .format("yyyy-MM-DD")}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="fechaFin" className={Global.LabelStyle}>
              Tipo
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              onChange={FiltradoFechaFin}
              defaultValue={moment(new Date()).format("yyyy-MM-DD")}
              className={Global.InputBoton}
            />
            <button
              id="buscar"
              className={Global.BotonBuscar}
              onClick={FiltradoButton}
            >
              <FaSearch />
            </button>
          </div>
        </div>
        {/* Filtro*/}

        {/* Boton */}
        <div className="flex gap-1">
          {permisos[0] && (
            <BotonBasico
              botonText="Registrar"
              botonClass={Global.BotonRegistrar}
              botonIcon={faPlus}
              click={() => AbrirModal()}
            />
          )}
          {permisos[0] && (
            <BotonBasico
              botonText="Cambiar Contraseña"
              botonClass={Global.BotonCambiarContraseña}
              botonIcon={faKey}
              click={() => AbrirModalClave()}
            />
          )}
        </div>
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
          objeto={objeto}
          detalle={detalle}
        />
      )}

      <ToastContainer />
    </>
  );
  //#endregion
};

export default CuadreStock;
