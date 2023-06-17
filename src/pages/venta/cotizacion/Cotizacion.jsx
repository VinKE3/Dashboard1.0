import { faBan, faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useMemo, useState } from "react";
import { FaUndoAlt } from "react-icons/fa";
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
  & th:nth-child(3) {
    width: 135px;
  }
  & th:nth-child(6),
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(7) {
    text-align: right;
    width: 70px;
  }
  & th:nth-child(11) {
    width: 80px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Cotizacion = () => {
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
    GetPermisos("Cotizacion", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Venta/Cotizacion/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Venta/Cotizacion/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const HandleData = async ({ target }) => {
    setFiltro((prev) => ({
      ...prev,
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
            tipoDocumentoId: "CO",
            serie: "",
            numero: "",
            fechaEmision: moment().format("YYYY-MM-DD"),
            fechaVencimiento: moment().format("YYYY-MM-DD"),
            clienteId: "",
            clienteNombre: "",
            clienteNumeroDocumentoIdentidad: "",
            clienteDireccionId: 0,
            clienteDireccion: "",
            clienteTelefono: "",
            departamentoId: null,
            provinciaId: null,
            distritoId: null,
            contactoId: "",
            contactoNombre: "",
            contactoTelefono: "",
            contactoCorreoElectronico: "",
            contactoCargoId: null,
            contactoCargoDescripcion: "",
            contactoCelular: "",
            personalId: "",
            monedaId: "",
            tipoCambio: 0,
            tipoVentaId: "",
            tipoCobroId: "",
            numeroOperacion: "",
            cuentaCorrienteDescripcion: "",
            validez: "",
            observacion: "",
            subTotal: 0,
            montoIGV: 0,
            totalNeto: 0,
            montoRetencion: 0,
            montoPercepcion: 0,
            total: 0,
            porcentajeIGV: 0,
            porcentajeRetencion: 0,
            porcentajePercepcion: 0,
            incluyeIGV: false,
            detalles: [],
          });
          setModal(true);
          break;
        }
        case 1: {
          let valor = await GetIsPermitido("Venta/Cotizacion", accion, value);
          if (valor) {
            await GetPorId(value);
            setModal(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido("Venta/Cotizacion", accion, value);
          if (valor) {
            await Delete("Venta/Cotizacion", value, setListar);
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
            .querySelector("#tablaCotizacion")
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
                  "Venta/Cotizacion",
                  accion,
                  id
                );
                if (valor) {
                  await Put(`Venta/Cotizacion/Anular/${id}`, setListar);
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
            .querySelector("#tablaCotizacion")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            let model = await Imprimir("Venta/Cotizacion", id);
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
        .querySelector("#tablaCotizacion")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaCotizacion")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaCotizacion")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "a") {
      let row = document
        .querySelector("#tablaCotizacion")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Anular", 4);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaCotizacion")
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
        Header: "F",
        accessor: "isFacturado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "Doc. Ref.",
        accessor: "documentoReferencia",
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
            <h2 className={G.TituloH2}>Cotizaciones</h2>

            {/* Filtro*/}
            <div className={G.ContenedorInputsFiltro}>
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
            {/* Filtro*/}

            {/* Boton */}
            <div className={G.ContenedorBotones}>
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={G.BotonAzul}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  sticky=""
                />
              )}
              {permisos[4] && (
                <BotonBasico
                  botonText="Anular"
                  botonClass={G.BotonRojo}
                  botonIcon={faBan}
                  click={() => AccionModal(null, "Anular", 4)}
                  sticky=""
                />
              )}
              <BotonBasico
                botonText="Imprimir"
                botonClass={G.BotonVerde}
                botonIcon={faPrint}
                click={() => AccionModal(null, "Imprimir", 5)}
                sticky=""
              />
            </div>
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaCotizacion"}
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
              foco={document.getElementById("tablaCotizacion")}
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

export default Cotizacion;
