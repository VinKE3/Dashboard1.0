import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaUndoAlt } from "react-icons/fa";
import {
  faPlus,
  faArrowAltCircleDown,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import Swal from "sweetalert2";

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
    text-align: center;
  }
  & th:nth-child(3) {
    width: 100px;
  }
  & th:nth-child(5),
  & th:nth-child(6),
  & th:nth-child(7) {
    text-align: right;
    width: 100px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10) {
    width: 40px;
    text-align: center;
  }
  & th:last-child {
    text-align: center;
    width: 80px;
    max-width: 80px;
  }
`;
//#endregion

const CuadreStock = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`);
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
    GetPermisos("CuadreStock", setPermisos);
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
  const FiltroBoton = async () => {
    setFiltro({
      fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    });
    setIndex(0);
    document.getElementById("fechaInicio").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Almacen/CuadreStock/${id}`);
    setObjeto(result.data.data);
  };
  const GetDetalles = async (id) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/GetDetalles?id=${id}`
    );
    setDetalle(result.data.data);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/IsPermitido?accion=${accion}&id=${id}`
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
          //Consulta Correlativo
          const result = await ApiMasy.get(
            `api/Mantenimiento/Correlativo/CU/0001`
          );
          //Consulta Correlativo
          setObjeto({
            empresaId: "01",
            tipoDocumentoId: "01",
            serie: "0001",
            numero: ("0000000000" + String(result.data.data.numero)).slice(-10),
            fechaRegistro: moment().format("YYYY-MM-DD"),
            horaRegistro: "",
            monedaId: "S",
            tipoCambio: 0,
            responsableId: "<<NI>>01",
            observacion: "",
            totalSobra: 0,
            totalFalta: 0,
            saldoTotal: 0,
            detalles: null,
          });
          await GetDetalles("");
          setModal(true);
          break;
        }
        case 1: {
          let valor = await GetIsPermitido(accion, value);
          if (valor) {
            await GetPorId(value);
            setModal(true);
          }
          break;
        }
        case 2: {
          let valor = await GetIsPermitido(accion, value);
          if (valor) {
            Delete(["Almacen", "CuadreStock"], value, setEliminar);
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
            .querySelector("#tablaCuadreStock")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            await Imprimir(["Almacen", "CuadreStock"], id);
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
            .querySelector("#tablaCuadreStock")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            const cerrado = datos.find((item) => item.id == id);
            const title = cerrado.estado
              ? "Abrir Cuadre De Stock"
              : "Cerrar Cuadre De Stock";
            const estado = !cerrado.estado;
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
                ApiMasy.put(
                  `api/Almacen/CuadreStock/AbrirCerrar/${id}?estado=${estado}`
                ).then((response) => {
                  if (response.name == "AxiosError") {
                    let err = "";
                    if (response.response.data == "") {
                      err = response.message;
                    } else {
                      err = String(response.response.data.messages[0].textos);
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
                    Listar(cadena, index + 1);
                    toast.success(String(response.data.messages[0].textos), {
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
                });
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
        default:{
          break;}
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
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar", 1);
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Eliminar", 2);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Imprimir", 5);
      }
    }
    if (e.key === "a") {
      let row = document
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "AbrirCerrar", 6);
      }
    }
  };
  //endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Registro",
        accessor: "fechaRegistro",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "Número",
        accessor: "numero",
      },
      {
        Header: "Responsable",
        accessor: "responsableNombreCompleto",
      },
      {
        Header: "Total Sobra",
        accessor: "totalSobra",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "Total Falta",
        accessor: "totalFalta",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "Saldo Final",
        accessor: "saldoFinal",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },

      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Cerrado",
        accessor: "estado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "Pendiente",
        accessor: "pendiente",
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
           <div className={Global.ContenedorPadre}>
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Cuadre de Stock</h2>
            </div>

            {/* Filtro*/}
            <div
              className={
                Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={Global.ContenedorFiltro}>
                <div className={Global.InputFull}>
                  <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    autoFocus
                    value={filtro.fechaInicio ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
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
                    onClick={FiltroBoton}
                  >
                    <FaUndoAlt />
                  </button>
                </div>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            <div className={Global.ContenedorBotones}>
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={Global.BotonRegistrar}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  contenedor=""
                />
              )}
              <BotonBasico
                botonText="Cerrar / Abrir"
                botonClass={Global.BotonMorado}
                botonIcon={faArrowAltCircleDown}
                click={() => AccionModal(null, "AbrirCerrar", 6)}
                contenedor=""
              />
              <BotonBasico
                botonText="Imprimir"
                botonClass={Global.BotonAgregar}
                botonIcon={faPrint}
                click={() => AccionModal(null, "Imprimir", 5)}
                contenedor=""
              />
            </div>
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaCuadreStock"}
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
          {modal && (
            <Modal
              setModal={setModal}
              modo={modo}
              objeto={objeto}
              detalle={detalle}
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

export default CuadreStock;
