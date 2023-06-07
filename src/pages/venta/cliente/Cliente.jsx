import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { FaUndoAlt } from "react-icons/fa";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as G from "../../../components/Global";
//#region Estilos
const DivTabla = styled.div`
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
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Cliente = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    documento: "",
    nombre: "",
  });
  const [cadena, setCadena] = useState(
    `&numeroDocumentoIdentidad=${filtro.documento}&nombre=${filtro.nombre}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [listar, setListar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&numeroDocumentoIdentidad=${filtro.documento}&nombre=${filtro.nombre}`
    );
  }, [filtro]);
  useEffect(() => {
    if (visible) {
      Filtro();
    }
  }, [cadena]);
  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (listar) {
      setListar(false);
      Listar(cadena, index + 1);
    }
  }, [listar]);
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
    GetPermisos("Cliente", setPermisos);
  }, []);
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
  const HandleData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const Filtro = async () => {
    clearTimeout(timer);
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltroBoton = async () => {
    setFiltro({
      documento: "",
      nombre: "",
    });
    setIndex(0);
    document.getElementById("documento").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, modo = "Nuevo", click = false) => {
    setModo(modo);
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
    } else {
      if (modo == "Nuevo") {
        setObjeto({
          id: "",
          tipoDocumentoIdentidadId: "",
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
          tipoVentaId: "",
          tipoCobroId: "",
          maximoCreditoUSD: 0,
          maximoCreditoPEN: 0,
          observacion: "",
        });
      } else {
        await GetPorId(value);
      }
    }
    setModal(true);
  };
  const ModalKey = async (e) => {
    if (e.key === "n") {
      AccionModal();
    }
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete(["Mantenimiento", "Cliente"], id, setListar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar");
      }
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
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
            setListar={setListar}
            permisos={permisos}
            menu={["Mantenimiento", "Cliente"]}
            id={row.values.id}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.id, "Modificar")}
          />
        ),
      },
    ],
    [permisos]
  );
  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Clientes</h2>

            {/* Filtro*/}
            <div className={G.ContenedorInputsFiltro}>
              <div className={G.Input96}>
                <label htmlFor="documento" className={G.LabelStyle}>
                  N° Documento
                </label>
                <input
                  type="text"
                  name="documento"
                  id="documento"
                  placeholder="Número Documento Identidad"
                  autoComplete="off"
                  autoFocus
                  value={filtro.documento}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>

              <div className={G.InputsFiltro}>
                <label htmlFor="nombre" className={G.LabelStyle}>
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  value={filtro.nombre}
                  onChange={HandleData}
                  className={G.InputBoton}
                />
                <button
                  id="buscar"
                  className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                  onClick={FiltroBoton}
                >
                  <FaUndoAlt />
                </button>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={G.BotonAzul}
                botonIcon={faPlus}
                click={() => AccionModal()}
                contenedor=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaCliente"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", true)}
                KeyDown={(e) => ModalKey(e)}
              />
            </DivTabla>
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

export default Cliente;
