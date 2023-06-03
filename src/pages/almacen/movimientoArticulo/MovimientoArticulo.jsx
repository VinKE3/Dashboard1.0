import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Modal from "./Modal";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { ToastContainer } from "react-toastify";
import { FaUndoAlt } from "react-icons/fa";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
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
  & th:nth-child(6),
  & th:nth-child(7) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: right;
    width: 80px;
  }
  & th:last-child {
    text-align: center;
    width: 80px;
    max-width: 80px;
  }
`;

const MovimientoArticulo = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [dataLocal, setDataLocal] = useState([]);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    tipoExistenciaId: "",
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    conStock: false,
  });
  const [filtroLocal, setFiltroLocal] = useState({
    descripcion: "",
    conStock: false,
  });
  const [cadena, setCadena] = useState(
    `&tipoExistenciaId=${filtro.tipoExistenciaId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setDataLocal(datos);
  }, [datos]);
  useEffect(() => {
    setCadena(
      `&tipoExistenciaId=${filtro.tipoExistenciaId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
    );
  }, [filtro]);
  useEffect(() => {
    FiltroLocal();
  }, [filtroLocal]);
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
        TipoDeDocumentos();
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("MovimientoArticulo", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (f = "") => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/Listar?${f}`
    );
    let model = result.data.data.map((res) => ({
      Id: res.lineaId + res.subLineaId + res.articuloId,
      ...res,
    }));
    if (filtro.conStock) {
      model = model.filter((map) => map.saldoFinal > 0);
    }
    setDatos(model);
    setTotal(result.data.data.length);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/GetKardexArticulo?id=${id}`
    );
    setObjeto(result.data.data);
  };
  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };
  //#endregion

  //#region Funciones Filtrado
  const ValidarFiltro = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const ValidarFiltroLocal = async ({ target }) => {
    if (target.name == "conStock") {
      setFiltroLocal((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setFiltroLocal((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const Filtro = async () => {
    clearTimeout(timer);
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(
        `&tipoExistenciaId=${filtro.tipoExistenciaId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`,
        1
      );
    }, 200);
    setTimer(newTimer);
    setFiltroLocal({ descripcion: "", conStock: false });
    document.getElementById("descripcion").focus();
  };
  const FiltroLocal = async (index = 0) => {
    setIndex(index);
    //Detalle completo
    let model = datos;
    //Detalle completo

    //Expresiones a filtrar
    let descripcion = new RegExp(`${filtroLocal.descripcion}.*`, "i");
    //Expresiones a filtrar

    //Tipo Existencia
    if (filtro.tipoExistenciaId != "") {
      model = datos.filter(
        (map) => map.tipoExistenciaId == filtro.tipoExistenciaId
      );
    }
    //Tipo Existencia

    //Tiene Stock
    if (filtroLocal.conStock) {
      model = model.filter((map) => map.saldoFinal > 0);
    }
    //Tiene Stock

    //Filtra en base a las expresiones
    model = model.filter((map) => descripcion.test(map.articuloDescripcion));
    //Filtra en base a las expresiones

    setDataLocal(model);
    setTotal(model.length);
  };
  const FiltroBoton = async () => {
    setFiltro({
      tipoExistenciaId: "",
      fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
      conStock: false,
    });
    setIndex(0);
    document.getElementById("descripcion").focus();
  };
  const FiltradoPaginado = (e) => {
    const filtrado = datos.slice(e.selected * 50, total);
    setDataLocal(filtrado);
    setIndex(e.selected);
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
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
      setModal(true);
    } else {
      switch (accion) {
        case 3: {
          await GetPorId(value);
          setModal(true);
          break;
        }
        case 5: {
          let row = document
            .querySelector("#tablaMovimientoArticulo")
            .querySelector("tr.selected-row");
          if (row != null) {
            let id = row.children[0].innerHTML;
            await Imprimir(["Almacen", "MovimientoArticulo"], id);
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
    if (e.key === "Enter" || e.key === "c") {
      let row = document
        .querySelector("#tablaMovimientoArticulo")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar", 3);
      }
    }
    if (e.key === "p") {
      let row = document
        .querySelector("#tablaMovimientoArticulo")
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
        Header: "Id",
        accessor: "Id",
      },
      {
        Header: "Linea",
        accessor: "lineaDescripcion",
      },
      {
        Header: "SubLinea",
        accessor: "subLineaDescripcion",
      },
      {
        Header: "Marca",
        accessor: "marcaNombre",
      },
      {
        Header: "Descripcion",
        accessor: "articuloDescripcion",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "U.M",
        accessor: "unidadMedidaAbreviatura",
      },
      {
        Header: "Stock Ini.",
        accessor: "stockInicial",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right font-semibold text-green-600"
                  : "text-right font-semibold text-red-600"
              }
            >
              {row.values.stockInicial}
            </p>
          );
        },
      },
      {
        Header: "Entradas",
        accessor: "cantidadEntrada",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right font-semibold text-green-600"
                  : "text-right font-semibold text-red-600"
              }
            >
              {row.values.cantidadEntrada}
            </p>
          );
        },
      },
      {
        Header: "Salidas",
        accessor: "cantidadSalida",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right font-semibold text-green-600"
                  : "text-right font-semibold text-red-600"
              }
            >
              {row.values.cantidadSalida}
            </p>
          );
        },
      },
      {
        Header: "Saldo Fin.",
        accessor: "saldoFinal",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right font-semibold text-green-600"
                  : "text-right font-semibold text-red-600"
              }
            >
              {row.values.saldoFinal}
            </p>
          );
        },
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            ClickModificar={() => {}}
            ClickConsultar={() => AccionModal(row.values.Id, "Consultar", 3)}
            ClickEliminar={() => {}}
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
            <h2 className={G.TituloH2}>Movimiento de Artículos</h2>

            {/* Filtro*/}
            <div
              className={
                G.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={G.ContenedorInputsFiltro + " !my-0"}>
                <div className={G.InputFull}>
                  <label name="tipoExistenciaId" className={G.LabelStyle}>
                    Tipo de Existencia
                  </label>
                  <select
                    id="tipoExistenciaId"
                    name="tipoExistenciaId"
                    autoFocus
                    value={filtro.tipoExistenciaId ?? ""}
                    onChange={ValidarFiltro}
                    className={G.InputStyle}
                  >
                    <option key={-1} value={""}>
                      {"--TODOS--"}
                    </option>
                    {tipoDeExistencia.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {" "}
                        {tipo.descripcion}
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
                    onChange={ValidarFiltro}
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
                    onChange={ValidarFiltro}
                    className={G.InputBoton}
                  />
                  <button
                    id="buscar"
                    className={
                      G.BotonBuscar + G.Anidado + G.BotonPrimary
                    }
                    onClick={Filtro}
                  >
                    <FaUndoAlt />
                  </button>
                </div>
              </div>

              <div className={G.ContenedorBasico}>
                <div className={G.ContenedorInputsFiltro + " !my-0"}>
                  <div className={G.InputFull}>
                    <label name="descripcion" className={G.LabelStyle}>
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción"
                      value={filtroLocal.descripcion ?? ""}
                      onChange={ValidarFiltroLocal}
                      className={G.InputBoton}
                    />
                    <div className={G.ContenedorInputsFiltro + " !my-0"}>
                      <div className={G.Input + "w-32"}>
                        <div className={G.CheckStyle + " rounded-l-none"}>
                          <Checkbox
                            inputId="conStock"
                            name="conStock"
                            onChange={(e) => {
                              ValidarFiltroLocal(e);
                            }}
                            checked={filtroLocal.conStock ? true : ""}
                          ></Checkbox>
                        </div>
                        <label
                          htmlFor="conStock"
                          className={G.LabelCheckStyle}
                        >
                          Con Stock
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Filtro*/}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaMovimientoArticulo"}
                columnas={columnas}
                datos={dataLocal}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", 3, true)}
                KeyDown={(e) => ModalKey(e, "Consultar")}
              />
            </DivTabla>
            {/* Tabla */}
          </div>
          {modal && (
            <Modal
              setModal={setModal}
              objeto={objeto}
              foco={document.getElementById("tablaMovimientoArticulo")}
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

export default MovimientoArticulo;
