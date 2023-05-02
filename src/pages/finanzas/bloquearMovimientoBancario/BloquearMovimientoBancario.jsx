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
import { RadioButton } from "primereact/radiobutton";
import store from "store2";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    width: 50px;
  }
  & th:nth-child(6) {
    width: 50px;
  }
  & th:nth-child(7) {
    width: 50px;
    text-align: center;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const BloquearMovimientoBancario = () => {
  //#region UseState
  const { usuario } = useAuth();
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [checked, setChecked] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setPermisos([false, true, false, false]);
      Listar(filtro, 1);
    } else {
      //Consulta a la Api para traer los permisos
    }
  }, [usuario]);

  useEffect(() => {
    datos;
  }, [datos]);

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
    Listar(filtro, 1);
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
  const FiltradoPaginado = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (
      fechaInicio ==
        moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD")
    ) {
      Listar("", boton);
    } else {
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
    }
  };
  const FiltradoFechaInicio = (e) => {
    clearTimeout(timer);
    let fechaInicio = e.target.value;
    let fechaFin = document.getElementById("fechaFin").value;
    setFiltro(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
    if (
      fechaInicio !=
      moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD")
    )
      setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD")
      ) {
        Listar("", index);
      } else {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      }
    }, 1000);
    setTimer(newTimer);
  };

  const FiltradoFechaFin = (e) => {
    clearTimeout(timer);
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = e.target.value;
    setFiltro(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
    if (fechaFin != moment(new Date()).format("yyyy-MM-DD")) setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD")
      ) {
        Listar("", index);
      } else {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
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
  //#endregion

  //#region Funciones Modal
  const ModificarCheck = async (id, isBloqueado) => {
    let model = {
      ids: [id],
      isBloqueado: isBloqueado ? false : true,
    };
    const result = await ApiMasy.put(
      `api/Finanzas/BloquearMovimientoBancario`,
      model
    );
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
      ? "Bloquear 50 registros de movimientos bancarios"
      : "Desbloquear 50 registros de movimientos bancarios";
    const result = Swal.fire({
      title: title,
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1E1F25",
      confirmButtonColor: "#EE8100",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiMasy.put(`api/Finanzas/BloquearMovimientoBancario`, model).then(
          (response) => {
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
          }
        );
      }
    });
    setRespuestaAlert(true);
  };

  const handleChange = (e, ids) => {
    setChecked(e.checked);
    if (e.checked) {
      ModificarCheckAll(ids, true);
    } else {
      ModificarCheckAll(ids, false);
    }
  };

  //#endregion

  //#region Columnas y Selects
  const columnas = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Fecha Emision",
      accessor: "fechaEmision",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
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
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Monto",
      accessor: "monto",
    },
    {
      Header: "Bloqueado",
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
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <h2 className={Global.TituloH2}>Bloquear Movimiento Bancario</h2>
          <div className="flex h-10">
            <div className={Global.LabelStyle}>
              <Checkbox
                id="isBloqueado"
                name="isBloqueado"
                onChange={(e) => {
                  handleChange(
                    e,
                    datos.map((d) => d.id)
                  );
                }}
                checked={checked}
              />
            </div>
            <label
              htmlFor="todos"
              className={
                Global.InputStyle + " font-semibold !text-lg !p-1 !px-3"
              }
            >
              Bloquear Todos
            </label>
          </div>
        </div>
        {/* Filtro*/}
        <div className={Global.ContenedorFiltro}>
          <div className={Global.InputFull}>
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
          <div className={Global.InputFull}>
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
      <ToastContainer />
    </>
  );
  //#endregion
};

export default BloquearMovimientoBancario;
