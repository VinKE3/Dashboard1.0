import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { FaSearch } from "react-icons/fa";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";

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

const CuentaPorCobrar = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [tipo, setTipo] = useState("soloDeuda");
  const [filtro, setFiltro] = useState({
    tipoDocumentoId: "01",
    clienteNombre: "",
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&tipoDocumentoId=${filtro.tipoDocumentoId}&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Consultar");
  const [objeto, setObjeto] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [eliminar, setEliminar] = useState(false);

  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&tipoDocumentoId=${filtro.tipoDocumentoId}&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
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
    Tablas();
    GetPermisos("CuentaPorCobrar", setPermisos);
  }, []);
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

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorCobrar/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/CuentaPorCobrar/${id}`);
    setObjeto(result.data.data);
  };

  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorCobrar/FiltroTablas`
    );
    setTiposDocumentos(result.data.data.tiposDocumento);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id) => {
    await GetPorId(id);
    setModal(true);
  };
  //#endregion
  const datosFiltrados =
    tipo === "todos"
      ? datos
      : tipo === "soloDeuda"
      ? datos.filter((dato) => dato.saldo > 0 && dato.saldo <= dato.total)
      : datos.filter((dato) => dato.abonado === dato.total);

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Fecha",
        accessor: "fechaContable",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      {
        Header: "Vencimiento",
        accessor: "fechaVencimiento",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Cliente",
        accessor: "clienteNombre",
      },
      {
        Header: "Moneda",
        accessor: "monedaId",
      },
      {
        Header: "Total",
        accessor: "total",
      },
      {
        Header: "Abonado",
        accessor: "abonado",
      },
      {
        Header: "Saldo",
        accessor: "saldo",
      },
      {
        Header: "Cancelado",
        accessor: "isCancelado",
        Cell: ({ value }) => {
          return value ? (
            <div className="flex justify-center">
              <Checkbox checked={true} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Checkbox checked={false} />
            </div>
          );
        },
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            menu={["Cobranzas", "CuentaPorCobrar"]}
            id={row.values.id}
            ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
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
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Cuentas Por Cobrar</h2>
              <div className="flex gap-3 items-center">
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <div className={Global.LabelStyle}>
                      <RadioButton
                        inputId="todos"
                        name="todos"
                        value="todos"
                        onChange={(e) => setTipo(e.target.value)}
                        checked={tipo === "todos"}
                      />
                    </div>
                    <label htmlFor="todos" className={Global.InputStyle}>
                      Todos
                    </label>
                  </div>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.LabelStyle}>
                    <RadioButton
                      inputId="soloDeuda"
                      name="soloDeuda"
                      value="soloDeuda"
                      onChange={(e) => setTipo(e.target.value)}
                      checked={tipo === "soloDeuda"}
                    />
                  </div>
                  <label htmlFor="soloDeuda" className={Global.InputStyle}>
                    Deudas
                  </label>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.LabelStyle}>
                    <RadioButton
                      inputId="soloCancelado"
                      name="soloCancelado"
                      value="soloCancelado"
                      onChange={(e) => setTipo(e.target.value)}
                      checked={tipo === "soloCancelado"}
                    />
                  </div>
                  <label htmlFor="soloCancelado" className={Global.InputStyle}>
                    Cancelados
                  </label>
                </div>
              </div>
            </div>
            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputFull}>
                <label htmlFor="tipoDocumentoId" className={Global.LabelStyle}>
                  Tipo Documento
                </label>
                <select
                  name="tipoDocumentoId"
                  id="tipoDocumentoId"
                  className={Global.InputStyle}
                  value={filtro.tipoDocumentoId ?? ""}
                  onChange={ValidarData}
                >
                  {tiposDocumentos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label name="clienteNombre" className={Global.LabelStyle}>
                  Cliente
                </label>
                <input
                  type="text"
                  id="clienteNombre"
                  name="clienteNombre"
                  placeholder="Cliente"
                  autoComplete="off"
                  value={filtro.clienteNombre ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                  Desde
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={filtro.fechaInicio ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="fechaFin" className={Global.LabelStyle}>
                  Hasta
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={filtro.fechaFin ?? ""}
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
            {/* Tabla */}
            <TablaStyle>
              <Table
                columnas={columnas}
                datos={datosFiltrados}
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
        <div></div>
      )}
    </>
  );
  //#endregion
};

export default CuentaPorCobrar;
