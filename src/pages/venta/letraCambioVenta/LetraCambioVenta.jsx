import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import GetIsPermitido from "../../../components/funciones/GetIsPermitido";
import Put from "../../../components/funciones/Put";
import Delete from "../../../components/funciones/Delete";
import Imprimir from "../../../components/funciones/Imprimir";
import ModalImprimir from "../../../components/filtro/ModalImprimir";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import Modal from "./Modal";
import ModalCabecera from "./ModalCabecera";
import ModalDeshacer from "./ModalDeshacer";
import ModalRefinanciamiento from "./ModalRefinanciamiento";
import ModalRenovacion from "./ModalRenovacion";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { FaUndoAlt } from "react-icons/fa";
import { faPlus, faBan, faPrint } from "@fortawesome/free-solid-svg-icons";
import * as G from "../../../components/Global";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2),
  & th:nth-child(3) {
    text-align: center;
    width: 60px;
  }
  & th:nth-child(4) {
    width: 135px;
  }
  & th:nth-child(7),
  & th:nth-child(11),
  & th:nth-child(12),
  & th:nth-child(13) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10) {
    text-align: right;
    width: 60px;
  }
  th:nth-child(14),
  th:nth-child(15),
  th:nth-child(17) {
    text-align: center;
    width: 40px;
  }
  & th:last-child {
    width: 90px;
    text-align: center;
  }
