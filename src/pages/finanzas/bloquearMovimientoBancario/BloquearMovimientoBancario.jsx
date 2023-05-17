import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { Checkbox } from "primereact/checkbox";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
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
  & th:nth-child(2) {
    width: 70px;
    text-align: center;
  }
  & th:nth-child(5),
  & th:nth-child(7) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(6){
    text-align: right;
  }
  & th:last-child {
    width: 80px;
    max-width: 80px;
    text-align: center;
  }
`;
//#endregion

const BloquearMovimientoBancario = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
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
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    setCadena(
      `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
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
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("BloquearMovimientoBancario", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/BloquearMovimientoBancario/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
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

  //#region Funciones Modal
  const ModificarCheck = async (id, isBloqueado) => {
    let model = {
      ids: [id],
      isBloqueado: isBloqueado ? false : true,
    };
    const result = await ApiMasy.put(`api/Finanzas/BloquearMovimientoBancario`, model);
    if (result.name == "AxiosError") {
      let err = "";
      if (result.response.data == "") {
        err = response.message;
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
      Listar(cadena, index + 1);
      toast.success(String(result.data.messages[0].textos), {
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
  const ModificarCheckAll = async (ids, isBloqueado) => {
    let model = {
      ids: ids,
      isBloqueado: isBloqueado,
    };
    const title = isBloqueado
      ? "Bloquear Registros de Movimientos (50 registros mostrados)"
      : "Desbloquear Registros de Movimientos (50 registros mostrados)";

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
        ApiMasy.put(`api/Finanzas/BloquearMovimientoBancario`, model).then((response) => {
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
            toast.info(String(response.data.messages[0].textos), {
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
        setChecked(isBloqueado);
      } else {
        setChecked(!isBloqueado);
      }
    });
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
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "N° Operacion",
        accessor: "numeroOperacion",
      },
      {
        Header: "Concepto",
        accessor: "concepto",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Monto",
        accessor: "monto",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: "B",
        accessor: "isBloqueado",
        Cell: ({ value }) => {
          return value ? (
            <div className="flex justify-center">
              <Checkbox checked={true} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Checkbox checked={false} />
            </div>
          );
        },
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setRespuestaAlert={setRespuestaAlert}
            permisos={permisos}
            menu={["Finanzas", "BloquearMovimientoBancario"]}
            id={row.values.id}
            ClickModificar={() =>
              ModificarCheck(row.values.id, row.values.isBloqueado)
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
          <div className="px-2">
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Bloquear Movimientos Bancarios</h2>
              <div className="flex">
                <div className={Global.CheckStyle}>
                  <Checkbox
                    inputId="isBloqueado"
                    name="isBloqueado"
                    onChange={(e) => {
                      ModificarCheckAll(
                        datos.map((d) => d.id),
                        e.checked
                      );
                    }}
                    checked={checked}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="isBloqueado"
                  className={Global.LabelCheckStyle + " font-semibold"}
                >
                  Bloquear Todos
                </label>
              </div>
            </div>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>

              <div className={Global.InputMitad}>
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
              <div className={Global.InputMitad}>
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
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default BloquearMovimientoBancario;