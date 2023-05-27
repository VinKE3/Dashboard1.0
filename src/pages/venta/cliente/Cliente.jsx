import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as Global from "../../../components/Global";
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
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&numeroDocumentoIdentidad=${filtro.documento}&nombre=${filtro.nombre}`
    );
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
  const ValidarData = async ({ target }) => {
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
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, modo = "Nuevo", click = false) => {
    if (click) {
      setModo(modo);
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
    } else {
      setModo(modo);
      if (modo == "Nuevo") {
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
        });
      } else {
        await GetPorId(value);
      }
    }
    setModal(true);
  };
  const AbrirModalKey = async (e, modo) => {
    if (e.key === "Enter") {
      setModo(modo);
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
        setModal(true);
      }
    }
    if (e.key === "c") {
      setModo("Consultar");
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
        setModal(true);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaCliente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete(["Mantenimiento", "Cliente"], id, setEliminar);
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
            setEliminar={setEliminar}
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
          <div className="px-2">
            <h2 className={Global.TituloH2}>Clientes</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.Input96}>
                <label htmlFor="documento" className={Global.LabelStyle}>
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
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>

              <div className={Global.InputsFiltro}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  value={filtro.nombre}
                  onChange={ValidarData}
                  className={Global.InputBoton}
                />
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
                containerClass=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <TablaStyle>
              <Table
                id={"tablaCliente"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", true)}
                KeyDown={(e) => AbrirModalKey(e, "Modificar", true)}
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

export default Cliente;