`;
//#endregion

const LetraCambioVenta = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    clienteNombre: "",
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    isCancelado: "",
  });
  const [cadena, setCadena] = useState(
    `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isCancelado=${filtro.isCancelado}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modalImprimir, setModalImprimir] = useState(false);
  const [modalCabecera, setModalCabecera] = useState(false);
  const [modalRefinanciacion, setModalRefinanciacion] = useState(false);
  const [modalRenovacion, setModalRenovacion] = useState(false);
  const [modalDeshacer, setModalDeshacer] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isCancelado=${filtro.isCancelado}`
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
    if (eliminar) {
      setEliminar(false);
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
    GetPermisos("LetraCambioVenta", setPermisos);
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
      clienteNombre: "",
      fechaInicio: moment(
        dataGlobal == null ? "" : dataGlobal.fechaInicio
      ).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
        "YYYY-MM-DD"
      ),
      isCancelado: "",
    });
    setIndex(0);
    document.getElementById("clienteNombre").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Venta/LetraCambioVenta/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (
    value,
    modo = "Nuevo",
    accion = 0,
    click = false
  ) => {
    setModo(modo);
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
      setModalCabecera(true);
    } else {
      switch (accion) {
        case 0: {
          setObjeto({
            monedaId: "S",
            tipoCambio: 0,
            documentosReferencia: [],
            detalles: [],
          });
          setModal(true);
          break;
        }
        case 1: {
          let valor = await GetIsPermitido(
            "Venta/LetraCambioVenta",
            accion,
            value
          );
          if (valor) {
            await GetPorId(value);
            setModalCabecera(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido(
            "Venta/LetraCambioVenta",
            accion,
            value
          );
          if (valor) {
            Delete(["Venta", "LetraCambioVenta"], value, setEliminar);
          }
          break;
        }
        case 3: {
          await GetPorId(value);
          setModalCabecera(true);
          break;
        }
        case 4: {
          let row = document
            .querySelector("#tablaLetraCambioVenta")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            let documento = row.children[2].innerHTML;
            Swal.fire({
              title: "¿Desea Anular el documento?",
              text: documento,
              icon: "warning",
              iconColor: "#F7BF3A",
              showCancelButton: true,
              color: "#fff",
              background: "#1a1a2e",
              confirmButtonColor: "#eea508",
              confirmButtonText: "Aceptar",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
            }).then(async (res) => {
              if (res.isConfirmed) {
                let valor = await GetIsPermitido(
                  "Venta/LetraCambioVenta",
                  accion,
                  id
                );
                if (valor) {
                  await Put(`Venta/LetraCambioVenta/Anular/${id}`, setEliminar);
                }
              }
            });
          } else {
            toast.info("Seleccione una Fila", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          break;
        }
        case 5: {
          let row = document
            .querySelector("#tablaLetraCambioVenta")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            let model = await Imprimir(["Venta", "LetraCambioVenta"], id);
            if (model != null) {
              setObjeto(model);
              setModalImprimir(true);
            }
          } else {
            toast.info("Seleccione una Fila", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          break;
        }
        case 6: {
          setObjeto({
            monedaId: "",
            tipoCambio: 0,
            documentosReferencia: [],
            detalles: [],
          });
          setModalRefinanciacion(true);
          break;
        }
        case 7: {
          setObjeto({});
          setModalRenovacion(true);
          break;
        }
        case 8: {
          setModalDeshacer(true);
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
    if (e.key === "r") {
      setModo("Nuevo");
      AccionModal(null, "Nuevo", 6);
    }
    if (e.key === "t") {
      setModo("Nuevo");
      AccionModal(null, "Nuevo", 7);
    }
    if (e.key === "y") {
      setModo("Nuevo");
      AccionModal(null, "Nuevo", 8);
    }
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "a") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Anular", 4);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Imprimir", 5);
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
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "Vcmto.",
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
        Header: "Cliente",
        accessor: "clienteNombre",
      },
      {
        Header: "RUC/DNI",
        accessor: "clienteNumero",
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
        Header: "A",
        accessor: "isAnulado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
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
        Header: "N° Único",
        accessor: "numeroUnico",
      },
      {
        Header: "Días Atrazo",
        accessor: "diasAtrazo",
        Cell: ({ value }) => {
          return <p className="text-center font-semibold">{value}</p>;
        },
      },
      {
        Header: "Doc. Ref.",
        accessor: "documentosReferencia",
      },
      {
        Header: "Estado",
        accessor: "estadoLetraId",
        Cell: ({ value }) => {
          let estado = "";
          switch (value) {
            case "E":
              estado = "EMITIDO";
              break;
            case "T":
              estado = "PROTESTADO";
              break;
            case "R":
              estado = "RENOVADO";
              break;
            default:
              estado = value;
              break;
          }
          return <p className="text-center">{estado}</p>;
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
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Letra Cambio Venta</h2>
            {/* Filtro*/}
            <div
              className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
            >
              <div className={G.ContenedorInputsFiltro + " !my-0"}>
                <div className={G.InputFull}>
                  <label name="clienteNombre" className={G.LabelStyle}>
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="clienteNombre"
                    name="clienteNombre"
                    placeholder="Cliente"
                    autoComplete="off"
                    autoFocus
                    value={filtro.clienteNombre ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
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
                  <div className={G.Input + "w-40"}>
                    <div className={G.CheckStyle}>
                      <RadioButton
                        inputId="isEnviadoTodos"
                        name="isCancelado"
                        value={""}
                        onChange={HandleData}
                        checked={filtro.isCancelado === ""}
                      />
                    </div>
                    <label
                      htmlFor="isEnviadoTodos"
                      className={G.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todas las Letras
                    </label>
                  </div>
                  <div className={G.Input + "w-36"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="isEnviadoPendiente"
                        name="isCancelado"
                        value={false}
                        onChange={HandleData}
                        checked={filtro.isCancelado === false}
                      />
                    </div>
                    <label
                      htmlFor="isEnviadoPendiente"
                      className={G.LabelCheckStyle + " rounded-r-none"}
                    >
                      Solo Deudas
                    </label>
                  </div>
                  <div className={G.Input + "w-40"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="isCancelado"
                        name="isCancelado"
                        value={true}
                        onChange={HandleData}
                        checked={filtro.isCancelado === true}
                      />
                    </div>
                    <label
                      htmlFor="isCancelado"
                      className={G.LabelCheckStyle + "font-semibold"}
                    >
                      Solo Cancelados
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            <div className={G.ContenedorBotones}>
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={G.BotonRegistrar}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  contenedor=""
                />
              )}
              <BotonBasico
                botonText="Refinanciamiento"
                botonClass={G.BotonNaranja}
                botonIcon={faPlus}
                click={() => AccionModal(null, "Nuevo", 6)}
                contenedor=""
              />
              <BotonBasico
                botonText="Renovación"
                botonClass={G.BotonMorado}
                botonIcon={faPlus}
                click={() => AccionModal(null, "Nuevo", 7)}
                contenedor=""
              />
              <BotonBasico
                botonText="Deshacer Emisión"
                botonClass={G.BotonRosa}
                botonIcon={faBan}
                click={() => AccionModal(null, "Nuevo", 8)}
                contenedor=""
              />

              {permisos[4] && (
                <BotonBasico
                  botonText="Anular"
                  botonClass={G.BotonEliminar}
                  botonIcon={faBan}
                  click={() => Anular()}
                  contenedor=""
                />
              )}
              <BotonBasico
                botonText="Imprimir"
                botonClass={G.BotonAgregar}
                botonIcon={faPrint}
                click={() => AccionModal(null, "Imprimir", 5)}
                contenedor=""
              />
            </div>
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaLetraCambioVenta"}
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
          {modalCabecera && (
            <ModalCabecera
              setModal={setModalCabecera}
              modo={modo}
              objeto={objeto}
            />
          )}
          {modalRefinanciacion && (
            <ModalRefinanciamiento
              setModal={setModalRefinanciacion}
              modo={modo}
              objeto={objeto}
            />
          )}
          {modalRenovacion && (
            <ModalRenovacion
              setModal={setModalRenovacion}
              modo={modo}
              objeto={objeto}
            />
          )}
          {modalDeshacer && (
            <ModalDeshacer
              setModal={setModalDeshacer}
              modo={modo}
              foco={document.getElementById("tablaLetraCambioVenta")}
            />
          )}
          {modalImprimir && (
            <ModalImprimir
              objeto={objeto}
              setModal={setModalImprimir}
              foco={document.getElementById("tablaDocumentoVenta")}
            />
          )}
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default LetraCambioVenta;
