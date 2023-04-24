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
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";
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
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Proveedores = () => {
  //#region useState
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [objeto, setObjeto] = useState([]);
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
      `api/Mantenimiento/Proveedor/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const result = await GetUsuarioId(
      store.session.get("usuarioId"),
      "CuentaCorriente"
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
        condicion: "",
        estado: "",
        obsevacion: "",
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
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Proveedor"]}
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
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Proveedores</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="documento" className={Global.LabelStyle + Global.FiltroStyle}>
                  N° Documento
                </label>
                <input
                  type="text"
                  name="documento"
                  id="documento"
                  autoFocus
                  autoComplete="off"
                  placeholder="Número Documento Identidad"
                  onChange={FiltradoDocumento}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.ContenedorInputsFiltro}>
                <label htmlFor="nombre" className={Global.LabelStyle + Global.FiltroStyle}>
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
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
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default Proveedores;
