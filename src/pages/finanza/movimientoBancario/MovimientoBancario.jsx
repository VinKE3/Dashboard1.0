import { faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useMemo, useState } from "react";
import { FaUndoAlt } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "store2";
import styled from "styled-components";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Delete from "../../../components/funciones/Delete";
import GetIsPermitido from "../../../components/funciones/GetIsPermitido";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";

//#region Estilos
const DivTabla = styled.div`
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
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
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
  const [listar, setListar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&cuentaCorrienteId=${filtro.cuentaCorrienteId}&tipoMovimientoId=${filtro.tipoMovimientoId}&concepto=${filtro.concepto}`
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
      fechaInicio: moment(
        dataGlobal == null ? "" : dataGlobal.fechaInicio
      ).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
        "YYYY-MM-DD"
      ),
      cuentaCorrienteId: "",
      tipoMovimientoId: "",
      concepto: "",
    });
    setIndex(0);
    document.getElementById("cuentaCorrienteId").focus();
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
  const AccionModal = async (
    value,
    modo = "Nuevo",
    accion = 0,
    click = false
  ) => {
    if (click) {
      setModo(modo);
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
      setModal(true);
    } else {
      setModo(modo);
      switch (accion) {
        case 0: {
          let model = dataCtacte.find((map) => map);
          if (filtro.cuentaCorrienteId != "") {
            model = dataCtacte.find(
              (map) => map.cuentaCorrienteId == filtro.cuentaCorrienteId
            );
          }
          setObjeto({
            id: "",
            empresaId: "",
            cuentaCorrienteId:
              filtro.cuentaCorrienteId == ""
                ? dataCtacte[0].cuentaCorrienteId
                : filtro.cuentaCorrienteId,
            fechaEmision: moment().format("YYYY-MM-DD"),
            tipoCambio: 0,
            tipoMovimientoId: "",
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
          let valor = await GetIsPermitido(
            "Finanzas/MovimientoBancario",
            accion,
            value
          );
          if (valor) {
            await GetPorId(value);
            setModal(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido(
            "Finanzas/MovimientoBancario",
            accion,
            value
          );
          if (valor) {
            await Delete("Finanzas/MovimientoBancario", value, setListar);
          }
          break;
        }
        case 3: {
          await GetPorId(value);
          setModal(true);
          break;
        }
        default:
          break;
      }
    }
  };
  const ModalKey = async (e) => {
    if (e.key === "n") {
      setModo("Nuevo");
      AccionModal();
    }
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaMovimientoBancario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaMovimientoBancario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaMovimientoBancario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
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
            setListar={setListar}
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
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Movimientos Bancarios</h2>

            {/* Filtro*/}
            <div
              className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
            >
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label name="cuentaCorrienteId" className={G.LabelStyle}>
                    Cta. Bancaria.
                  </label>
                  <select
                    id="cuentaCorrienteId"
                    name="cuentaCorrienteId"
                    value={filtro.cuentaCorrienteId ?? ""}
                    autoFocus
                    onChange={HandleData}
                    className={G.InputStyle}
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
                <div className={G.Input42pct}>
                  <label htmlFor="fechaInicio" className={G.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={filtro.fechaInicio ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label name="conceptoPadre" className={G.LabelStyle}>
                    Concepto
                  </label>
                  <input
                    type="text"
                    id="conceptoPadre"
                    name="concepto"
                    placeholder="Concepto"
                    autoComplete="off"
                    value={filtro.concepto ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.Input42pct}>
                  <label htmlFor="fechaFin" className={G.LabelStyle}>
                    Hasta
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={filtro.fechaFin ?? ""}
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

              <div className={G.ContenedorInputsFiltro + " !my-0"}>
                <div className={G.InputMitad}>
                  <div className={G.Input + "w-28"}>
                    <div className={G.CheckStyle}>
                      <RadioButton
                        inputId="todos"
                        name="tipoMovimientoId"
                        value={""}
                        onChange={HandleData}
                        checked={filtro.tipoMovimientoId === ""}
                      />
                    </div>
                    <label
                      htmlFor="todos"
                      className={G.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={G.Input + "w-44"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="visualizarIngresos"
                        name="tipoMovimientoId"
                        value={"IN"}
                        onChange={HandleData}
                        checked={filtro.tipoMovimientoId === "IN"}
                      />
                    </div>
                    <label
                      htmlFor="visualizarIngresos"
                      className={G.LabelCheckStyle + " rounded-r-none"}
                    >
                      Visualizar Ingresos
                    </label>
                  </div>
                  <div className={G.Input + "w-44"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="visualizarEgresos"
                        name="tipoMovimientoId"
                        value={"EG"}
                        onChange={HandleData}
                        checked={filtro.tipoMovimientoId === "EG"}
                      />
                    </div>
                    <label
                      htmlFor="visualizarEgresos"
                      className={G.LabelCheckStyle + "font-semibold"}
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
                botonClass={G.BotonAzul}
                botonIcon={faPlus}
                click={() => AccionModal()}
                sticky=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaMovimientoBancario"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", 3, true)}
                KeyDown={(e) => ModalKey(e, "Modificar")}
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

export default MovimientoBancario;
