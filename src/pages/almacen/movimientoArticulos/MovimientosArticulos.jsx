import { useEffect, useState, useMemo } from "react";
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
    width: 35px;
  }
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: center;
    width: 25px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;

const MovimientosArticulos = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [tipoDeDocumento, setTipoDeDocumento] = useState([]);
  const [conStock, setConStock] = useState(false);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    tipoDocumentoId: "",
    fechaInicio: moment()
      .subtract(2, "years")
      .startOf("year")
      .format("yyyy-MM-DD"),
    fechaFin: moment(new Date()).format("yyyy-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [objeto, setObjeto] = useState([]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);

  useEffect(() => {
    if (respuestaAlert) {
    }
  }, [respuestaAlert]);

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
  const Listar = async (filtro = "") => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/Listar?${filtro}`
    );
    let model = result.data.data.map((res) => ({
      Id: res.lineaId + res.subLineaId + res.articuloId,
      ...res,
    }));
    if (conStock) {
      model = model.filter((registro) => registro.saldoFinal > 0);
    }
    setDatos(model);
    setTotal(model.length);
  };

  const handleCheckboxChange = (e) => {
    setConStock(e.target.checked);
    Listar();
  };

  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/FormularioTablas`
    );
    const tiposDocumento = result.data.data.tiposExistencia.map((tipo) => ({
      id: tipo.id,
      descripcion: tipo.descripcion,
    }));
    setTipoDeDocumento(tiposDocumento);
  };
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

  //#region
  const AbrirModal = async (id) => {
    let model = {
      Id: id,
    };
    setObjeto(model);
    setModal(true);
    console.log(model);
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
        Header: "S.Inicial",
        accessor: "stockInicial",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right text-green-500"
                  : "text-right  text-red-500"
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
                  ? "text-right text-green-500"
                  : "text-right  text-red-500"
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
                  ? "text-right text-green-500"
                  : "text-right  text-red-500"
              }
            >
              {row.values.cantidadSalida}
            </p>
          );
        },
      },
      {
        Header: "S.Final",
        accessor: "saldoFinal",
        Cell: ({ row }) => {
          return (
            <p
              className={
                row.values.saldoFinal > 0
                  ? "text-right text-green-500"
                  : "text-right  text-red-500"
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
            setRespuestaAlert={setRespuestaAlert}
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
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Movimiento de Artículos</h2>
              <div className="flex  h-10">
                <div className={Global.CheckStyle}>
                  <Checkbox
                    id="conStock"
                    name="conStock"
                    checked={conStock}
                    onChange={handleCheckboxChange}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="conStock"
                  className={Global.LabelCheckStyle + " font-semibold"}
                >
                  Con Stock
                </label>
              </div>
            </div>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputFull}>
                <label name="tipoDocumentoId" className={Global.LabelStyle}>
                  Tipo de Documento:
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
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
            {/* Filtro*/}

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
