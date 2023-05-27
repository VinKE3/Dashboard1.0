import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import Anular from "../../../components/funciones/Anular";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import Modal from "./Modal";
import ModalDeshacer from "./ModalDeshacer";
import ModalRefinanciamiento from "./ModalRefinanciamiento";
import ModalRenovacion from "./ModalRenovacion";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaCheck } from "react-icons/fa";
import { faPlus, faBan, faPrint } from "@fortawesome/free-solid-svg-icons";
import * as Global from "../../../components/Global";
//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(7) {
    text-align: right;
  }
  & th:nth-child(6) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: center;
    width: 40px;
  }
  th:nth-child(16) {
    text-align: center;
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
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    isEnviado: "",
  });
  const [cadena, setCadena] = useState(
    `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isenviado=${filtro.isEnviado}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modalRefinanciacion, setModalRefinanciacion] = useState(false);
  const [modalRenovacion, setModalRenovacion] = useState(false);
  const [modalDeshacer, setModalDeshacer] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&clienteNombre=${filtro.clienteNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&isenviado=${filtro.isEnviado}`
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
    GetPermisos("LetraCambioVenta", setPermisos);
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
      `api/Venta/LetraCambioVenta/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Venta/LetraCambioVenta/${id}`);
    setObjeto(result.data.data);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/IsPermitido?accion=${accion}&id=${id}`
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
            id: "",
            fechaEmision: moment().format("YYYY-MM-DD"),
            fechaVencimiento: moment().format("YYYY-MM-DD"),
            clienteNombre: "",
            tipoDocumentoAbreviatura: "",
            numeroDocumento: "",
            monedaId: "S",
            total: 0,
            saldo: 0,
            isAnulado: false,
            isBloqueado: false,
            clienteId: "",
            clienteDireccion: "",
            tipoVentaId: "",
            existeNotaDebitoRelacionada: false,
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
            Delete(["Venta", "LetraCambioVenta"], id, setEliminar);
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
    }
  };
  const AbrirModalRefinanciacion = async (modo = "Nuevo") => {
    setModo(modo);
    setObjeto({
      monedaId: "S",
      tipoCambio: 0,
      documentosReferencia: [],
      detalles: [],
    });
    setModalRefinanciacion(true);
  };
  const AbrirModalRenovacion = async (modo = "Nuevo") => {
    setModo(modo);
    setObjeto({
      monedaId: "S",
      tipoCambio: 0,
      documentosReferencia: [],
      detalles: [],
    });
    setModalRenovacion(true);
  };
  const AbrirModalDeshacer = async (modo = "Nuevo") => {
    setModalDeshacer(true);
  };
  const AbrirModalKey = async (e, modo) => {
    if (e.key === "Enter") {
      setModo(modo);
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      let id = row.firstChild.innerText;
      let valor = await GetIsPermitido(1, id);
      if (valor) {
        await GetPorId(id);
        setModal(true);
      }
    }
    if (e.key === "c") {
      setModo("Consultar");
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
        setModal(true);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaLetraCambioVenta")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        let valor = await GetIsPermitido(2, id);
        if (valor) {
          Delete(["Venta", "LetraCambioVenta"], id, setEliminar);
        }
      }
    }
  };
  const Anulacion = async () => {
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
          await Anular(["Venta", "LetraCambioVenta"], id, setEliminar);
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
  };
  const Imprimir = async () => {
    let row = document
      .querySelector("#tablaLetraCambioVenta")
      .querySelector("tr.selected-row");
    if (row != null) {
      let id = row.children[0].innerHTML;
      const result = await ApiMasy.get(
        `api/Venta/LetraCambioVenta/Imprimir/${id}`
      );
      if (result.name == "AxiosError") {
        let err = "";
        if (result.response.data == "") {
          err = result.message;
        } else {
          err = String(result.response.data.messages[0].textos);
        }
        toast.error(err, {
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
        console.log(result.data);
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
  const Autorizar = async (id, estado) => {
    if (estado != false) {
      toast.error(
        "Documento Venta: Solo se pueden autorizar documentos pendientes.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } else {
      console.log(id);
    }
  };
  const AutorizarTodo = async (ids, value) => {
    let model = {
      ids: ids,
      isBloqueado: value,
    };
    const title = value
      ? "Autorizar Registros de Ventas (50 registros mostrados)"
      : "Desautorizar Registros de Ventas (50 registros mostrados)";

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
        // ApiMasy.put(`api/Venta/BloquearVenta`, model).then((response) => {
        //   if (response.name == "AxiosError") {
        //     let err = "";
        //     if (response.response.data == "") {
        //       err = response.message;
        //     } else {
        //       err = String(response.response.data.messages[0].textos);
        //     }
        //     toast.error(err, {
        //       position: "bottom-right",
        //       autoClose: 3000,
        //       hideProgressBar: true,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //       progress: undefined,
        //       theme: "colored",
        //     });
        //   } else {
        //     Listar(
        //       `&tipoDocumentoId=${
        //         document.getElementById("tipoDocumentoId").value
        //       }&fechaInicio=${
        //         document.getElementById("fechaInicio").value
        //       }&fechaFin=${document.getElementById("fechaFin").value}`,
        //       index + 1
        //     );
        //     toast.info(String(response.data.messages[0].textos), {
        //       position: "bottom-right",
        //       autoClose: 3000,
        //       hideProgressBar: true,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //       progress: undefined,
        //       theme: "colored",
        //     });
        //   }
        // });
        setChecked(value);
      } else {
        setChecked(!value);
      }
    });
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
        Header: "Cotización",
        accessor: "cotizacion",
      },
      {
        Header: "O. Pedido",
        accessor: "ordenPedido",
      },
      {
        Header: "G. Remisión",
        accessor: "guiaRemision",
      },
      {
        Header: "Tienda/Vend.",
        accessor: "tiendaVendedor",
      },
      {
        Header: "E",
        accessor: "isEnviado",
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
          <div className="flex">
            <div className={Global.TablaBotonConsultar}>
              <button
                id="boton-autorizar"
                onClick={() => Autorizar(row.values.id, row.values.isEnviado)}
                className="p-0 px-1"
                title="Click para autorizar registro"
              >
                <FaCheck></FaCheck>
              </button>
            </div>
            <BotonCRUD
              setEliminar={setEliminar}
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
          <div className="px-2">
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Letra Cambio Venta</h2>
              {filtro.isEnviado === false && (
                <div className="flex">
                  <div className={Global.CheckStyle}>
                    <Checkbox
                      inputId="isAutorizado"
                      name="isAutorizado"
                      onChange={(e) => {
                        AutorizarTodo(
                          datos.map((d) => d.id),
                          e.checked
                        );
                      }}
                      checked={checked}
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="isAutorizado"
                    className={Global.LabelCheckStyle + " font-semibold"}
                  >
                    Autorizar Todos
                  </label>
                </div>
              )}
            </div>
            {/* Filtro*/}
            <div
              className={
                Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={Global.ContenedorFiltro + " !my-0"}>
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
                    autoFocus
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

              <div className={Global.ContenedorFiltro + " !my-0"}>
                <div className={Global.InputMitad}>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle}>
                      <RadioButton
                        inputId="isEnviadoTodos"
                        name="isEnviado"
                        value={""}
                        onChange={ValidarData}
                        checked={filtro.isEnviado === ""}
                      />
                    </div>
                    <label
                      htmlFor="isEnviadoTodos"
                      className={Global.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="isEnviadoPendiente"
                        name="isEnviado"
                        value={false}
                        onChange={ValidarData}
                        checked={filtro.isEnviado === false}
                      />
                    </div>
                    <label
                      htmlFor="isEnviadoPendiente"
                      className={Global.LabelCheckStyle + " rounded-r-none"}
                    >
                      Pendientes
                    </label>
                  </div>
                  <div className={Global.Input + "w-28"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="isEnviado"
                        name="isEnviado"
                        value={true}
                        onChange={ValidarData}
                        checked={filtro.isEnviado === true}
                      />
                    </div>
                    <label
                      htmlFor="isEnviado"
                      className={Global.LabelCheckStyle + "font-semibold"}
                    >
                      Enviados
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            <div className="sticky top-2 z-20 flex gap-2 bg-black/30">
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={Global.BotonRegistrar}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  containerClass=""
                />
              )}
              <BotonBasico
                botonText="Refinanciamiento"
                botonClass={Global.BotonNaranja}
                botonIcon={faPlus}
                click={() => Imprimir()}
                containerClass=""
              />
              <BotonBasico
                botonText="Renovación"
                botonClass={Global.BotonMorado}
                botonIcon={faPrint}
                click={() => Imprimir()}
                containerClass=""
              />
              <BotonBasico
                botonText="Deshacer Emisión"
                botonClass={Global.BotonRosa}
                botonIcon={faPrint}
                click={() => Imprimir()}
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
              <BotonBasico
                botonText="Imprimir"
                botonClass={Global.BotonAgregar}
                botonIcon={faPrint}
                click={() => Imprimir()}
                containerClass=""
              />
            </div>
            {/* Boton */}

            {/* Tabla */}
            <TablaStyle>
              <Table
                id={"tablaLetraCambioVenta"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", 3, true)}
                KeyDown={(e) => AbrirModalKey(e, "Modificar")}
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

export default LetraCambioVenta;
