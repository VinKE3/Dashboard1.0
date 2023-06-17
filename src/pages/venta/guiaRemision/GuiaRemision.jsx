import { faBan, faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useMemo, useState } from "react";
import { FaUndoAlt, FaWindowMaximize } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "store2";
import styled from "styled-components";
import Swal from "sweetalert2";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import ModalImprimir from "../../../components/filtro/ModalImprimir";
import Delete from "../../../components/funciones/Delete";
import GetIsPermitido from "../../../components/funciones/GetIsPermitido";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Imprimir from "../../../components/funciones/Imprimir";
import Put from "../../../components/funciones/Put";
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
    width: 70px;
  }
  & th:nth-child(3) {
    width: 115px;
  }
  & th:nth-child(5) {
    width: 100px;
  }
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8) {
    text-align: center;
  }
  & th:last-child {
    width: 100px;
    max-width: 100px;
    text-align: center;
  }
`;
//#endregion

const GuiaRemision = () => {
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
  });
  const [cadena, setCadena] = useState(
    `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modalImprimir, setModalImprimir] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [listar, setListar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
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
    GetPermisos("GuiaRemision", setPermisos);
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
      `api/Venta/GuiaRemision/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Venta/GuiaRemision/${id}`);
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
          setObjeto({
            empresaId: "",
            tipoDocumentoId: "09",
            serie: "",
            numero: "",
            fechaEmision: moment().format("YYYY-MM-DD"),
            fechaTraslado: moment().format("YYYY-MM-DD"),
            clienteId: "",
            clienteNumeroDocumentoIdentidad: "",
            clienteNombre: "",
            clienteDireccionId: 0,
            clienteDireccion: "",
            direccionPartida: "",
            personalId: "",
            empresaTransporteId: "",
            costoMinimo: 0,
            conductorId: "",
            licenciaConducir: "",
            vehiculoId: "",
            constanciaInscripcion: "",
            motivoTrasladoId: "",
            motivoSustento: "",
            ingresoEgresoStock: "",
            numeroFactura: "",
            ordenPedido: "",
            observacion: "",
            monedaId: "",
            afectarStock: true,
            documentoRelacionadoId: "",
            detalles: [],
            documentosRelacionados: [],
          });
          setModal(true);
          break;
        }
        case 1: {
          let valor = await GetIsPermitido("Venta/GuiaRemision", accion, value);
          if (valor) {
            await GetPorId(value);
            setModal(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido("Venta/GuiaRemision", accion, value);
          if (valor) {
            await Delete("Venta/GuiaRemision", value, setListar);
          }
          break;
        }
        case 3: {
          await GetPorId(value);
          setModal(true);
          break;
        }
        case 4: {
          let row = document
            .querySelector("#tablaGuiaRemision")
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
              background: "#171B23",
              confirmButtonColor: "#3B8407",
              confirmButtonText: "Confirmar",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
            }).then(async (res) => {
              if (res.isConfirmed) {
                let valor = await GetIsPermitido(
                  "Venta/GuiaRemision",
                  accion,
                  id
                );
                if (valor) {
                  await Put(`Venta/GuiaRemision/Anular/${id}`, setListar);
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
            .querySelector("#tablaGuiaRemision")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            let model = await Imprimir("Venta/GuiaRemision", id);
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
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "a") {
      let row = document
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Anular", 4);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Imprimir", 5);
      }
    }
    if (e.key === "h") {
      let row = document
        .querySelector("#tablaGuiaRemision")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar Cabecera", 1);
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
        Header: "Guía N°",
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
        Header: "S",
        accessor: "afectarStock",
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
        Header: "N° Factura",
        accessor: "numeroFactura",
      },
      {
        Header: "Tienda/Vend.",
        accessor: "tiendaVendedor",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div className="flex">
            <div className={G.TablaBotonConsultar}>
              <button
                id="boton-cabecera"
                onClick={() => AccionModal(row.values.id, "Cabecera", 1)}
                className="p-0 px-1"
                title="Click para abrir cabecera de registro"
              >
                <FaWindowMaximize></FaWindowMaximize>
              </button>
            </div>
            <BotonCRUD
              setListar={setListar}
              permisos={permisos}
              ClickConsultar={() => AccionModal(row.values.id, "Consultar", 3)}
              ClickModificar={() => AccionModal(row.values.id, "Modificar", 1)}
              ClickEliminar={() => AccionModal(row.values.id, "Eliminar", 2)}
            />
          </div>
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
            <h2 className={G.TituloH2}>Guías de Remisión</h2>

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
            </div>
            {/* Filtro*/}

            {/* Boton */}
            <div className={G.ContenedorBotones}>
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={G.BotonAzul}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  contenedor=""
                />
              )}
              {permisos[4] && (
                <BotonBasico
                  botonText="Anular"
                  botonClass={G.BotonRojo}
                  botonIcon={faBan}
                  click={() => AccionModal(null, "Anular", 4)}
                  contenedor=""
                />
              )}
              <BotonBasico
                botonText="Imprimir"
                botonClass={G.BotonVerde}
                botonIcon={faPrint}
                click={() => AccionModal(null, "Imprimir", 5)}
                contenedor=""
              />
            </div>
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaGuiaRemision"}
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
          {modalImprimir && (
            <ModalImprimir
              objeto={objeto}
              setModal={setModalImprimir}
              foco={document.getElementById("tablaGuiaRemision")}
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

export default GuiaRemision;
