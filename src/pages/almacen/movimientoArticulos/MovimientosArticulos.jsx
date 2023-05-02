import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import store from "store2";
import Modal from "./Modal";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 150px;
  }
  & th:nth-child(3) {
    width: 150px;
  }
  & th:nth-child(4) {
    width: 250px;
  }
  & th:nth-child(5) {
    width: 200px;
  }
  & th:nth-child(6) {
    width: 150px;
  }
  & th:nth-child(7) {
    width: 150px;
  }
  & th:nth-child(8) {
    width: 25px;
  }
  & th:last-child {
    width: 130px;
  }
`;

const MovimientosArticulos = () => {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [tipoDeDocumento, setTipoDeDocumento] = useState([]);
  const [conStock, setConStock] = useState(false);
  const [modal, setModal] = useState(false);
  const [objeto, setObjeto] = useState([]);

  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setPermisos([false, true, false, false]);
      Listar(filtro, 1);
    } else {
      //Consulta a la Api para traer los permisos
    }
  }, [usuario]);

  useEffect(() => {
    tipoDeDocumento;
    document.getElementById("tipoDocumentoId").value = -1;
  }, [tipoDeDocumento]);

  useEffect(() => {
    datos;
  }, [datos]);

  useEffect(() => {
    if (!modal) {
      Listar(filtro, index + 1);
    }
  }, [modal]);

  useEffect(() => {
    filtro;
  }, [filtro]);
  useEffect(() => {
    total;
  }, [total]);
  useEffect(() => {
    index;
  }, [index]);

  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);

  useEffect(() => {
    TipoDeDocumentos();
    Listar(filtro, 1);
  }, []);

  useEffect(() => {
    if (conStock) {
      Listar();
    } else {
      Listar(filtro, index + 1);
    }
  }, [conStock]);

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
    tiposDocumento.unshift({ id: "-1", descripcion: "TODOS" });
    setTipoDeDocumento(tiposDocumento);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoExistenciaId = document.getElementById("tipoDocumentoId").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
      tipoExistenciaId == -1
    ) {
      Listar("", boton);
    } else {
      if (tipoExistenciaId == -1) {
        Listar(`fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
      } else {
        Listar(
          `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          boton
        );
      }
    }
  };
  const FiltradoSelect = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoExistenciaId = e.target.value;
    setFiltro(
      `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      index + 1
    );
    if (tipoExistenciaId != 0) setIndex(0);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
      tipoExistenciaId == -1
    ) {
      Listar("", index);
    } else {
      if (tipoExistenciaId == -1) {
        Listar(`fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          index + 1
        );
      }
    }
  };
  const FiltradoFechaInicio = (e) => {
    clearTimeout(timer);
    let fechaInicio = e.target.value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoExistenciaId = document.getElementById("tipoDocumentoId").value;
    setFiltro(
      `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      index + 1
    );
    if (
      fechaInicio !=
      moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD")
    )
      setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        tipoExistenciaId == -1
      ) {
        Listar("", index);
      } else {
        if (tipoExistenciaId == -1) {
          Listar(`fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
        } else {
          Listar(
            `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
            index + 1
          );
        }
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoFechaFin = (e) => {
    clearTimeout(timer);
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = e.target.value;
    let tipoExistenciaId = document.getElementById("tipoDocumentoId").value;
    setFiltro(
      `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      index + 1
    );
    if (fechaFin != moment(new Date()).format("yyyy-MM-DD")) setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        tipoExistenciaId == -1
      ) {
        Listar("", index);
      } else {
        if (tipoExistenciaId == -1) {
          Listar(`fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
        } else {
          Listar(
            `tipoExistenciaId=${tipoExistenciaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
            index + 1
          );
        }
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(0);
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };

  const AbrirModal = async (id) => {
    let model = {
      Id: id,
    };
    setObjeto(model);
    setModal(true);
    console.log(model);
  };

  //#endregion

  //#region Columnas y Selects
  const columnas = [
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
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "U.Medida",
      accessor: "unidadMedidaAbreviatura",
    },
    {
      Header: "S.Inicial",
      accessor: "stockInicial",
      Cell: ({ row }) => {
        return row.values.saldoFinal > 0 ? (
          <span className="text-green-900">{row.values.stockInicial}</span>
        ) : (
          <span className="text-red-500">{row.values.stockInicial}</span>
        );
      },
    },
    {
      Header: "Entradas",
      accessor: "cantidadEntrada",
      Cell: ({ row }) => {
        return row.values.saldoFinal > 0 ? (
          <span className="text-green-900">{row.values.cantidadEntrada}</span>
        ) : (
          <span className="text-red-500">{row.values.cantidadEntrada}</span>
        );
      },
    },
    {
      Header: "Salidas",
      accessor: "cantidadSalida",
      Cell: ({ row }) => {
        return row.values.saldoFinal > 0 ? (
          <span className="text-green-900">{row.values.cantidadSalida}</span>
        ) : (
          <span className="text-red-500">{row.values.cantidadSalida}</span>
        );
      },
    },
    {
      Header: "S.Final",
      accessor: "saldoFinal",
      Cell: ({ row }) => {
        return row.values.saldoFinal > 0 ? (
          <span className="text-green-900">{row.values.saldoFinal}</span>
        ) : (
          <span className="text-red-500">{row.values.saldoFinal}</span>
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
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <h2 className={Global.TituloH2}>Movimiento de Artículos</h2>
          <div className="flex  h-10">
            <div className={Global.LabelStyle}>
              <Checkbox
                id="conStock"
                name="conStock"
                checked={conStock}
                onChange={handleCheckboxChange}
              ></Checkbox>
            </div>
            <label
              htmlFor="todos"
              className={
                Global.InputStyle + " font-semibold !text-lg !p-1 !px-3"
              }
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
              onChange={FiltradoSelect}
              className={Global.InputStyle}
            >
              {tipoDeDocumento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.Input42pct}>
            <label htmlFor="fechaInicio" className={Global.LabelStyle}>
              Tipo
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              onChange={FiltradoFechaInicio}
              defaultValue={moment()
                .subtract(2, "years")
                .startOf("year")
                .format("yyyy-MM-DD")}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input42pct}>
            <label htmlFor="fechaFin" className={Global.LabelStyle}>
              Tipo
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              onChange={FiltradoFechaFin}
              defaultValue={moment(new Date()).format("yyyy-MM-DD")}
              className={Global.InputBoton}
            />
            <button
              id="buscar"
              className={Global.BotonBuscar}
              onClick={FiltradoButton}
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
  );
  //#endregion
};

export default MovimientosArticulos;
