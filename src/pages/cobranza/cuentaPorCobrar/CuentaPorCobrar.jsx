import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
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
  & th:nth-child(2),
  & th:nth-child(3) {
    width: 65px;
    text-align: center;
  }
  & th:nth-child(4) {
    width: 135px;
  }
  & th:nth-child(7) {
    text-align: right;
  }
  & th:nth-child(6),
  & th:nth-child(10) {
    width: 35px;
    text-align: center;
  }
  & th:nth-child(7),
  & th:nth-child(8),
  & th:nth-child(9) {
    width: 50px;
    text-align: right;
  }
  & th:last-child {
    width: 90px;
    max-width: 90px;
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
  const [filtro, setFiltro] = useState({
    proveedorNombre: "",
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    isCancelado: "",
  });
  const [cadena, setCadena] = useState(
    `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isCancelado=${filtro.isCancelado}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo] = useState("Consultar");
  const [objeto, setObjeto] = useState([]);
  const [elimlinar, setEliminar] = useState(false);

  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isCancelado=${filtro.isCancelado}`
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
    if (elimlinar) {
      Listar(cadena, index + 1);
    }
  }, [elimlinar]);

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
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (id) => {
    await GetPorId(id);
    setModal(true);
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
        Header: "Fecha",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "Vcmto",
        accessor: "fechaVencimiento",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Proveedor",
        accessor: "proveedorNombre",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "Abonado",
        accessor: "abonado",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "Saldo",
        accessor: "saldo",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "C",
        accessor: "isCancelado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
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
            menu={["Finanzas", "CuentaPorCobrar"]}
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
            <h2 className={Global.TituloH2}>Cuentas por Cobrar</h2>

            {/* Filtro*/}
            <div
              className={
                Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={Global.ContenedorFiltro + " !my-0"}>
                <div className={Global.InputFull}>
                  <label name="proveedorNombre" className={Global.LabelStyle}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    id="proveedorNombre"
                    name="proveedorNombre"
                    placeholder="Proveedor"
                    autoComplete="off"
                    value={filtro.proveedorNombre ?? ""}
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

              <div className={Global.ContenedorFiltro + " !my-0"}>
                <div className={Global.InputMitad}>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle}>
                      <RadioButton
                        inputId="todos"
                        name="isCancelado"
                        value={""}
                        onChange={ValidarData}
                        checked={filtro.isCancelado === ""}
                      />
                    </div>
                    <label
                      htmlFor="todos"
                      className={Global.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="soloDeuda"
                        name="isCancelado"
                        value={false}
                        onChange={ValidarData}
                        checked={filtro.isCancelado === false}
                      />
                    </div>
                    <label
                      htmlFor="soloDeuda"
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Deudas
                    </label>
                  </div>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="soloCancelado"
                        name="isCancelado"
                        value={true}
                        onChange={ValidarData}
                        checked={filtro.isCancelado === true}
                      />
                    </div>
                    <label
                      htmlFor="soloCancelado"
                      className={Global.LabelCheckStyle + "font-semibold"}
                    >
                      Cancelados
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Filtro*/}

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
        <div></div>
      )}
    </>
  );
  //#endregion
};

export default CuentaPorCobrar;