import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Put from "../../../components/funciones/Put";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import { Checkbox } from "primereact/checkbox";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { FaUndoAlt } from "react-icons/fa";
import moment from "moment";
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
  & th:nth-child(2) {
    width: 140px;
  }
  & th:nth-child(3) {
    width: 70px;
    text-align: center;
  }
  & th:nth-child(6),
  & th:nth-child(8) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(7) {
    width: 80px;
    text-align: right;
  }
  & th:last-child {
    text-align: center;
    width: 80px;
    max-width: 80px;
  }
`;
//#endregion

const BloquearCompra = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    tipoDocumentoId: "",
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
  });
  const [cadena, setCadena] = useState(
    `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [eliminar, setEliminar] = useState(false);
  const [tipoDeDocumento, setTipoDeDocumento] = useState([]);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&tipoDocumentoId=${filtro.tipoDocumentoId}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
    );
  }, [filtro]);
  useEffect(() => {
    if (visible) {
      Filtro();
    }
  }, [cadena]);
  useEffect(() => {
    if (eliminar) {
      setEliminar(false);
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
        TipoDeDocumentos();
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("BloquearCompra", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/BloquearCompra/Listar?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Compra/BloquearCompra/FormularioTablas`
    );
    const tiposDocumento = result.data.data.tiposDocumento.map((tipo) => ({
      id: tipo.id,
      descripcion: tipo.descripcion,
      abreviatura: tipo.abreviatura,
    }));
    setTipoDeDocumento(tiposDocumento);
  };
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
      tipoDocumentoId: "",
      fechaInicio: moment(
        dataGlobal == null ? "" : dataGlobal.fechaInicio
      ).format("YYYY-MM-DD"),
      fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
        "YYYY-MM-DD"
      ),
    });
    setIndex(0);
    document.getElementById("tipoDocumentoId").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones
  const Bloquear = async (id, isBloqueado) => {
    await Put(`Compra/BloquearCompra`, setEliminar, {
      ids: [id],
      isBloqueado: isBloqueado ? false : true,
    });
  };
  const BloquearTodo = async (ids, isBloqueado) => {
    const title = isBloqueado
      ? "Bloquear Registros de Compras (50 registros mostrados)"
      : "Desbloquear Registros de Compras (50 registros mostrados)";

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
    }).then(async (res) => {
      if (res.isConfirmed) {
        await Bloquear(ids, isBloqueado);
        setChecked(isBloqueado);
      } else {
        setChecked(!isBloqueado);
      }
    });
  };
  const Key = async (e) => {
    if (e.key == "Enter") {
      let row = document
        .querySelector("#tablaBloquearCompra")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        let bloqueado = row.children[7].firstChild.id == "true" ? true : false;
        Bloquear(id, bloqueado);
      }
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumento",
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
        Header: "B",
        accessor: "isBloqueado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center" id={value.toString()}>
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
            menu={["Compra", "BloquearCompra"]}
            id={row.values.id}
            ClickModificar={() =>
              Bloquear(row.values.id, row.values.isBloqueado)
            }
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
            <div className="flex items-center justify-between">
              <h2 className={G.TituloH2}>Bloquear Compra</h2>
              <div className="flex">
                <div className={G.CheckStyle}>
                  <Checkbox
                    inputId="isBloqueado"
                    name="isBloqueado"
                    onChange={(e) => {
                      BloquearTodo(
                        datos.map((d) => d.id),
                        e.checked
                      );
                    }}
                    checked={checked}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="isBloqueado"
                  className={G.LabelCheckStyle + " font-semibold"}
                >
                  Bloquear Todos
                </label>
              </div>
            </div>

            {/* Filtro*/}
            <div className={G.ContenedorInputsFiltro}>
              <div className={G.InputFull}>
                <label name="tipoDocumentoId" className={G.LabelStyle}>
                  Tipo de Documento:
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
                  autoFocus
                  value={filtro.tipoDocumentoId}
                  onChange={HandleData}
                  className={G.InputStyle}
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

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaBloquearCompra"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                KeyDown={(e) => Key(e)}
              />
            </DivTabla>
            {/* Tabla */}
          </div>
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default BloquearCompra;
