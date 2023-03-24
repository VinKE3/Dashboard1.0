import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../Components/Global";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 100px;
  }
  & th:nth-child(3) {
    width: 250px;
  }
  & th:nth-child(4) {
    width: 250px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Clientes = () => {
  //#region useState
  const { usuario } = useAuth();
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([true, true, true, true]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (usuario == "AD") {
      setPermisos([true, true, true, true]);
      Listar(filtro, 1);
    } else {
      //Consulta a la Api para traer los permisos
    }
  }, [usuario]);
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
      Listar(filtro, index + 1);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Cliente/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let documento = document.getElementById("documento").value;
    let nombre = document.getElementById("nombre").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (documento == "" && nombre == "") {
      Listar("", boton);
    } else {
      Listar(`&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`, boton);
    }
  };
  const FiltradoDocumento = async (e) => {
    let nombre = document.getElementById("nombre");
    let documento = e.target.value;
    clearTimeout(timer);
    setFiltro(
      `&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`,
      index + 1
    );
    if (documento != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (documento == "" && nombre == "") {
        Listar("", index + 1);
      } else {
        Listar(
          `&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`,
          index + 1
        );
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoNombre = async (e) => {
    let documento = document.getElementById("documento").value;
    let nombre = e.target.value;
    clearTimeout(timer);
    setFiltro(
      `&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`,
      index + 1
    );
    if (nombre != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (documento == "" && nombre == "") {
        Listar("", index + 1);
      } else {
        Listar(
          `&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`,
          index + 1
        );
      }
    }, 200);
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
        id: "000000",
        tipoDocumentoIdentidadId: "1",
        numeroDocumentoIdentidad: "",
        nombre: "",
        telefono: "",
        celular: "",
        correoElectronico: "",
        direccionPrincipal: "",
        departamentoId: "15",
        provinciaId: "01",
        distritoId: "01",
        zonaId: "",
        tipoVentaId: "CO",
        tipoCobroId: "CP",
        maximoCreditoUSD: 0,
        maximoCreditoPEN: 0,
        observacion: "",
        direccionPrincipalId: 0,
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Número Doc",
      accessor: "numeroDocumentoIdentidad",
    },
    {
      Header: "Nombre",
      accessor: "nombre",
    },
    {
      Header: "Dirección",
      accessor: "direccionPrincipal",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Cliente"]}
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
        <h2 className={Global.TituloH2}>Clientes</h2>

        {/* Filtro*/}
        <div className={Global.ContenedorFiltro}>
          <div className={Global.ContenedorInput96}>
            <label htmlFor="documento" className={Global.LabelStyle}>
              N° Documento
            </label>
            <input
              type="text"
              name="documento"
              id="documento"
              autoComplete="off"
              placeholder="Número Documento Identidad"
              onChange={FiltradoDocumento}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.ContenedorInputsFiltro}>
            <label htmlFor="nombre" className={Global.LabelStyle}>
              Nombre:
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              autoFocus
              autoComplete="off"
              placeholder="Nombre"
              onChange={FiltradoNombre}
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
  );
  //#endregion
};

export default Clientes;
