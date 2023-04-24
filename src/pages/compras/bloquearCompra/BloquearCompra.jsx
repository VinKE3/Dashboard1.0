import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import Swal from "sweetalert2";
import { Checkbox } from "primereact/checkbox";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 160px;
  }
  & th:nth-child(3) {
    width: 100px;
  }
  & th:nth-child(6) {
    width: 50px;
    text-align: center;
  }
  & th:nth-child(7) {
    width: 90px;
    text-align: center;
  }
  & th:nth-child(8) {
    width: 50px;
    text-align: center;
  }
  & th:last-child {
    width: 80px;
    text-align: center;
  }
`;

const BloquearCompra = () => {
  //#region UseState
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [tipoDeDocumento, setTipoDeDocumento] = useState([]);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.entries(tipoDeDocumento).length > 0) {
      document.getElementById("tipoDocumentoId").value = -1;
    }
  }, [tipoDeDocumento]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
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
        Listar(filtro, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      TipoDeDocumentos();
      setVisible(true);
      setPermisos([false, true, false, false, false]);
      Listar(filtro, 1);
    } else {
      GetPermisos();
    }
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/BloquearCompra/Listar?pagina=${pagina}${filtro}`
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
    tiposDocumento.unshift({ id: "-1", descripcion: "TODOS" });
    setTipoDeDocumento(tiposDocumento);
  };
  const GetPermisos = async () => {
    const result = await GetUsuarioId(
      store.session.get("usuarioId"),
      "BloquearCompra"
    );
    setPermisos([false, result.modificar, false, false, false]);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoDocumento = document.getElementById("tipoDocumentoId").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
      tipoDocumento == -1
    ) {
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
    } else {
      if (tipoDocumento == -1) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
      } else {
        Listar(
          `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          boton
        );
      }
    }
  };
  const FiltradoSelect = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoDocumento = e.target.value;
    setFiltro(
      `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      index + 1
    );
    if (tipoDocumento != 0) setIndex(0);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
      tipoDocumento == -1
    ) {
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
    } else {
      if (tipoDocumento == -1) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          index + 1
        );
      }
    }
  };
  const FiltradoFechaInicio = (e) => {
    clearTimeout(timer);
    let fechaInicio = e.target.value;
    let fechaFin = document.getElementById("fechaFin").value;
    let tipoDocumento = document.getElementById("tipoDocumentoId").value;
    setFiltro(
      `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
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
        tipoDocumento == -1
      ) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        if (tipoDocumento == -1) {
          Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
        } else {
          Listar(
            `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
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
    let tipoDocumento = document.getElementById("tipoDocumentoId").value;
    setFiltro(
      `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      index + 1
    );
    if (fechaFin != moment(new Date()).format("yyyy-MM-DD")) setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        tipoDocumento == -1
      ) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        if (tipoDocumento == -1) {
          Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
        } else {
          Listar(
            `&tipoDocumentoId=${tipoDocumento}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
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
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region Funciones Modal
  const ModificarCheck = async (id, isBloqueado) => {
    let model = {
      ids: [id],
      isBloqueado: isBloqueado ? false : true,
    };
    const result = await ApiMasy.put(`api/Compra/BloquearCompra`, model);
    if (result.name == "AxiosError") {
      let err = "";
      if (result.response.data == "") {
        err = response.message;
      } else {
        err = String(result.response.data.messages[0].textos);
      }
      toast.error(err, {
        position: "bottom-right",
        autoClose: 7000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setRespuestaAlert(false);
    } else {
      setRespuestaAlert(true);
      toast.success(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 5000,
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
      ? "Bloquear Registros de Compras (50 registros mostrados)"
      : "Desbloquear Registros de Compras (50 registros mostrados)";
    const result = Swal.fire({
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
        ApiMasy.put(`api/Compra/BloquearCompra`, model).then((response) => {
          if (response.name == "AxiosError") {
            let err = "";
            if (response.response.data == "") {
              err = response.message;
            } else {
              err = String(response.response.data.messages[0].textos);
            }
            toast.error(err, {
              position: "bottom-right",
              autoClose: 7000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setRespuestaAlert(false);
          } else {
            setRespuestaAlert(true);
            toast.success(String(response.data.messages[0].textos), {
              position: "bottom-right",
              autoClose: 5000,
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
    setRespuestaAlert(true);
  };
  const ValidarCheckTotal = (e, ids) => {
    if (e.checked) {
      ModificarCheckAll(ids, true);
    } else {
      ModificarCheckAll(ids, false);
    }
  };
  //#endregion

  //#region Columnas
  const columnas = [
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
        return moment(value).format("DD/MM/YYYY");
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
      Header: "Mon",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ value }) => {
        return <p className="text-end">{value}</p>;
      },
    },
    {
      Header: "B",
      accessor: "isBloqueado",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            {" "}
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
          menu={["Compra", "BloquearCompra"]}
          id={row.values.id}
          ClickModificar={() =>
            ModificarCheck(row.values.id, row.values.isBloqueado)
          }
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className="px-2">
            <div className="flex items-center justify-between">
              <h2 className={Global.TituloH2}>Bloquear Compra</h2>
              <div className="flex">
                <div className={Global.CheckStyle}>
                  <Checkbox
                    inputId="isBloqueado"
                    name="isBloqueado"
                    onChange={(e) => {
                      ValidarCheckTotal(
                        e,
                        datos.map((d) => d.id)
                      );
                    }}
                    checked={checked}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="isBloqueado"
                  className={
                    Global.LabelCheckStyle + " font-semibold"
                  }
                >
                  Bloquear Todos
                </label>
              </div>
            </div>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputFull}>
                <label name="tipoDocumentoId" className={Global.LabelStyle + Global.FiltroStyle}>
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
                      {" "}
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="fechaInicio" className={Global.LabelStyle + Global.FiltroStyle}>
                  Desde
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
                <label htmlFor="fechaFin" className={Global.LabelStyle + Global.FiltroStyle}>
                  Hasta
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
                  className={Global.BotonBuscar + Global.Anidado + Global.BotonPrimary}
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
