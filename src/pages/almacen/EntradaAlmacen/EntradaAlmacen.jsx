import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import Delete from "../../../components/Funciones/Delete";
import BotonBasico from "../../../components/Boton/BotonBasico";
import BotonCRUD from "../../../components/Boton/BotonCRUD";
import Table from "../../../components/Tabla/Table";
import { Checkbox } from "primereact/checkbox";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import {
  faPlus,
  faBan,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
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
    width: 70px;
    text-align: center;
  }
  & th:nth-child(4) {
    width: 145px;
  }
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8) {
    text-align: center;
    width: 35px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion
const EntradaAlmacen = () => {
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
  });
  const [cadena, setCadena] = useState(
    `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
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
    GetPermisos("EntradaAlmacen", setPermisos);
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
      `api/Almacen/EntradaAlmacen/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Almacen/EntradaAlmacen/${id}`);
    setObjeto(result.data.data);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Almacen/EntradaAlmacen/IsPermitido?accion=${accion}&id=${id}`
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
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar", accion = 0) => {
    setModo(modo);
    switch (accion) {
      case 0: {
        setObjeto({
          empresaId: "01",
          proveedorId: "",
          tipoDocumentoId: "EN",
          serie: "",
          numero: "",
          clienteId: "000000",
          proveedorNumeroDocumentoIdentidad: "",
          proveedorDireccion: "",
          personalId: dataGlobal.personalId,
          fechaEmision: moment().format("YYYY-MM-DD"),
          monedaId: "S",
          tipoCambio: 0,
          numeroOP: "",
          observacion: "",
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
          Delete(["Almacen", "EntradaAlmacen"], id, setEliminar);
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
  const Anular = async () => {
    let tabla = document
      .querySelector("table > tbody")
      .querySelector("tr.selected-row");
    if (tabla != null) {
      if (tabla.classList.contains("selected-row")) {
        let id =
          document.querySelector("tr.selected-row").children[0].innerHTML;
        let documento =
          document.querySelector("tr.selected-row").children[3].innerHTML;
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
            const result = await ApiMasy.put(
              `api/Almacen/EntradaAlmacen/Anular/${id}`
            );
            if (result.name == "AxiosError") {
              if (Object.entries(result.response.data).length > 0) {
                toast.error(String(result.response.data.messages[0].textos), {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              } else {
                toast.error([result.message], {
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
            } else {
              toast.success(result.data.messages[0].textos[0], {
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
          }
        });
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
  };
  const Cerrar = async () => {
    let tabla = document
      .querySelector("table > tbody")
      .querySelector("tr.selected-row");
    if (tabla != null) {
      if (tabla.classList.contains("selected-row")) {
        let id = document.querySelector("tr.selected-row").firstChild.innerHTML;
        const cerrado = datos.find((item) => item.id == id);
        const title = cerrado.cerrado
          ? "¿Desea Abrir el documento?"
          : "¿Desea Cerrar el documento?";
        Swal.fire({
          title: title,
          icon: "warning",
          iconColor: "#F7BF3A",
          showCancelButton: true,
          color: "#fff",
          background: "#1a1a2e",
          confirmButtonColor: "#EE8100",
          confirmButtonText: "Aceptar",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            ApiMasy.put(`api/Almacen/EntradaAlmacen/Cerrar/${id}`).then(
              (response) => {
                if (response.name == "AxiosError") {
                  let err = "";
                  if (response.response.data == "") {
                    err = response.message;
                  } else {
                    err = String(response.response.data.messages[0].textos);
                  }
                  toast.error(err, {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                } else {
                  Listar(cadena, index + 1);
                  toast.success(String(response.data.messages[0].textos), {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                }
              }
            );
          }
        });
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
        Header: "Hora",
        accessor: "horaEmision",
        Cell: ({ value }) => {
          return <p className="text-center">{value}</p>;
        },
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Detalle",
        accessor: "observacion",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
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
            ClickConsultar={() => AbrirModal(row.values.id, "Consultar", 3)}
            ClickModificar={() => AbrirModal(row.values.id, "Modificar", 1)}
            ClickEliminar={() => AbrirModal(row.values.id, "Eliminar", 2)}
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
            <h2 className={Global.TituloH2}>Entrada Artículos</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
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
                  autoFocus
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
            {/* Filtro*/}

            {/* Boton */}
            <div className="sticky top-2 z-20 flex gap-2 bg-black/30">
              {permisos[0] && (
                <BotonBasico
                  botonText="Registrar"
                  botonClass={Global.BotonRegistrar}
                  botonIcon={faPlus}
                  click={() => AbrirModal()}
                />
              )}

              <BotonBasico
                botonText="Cerrar"
                botonClass={Global.BotonAgregar}
                botonIcon={faCircleCheck}
                click={() => Cerrar()}
                containerClass=""
              />

              {permisos[4] && (
                <BotonBasico
                  botonText="Anular"
                  botonClass={Global.BotonEliminar}
                  botonIcon={faBan}
                  click={() => Anular()}
                  containerClass=""
                />
              )}
            </div>
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

export default EntradaAlmacen;
