import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Modal from "./Modal";
import Table from "../../../components/tablas/Table";
import { Checkbox } from "primereact/checkbox";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
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

const MovimientosArticulos = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [dataLocal, setDataLocal] = useState([]);
  const [tipoDeDocumento, setTipoDeDocumento] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    tipoDocumentoId: "",
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    conStock: false,
  });
  const [cadena, setCadena] = useState(
    `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&conStock=${filtro.conStock}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&conStock=${filtro.conStock}`
    );
  }, [filtro]);
  useEffect(() => {
    FiltroLocal();
  }, [cadena]);
  useEffect(() => {
    setDataLocal(datos);
  }, [datos]);
  useEffect(() => {
    if (eliminar) {
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
  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/FormularioTablas`
    );
    setTipoDeDocumento(result.data.data.tiposExistencia);
  };
  //#endregion

  //#region Funciones Filtrado
  const ValidarData = async ({ target }) => {
    if (target.name == "conStock") {
      setFiltro((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setFiltro((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };
  const Filtro = async () => {
    clearTimeout(timer);
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltroLocal = async () => {
    setIndex(0);
    let model = datos;
    if (filtro.tipoDocumentoId != "") {
      model = datos.filter(
        (map) => map.tipoExistenciaId == filtro.tipoDocumentoId
      );
      if (filtro.conStock) {
        model = model.filter((map) => map.saldoFinal > 0);
      }
    }
    setDataLocal(model);
    setTotal(model.length);
  };
  const FiltradoPaginado = (e) => {
    console.log(e.selected);
    setIndex(e.selected);
  };
  //#endregion

  //#region
  const AbrirModal = async (id) => {
    setObjeto({
      Id: id,
    });
    setModal(true);
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
            menu={["Almacen", "MovimientoArticulos"]}
            id={row.values.Id}
            ClickModificar={() => AbrirModal(row.values.Id)}
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
            <h2 className={Global.TituloH2}>Movimiento de Artículos</h2>

            {/* Filtro*/}
            <div
              className={
                Global.ContenedorBasico + "!p-0 mb-2 gap-y-1 !border-none "
              }
            >
              <div className={Global.ContenedorFiltro + " !my-0"}>
                <div className={Global.InputFull}>
                  <label name="tipoDocumentoId" className={Global.LabelStyle}>
                    Tipo de Documento:
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    autoFocus
                    value={filtro.tipoDocumentoId ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    <option key={-1} value={""}>
                      {"--TODOS--"}
                    </option>
                    {tipoDeDocumento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {" "}
                        {tipo.descripcion}
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
                <div className={Global.Input + "w-32"}>
                  <div className={Global.CheckStyle}>
                    <Checkbox
                      inputId="conStock"
                      name="conStock"
                      onChange={(e) => {
                        ValidarData(e);
                      }}
                      checked={filtro.conStock ? true : ""}
                    ></Checkbox>
                  </div>
                  <label htmlFor="conStock" className={Global.LabelCheckStyle}>
                    Con Stock
                  </label>
                </div>
              </div>
            </div>
            {/* Filtro*/}

            {/* Tabla */}
            <TablaStyle>
              <Table
                columnas={columnas}
                datos={dataLocal}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
              />
            </TablaStyle>
            {/* Tabla */}
          </div>
          {modal && <Modal setModal={setModal} objeto={objeto} />}
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default MovimientosArticulos;
