import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/Tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
  & th:nth-child(2) {
    width: 125px;
  }
  & th:nth-child(3),
  & th:nth-child(4) {
    width: 70px;
    text-align: center;
  }
  /* & th:nth-child(11),
  & th:nth-child(12),
  & th:nth-child(13) */
  & th:nth-child(10) {
    width: 60px;
    text-align: right;
  }
  & th:nth-child(12) {
    width: 30px;
    text-align: center;
  }
  & th:last-child {
    width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion

const MovimientoBancario = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    cuentaCorrienteId: "",
    tipoMovimientoId: "",
    concepto: "",
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&cuentaCorrienteId=${filtro.cuentaCorrienteId}&tipoMovimientoId=${filtro.tipoMovimientoId}&concepto=${filtro.concepto}`
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
      `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&cuentaCorrienteId=${filtro.cuentaCorrienteId}&tipoMovimientoId=${filtro.tipoMovimientoId}&concepto=${filtro.concepto}`
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
        GetCuentasCorrientes();
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("MovimientoBancario", setPermisos);
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
      `api/Finanzas/MovimientoBancario/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/MovimientoBancario/${id}`);
    setObjeto(result.data.data);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Finanzas/MovimientoBancario/IsPermitido?accion=${accion}&id=${id}`
    );
    if (!result.data.data) {
      toast.error(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    } else {
      return true;
    }
  };
  const GetCuentasCorrientes = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/Listar`
    );
    setDataCtacte(
      result.data.data.data.map((res) => ({
        ...res,
        id: res.cuentaCorrienteId,
        descripcion:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (id, modo = "Nuevo", accion = 0) => {
    setModo(modo);
    switch (accion) {
      case 0: {
        let model = dataCtacte.find((map) => map);
        if(filtro.cuentaCorrienteId != ""){
          model = dataCtacte.find((map) => map.cuentaCorrienteId == filtro.cuentaCorrienteId)
        }
        console.log(model)
        setObjeto({
          id: "",
          empresaId: "01",
          cuentaCorrienteId:
            filtro.cuentaCorrienteId == ""
              ? dataCtacte[0].cuentaCorrienteId
              : filtro.cuentaCorrienteId,
          fechaEmision: moment().format("YYYY-MM-DD"),
          tipoCambio: 0,
          tipoMovimientoId: "IN",
          tipoOperacionId: "",
          numeroOperacion: "",
          isCierreCaja: false,
          tipoBeneficiarioId: "",
          clienteProveedorId: null,
          clienteProveedorNombre: "",
          concepto: "",
          documentoReferencia: "",
          tieneDetraccion: false,
          porcentajeITF: 0,
          montoITF: 0,
          montoInteres: 0,
          monto: 0,
          total: 0,
          tieneCuentaDestino: false,
          cuentaDestinoId: null,
          monedaId: model.monedaId,
          detalles: [],
        });
        setModal(true);
        break;
      }
      case 1: {
        let valor = await GetIsPermitido(accion, id);
        if (valor) {
          await GetPorId(id);
          setModal(true);
        }
        break;
      }
      case 2: {
        let valor = await GetIsPermitido(accion, id);
        if (valor) {
          Delete(["Finanzas", "MovimientoBancario"], id, setEliminar);
        }
        break;
      }
      case 3: {
        await GetPorId(id);
        setModal(true);
        break;
      }
      default:
        break;
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
        Header: "Cuenta Bancaria",
        accessor: "cuentaBancaria",
      },
      {
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "Mov.",
        accessor: "tipoMovimientoId",
        Cell: ({ value }) => {
          return (
            <p className="text-center">
              {value == "IN" ? "INGRESO" : "EGRESO"}
            </p>
          );
        },
      },
      {
        Header: "Tipo",
        accessor: "tipoOperacionId",
        Cell: ({ value }) => {
          let comprobante = "";
          switch (value) {
            case "DE":
              comprobante = "DEPÓSITO";
              break;
            case "TR":
              comprobante = "TRANSFERENCIA";
              break;
            case "CH":
              comprobante = "CHEQUE";
              break;
            case "CC":
              comprobante = "CARGO CUENTA";
              break;
            default:
              comprobante = value;
          }
          return <p>{comprobante}</p>;
        },
      },
      {
        Header: "N°",
        accessor: "numeroOperacion",
      },
      {
        Header: "Nombres",
        accessor: "clienteProveedorNombre",
      },
      {
        Header: "Personal",
        accessor: "personalNombreCompleto",
      },
      {
        Header: "Concepto",
        accessor: "concepto",
      },
      // {
      //   Header: "Monto",
      //   accessor: "monto",
      //   Cell: ({ value }) => {
      //     return <p className="text-right font-semibold">{value}</p>;
      //   },
      // },
      // {
      //   Header: "Interes",
      //   accessor: "interes",
      //   Cell: ({ value }) => {
      //     return <p className="text-right font-semibold">{value}</p>;
      //   },
      // },
      // {
      //   Header: "ITF",
      //   accessor: "itf",
      //   Cell: ({ value }) => {
      //     return <p className="text-right font-semibold">{value}</p>;
      //   },
      // },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "Planilla",
        accessor: "planilla",
      },
      {
        Header: "B",
        accessor: "isBloqueado",
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
          ClickConsultar={() => AccionModal(row.values.id, "Consultar", 3)}
          ClickModificar={() => AccionModal(row.values.id, "Modificar", 1)}
          ClickEliminar={() => AccionModal(row.values.id, "Eliminar", 2)}
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
            <h2 className={Global.TituloH2}>Movimientos Bancarios</h2>

            {/* Filtro*/}
            <div
              className={
                Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label name="cuentaCorrienteId" className={Global.LabelStyle}>
                    Cta. Bancaria.
                  </label>
                  <select
                    id="cuentaCorrienteId"
                    name="cuentaCorrienteId"
                    value={filtro.cuentaCorrienteId ?? ""}
                    autoFocus
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    <option key={-1} value={""}>
                      {"--TODOS--"}
                    </option>
                    {dataCtacte.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label name="conceptoPadre" className={Global.LabelStyle}>
                    Concepto
                  </label>
                  <input
                    type="text"
                    id="conceptoPadre"
                    name="concepto"
                    placeholder="Concepto"
                    autoComplete="off"
                    value={filtro.concepto ?? ""}
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
                        name="tipoMovimientoId"
                        value={""}
                        onChange={ValidarData}
                        checked={filtro.tipoMovimientoId === ""}
                      />
                    </div>
                    <label
                      htmlFor="todos"
                      className={Global.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={Global.Input + "w-44"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="visualizarIngresos"
                        name="tipoMovimientoId"
                        value={"IN"}
                        onChange={ValidarData}
                        checked={filtro.tipoMovimientoId === "IN"}
                      />
                    </div>
                    <label
                      htmlFor="visualizarIngresos"
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Visualizar Ingresos
                    </label>
                  </div>
                  <div className={Global.Input + "w-44"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="visualizarEgresos"
                        name="tipoMovimientoId"
                        value={"EG"}
                        onChange={ValidarData}
                        checked={filtro.tipoMovimientoId === "EG"}
                      />
                    </div>
                    <label
                      htmlFor="visualizarEgresos"
                      className={Global.LabelCheckStyle + "font-semibold"}
                    >
                      Visualizar Egresos
                    </label>
                  </div>
                </div>
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

export default MovimientoBancario;
