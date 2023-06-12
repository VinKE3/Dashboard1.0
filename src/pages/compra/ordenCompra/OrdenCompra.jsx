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
import { RadioButton } from "primereact/radiobutton";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import styled from "styled-components";
import { FaUndoAlt } from "react-icons/fa";
import {
  faArrowAltCircleDown,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../../../components/Global";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3) {
    width: 140px;
  }
  & th:nth-child(6) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(7) {
    width: 70px;
    text-align: right;
  }
  & th:nth-child(8) {
    width: 80px;
    text-align: right;
  }
  & th:nth-child(9) {
    text-align: center;
  }
  & th:last-child {
    text-align: center;
    width: 80px;
    max-width: 80px;
  }
`;
//#endregion

const OrdenCompra = () => {
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
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    estado: "",
  });
  const [cadena, setCadena] = useState(
    `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&estado=${filtro.estado}`
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
      `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&estado=${filtro.estado}`
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
    GetPermisos("OrdenCompra", setPermisos);
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
      proveedorNombre: "",
      fechaInicio: moment(
        dataGlobal == null ? "" : dataGlobal.fechaInicio
      ).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
        "YYYY-MM-DD"
      ),
      estado: "",
    });
    setIndex(0);
    document.getElementById("proveedorNombre").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/OrdenCompra/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Compra/OrdenCompra/${id}`);
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
          //Consulta Correlativo
          const result = await ApiMasy.get(
            `api/Mantenimiento/Correlativo/OC/0001`
          );
          //Consulta Correlativo
          setObjeto({
            empresaId: "",
            proveedorId: "",
            tipoDocumentoId: "OC",
            serie: "0001",
            numero: ("0000000000" + String(result.data.data.numero)).slice(-10),
            clienteId: "",
            fechaEmision: moment().format("YYYY-MM-DD"),
            fechaContable: moment().format("YYYY-MM-DD"),
            fechaVencimiento: moment().format("YYYY-MM-DD"),
            proveedorNombre: "",
            proveedorNumeroDocumentoIdentidad: "",
            proveedorDireccion: "",
            responsable1Id: "",
            responsable2Id: "",
            responsable3Id: "",
            proveedorContactoId: "",
            tipoCompraId: "",
            monedaId: "",
            tipoCambio: 0,
            tipoPagoId: "",
            numeroOperacion: "",
            cuentaCorrienteId: "",
            lugarEntrega: "",
            proveedorCuentaCorriente1Id: "",
            proveedorCuentaCorriente2Id: "",
            observacion: "",
            subTotal: 0,
            porcentajeIGV: 0,
            montoIGV: 0,
            totalNeto: 0,
            porcentajeRetencion: 0,
            montoRetencion: 0,
            porcentajePercepcion: 0,
            montoPercepcion: 0,
            total: 0,
            incluyeIGV: false,
            detalles: [],
          });
          setModal(true);
          break;
        }
        case 1: {
          let valor = await GetIsPermitido("Compra/OrdenCompra", accion, value);
          if (valor) {
            await GetPorId(value);
            setModal(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido("Compra/OrdenCompra", accion, value);
          if (valor) {
            await Delete("Compra/OrdenCompra", value, setListar);
          }
          break;
        }
        case 3: {
          await GetPorId(value);
          setModal(true);
          break;
        }
        case 5: {
          let row = document
            .querySelector("#tablaOrdenCompra")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            let model = await Imprimir("Compra/OrdenCompra", id);
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
          let row = document
            .querySelector("#tablaOrdenCompra")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.firstChild.innerHTML;
            let documento = row.children[2].innerHTML;
            Swal.fire({
              title: "¿Desea Finalizar el documento?",
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
                let valor = await GetIsPermitido("Compra/OrdenCompra", 1, id);
                if (valor) {
                  await Put(`Compra/OrdenCompra/Finalizar/${id}`, setListar);
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
        default: {
          break;
        }
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
        .querySelector("#tablaOrdenCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaOrdenCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaOrdenCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaOrdenCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Imprimir", 5);
      }
    }
    if (e.key === "f") {
      let row = document
        .querySelector("#tablaOrdenCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Finalizar", 6);
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
        Header: "Fecha",
        accessor: "fechaContable",
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
        Header: "RUC",
        accessor: "proveedorNumero",
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
        Header: "Doc Ref.",
        accessor: "documentoRelacionado",
      },
      {
        Header: "Estado",
        accessor: "estado",
        Cell: ({ value }) => {
          return <p className="text-center">{value}</p>;
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
          <div className="h-full px-2">
            <h2 className={G.TituloH2}>Órdenes de Compra</h2>

            {/* Filtro*/}

            <div
              className={G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "}
            >
              <div className={G.ContenedorInputsFiltro + " !my-0"}>
                <div className={G.InputFull}>
                  <label name="proveedorNombre" className={G.LabelStyle}>
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
                  <div className={G.Input + "w-44"}>
                    <div className={G.CheckStyle}>
                      <RadioButton
                        inputId="TODOS"
                        name="estado"
                        value={""}
                        onChange={HandleData}
                        checked={filtro.estado === ""}
                      />
                    </div>
                    <label
                      htmlFor="TODOS"
                      className={G.LabelCheckStyle + " rounded-r-none "}
                    >
                      Todas las Órdenes
                    </label>
                  </div>
                  <div className={G.Input + "w-40"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="N"
                        name="estado"
                        value={"N"}
                        onChange={HandleData}
                        checked={filtro.estado == "N"}
                      />
                    </div>
                    <label
                      htmlFor="N"
                      className={G.LabelCheckStyle + " rounded-r-none"}
                    >
                      Solo Pendientes
                    </label>
                  </div>
                  <div className={G.Input + "w-44"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="S"
                        name="estado"
                        value={"S"}
                        onChange={HandleData}
                        checked={filtro.estado == "S"}
                      />
                    </div>
                    <label
                      htmlFor="S"
                      className={G.LabelCheckStyle + "font-semibold"}
                    >
                      Solo Entregados
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
                  botonClass={G.BotonAzul}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  contenedor=""
                />
              )}
              <BotonBasico
                botonText="Finalizar"
                botonClass={G.BotonMorado}
                botonIcon={faArrowAltCircleDown}
                click={() => AccionModal(null, "Finalizar", 6)}
                contenedor=""
              />
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
                id={"tablaOrdenCompra"}
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
              foco={document.getElementById("tablaOrdenCompra")}
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

export default OrdenCompra;
