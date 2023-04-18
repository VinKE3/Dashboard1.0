import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import moment from "moment";
// import Modal from "./Modal";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import store from "store2";
import Update from "../../../components/CRUD/Update";
import { toast } from "react-toastify";

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
  & th:nth-child(8) {
    width: 25px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const BloquearCompra = () => {
  //#region UseState
  const { usuario } = useAuth();
  const [objeto, setObjeto] = useState([]);
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
    console.log(usuario == "AD");
    if (store.session.get("usuario") == "AD") {
      setPermisos([false, false, true, false]);
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
    console.log("datos", datos);
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

  // useEffect(() => {
  //   modo;
  // }, [modo]);
  // useEffect(() => {
  //   if (!modal) {
  //     Listar(filtro, index + 1);
  //   }
  // }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);

  useEffect(() => {
    TipoDeDocumentos();
    Listar(filtro, 1);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/BloquearCompra/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
    console.log(objeto, "objeto");
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let anio = document.getElementById("anio").value;
    let mes = document.getElementById("mes").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (anio == new Date().getFullYear() && mes == 0) {
      Listar("", boton);
    } else {
      Listar(`&anio=${anio}&mes=${mes}`, boton);
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
      Listar("", index);
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
        Listar("", index);
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
        Listar("", index);
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
  //#endregion

  //#region Columnas y Selects
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
      Header: "Fecha Contable",
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
      Header: "Proveedor Numero",
      accessor: "proveedorNumero",
    },
    {
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Total",
      accessor: "total",
    },
    {
      Header: "Bloqueado",
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

  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <div className="flex justify-between">
          <h2 className={Global.TituloH2}>Bloquear Compra</h2>
          <div>
            <label htmlFor="todos" className={Global.LabelStyle}>
              {" "}
              Bloquear Todos{" "}
            </label>{" "}
            <Checkbox checked={checked} />
          </div>
        </div>

        {/* Filtro*/}
        <div className={Global.ContenedorFiltro}>
          <div className={Global.ContenedorInputFull}>
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
                  {" "}
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.ContenedorInput42pct}>
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
          <div className={Global.ContenedorInput42pct}>
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

        {/* Boton */}
        {/* {permisos[0] && (
          <BotonBasico
            botonText="Registrar"
            botonClass={Global.BotonRegistrar}
            botonIcon={faPlus}
            click={() => AbrirModal()}
          />
        )} */}
        {/* Boton */}

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
      {/* {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />} */}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default BloquearCompra;
