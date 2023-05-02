import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const CuentasPorPagar = () => {
  //#region useState
  const { usuario, usuarioId } = useAuth();
  const [datos, setDatos] = useState([]);
  const [objeto, setObjeto] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [tipo, setTipo] = useState("todos");
  const filtroInicial =
    "&fechaInicio=" +
    moment().subtract(1, "year").startOf("year").format("yyyy-MM-DD") +
    "&fechaFin=" +
    moment().format("YYYY-MM-DD");

  //#endregion

  //#region useEffect
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setPermisos([true, true, true, true, true]);
      Listar(filtroInicial, 1);
    } else {
      //?Consulta a la Api para traer los permisos
      GetPermisos();
      Listar(filtroInicial, 1);
    }
  }, [usuario]);

  useEffect(() => {
    modo;
  }, [modo]);
  useEffect(() => {
    if (!modal) {
      Listar(filtroInicial, index + 1);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtroInicial, index + 1);
    }
  }, [respuestaAlert]);

  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorPagar/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    console.log(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/CuentaPorPagar/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const permiso = await GetUsuarioId(usuarioId, "CuentaPorPagar");
    setPermisos([
      permiso.registrar,
      permiso.modificar,
      permiso.eliminar,
      permiso.consultar,
      permiso.anular,
    ]);
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
      Listar(`&clienteNombre=${filtro}`, boton);
    } else {
      Listar(
        `&clienteNombre=${filtro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        boton
      );
    }
  };
  const FiltradoKeyPress = async (e) => {
    clearTimeout(timer);
    let filtro = e.target.value;
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    setFiltro(
      `&clienteNombre=${filtro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
    const newTimer = setTimeout(() => {
      if (filtro == "") {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `&clienteNombre=${filtro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          index + 1
        );
      }
    }, 200);
    setTimer(newTimer);
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
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let model = {
        id: id,
      };
      setObjeto(model);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion
  const datosFiltrados =
    tipo === "todos"
      ? datos
      : tipo === "soloDeuda"
      ? datos.filter((dato) => dato.saldo > 0 && dato.saldo <= dato.total)
      : datos.filter((dato) => dato.abonado === dato.total);

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Fecha",
      accessor: "fechaContable",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Vencimiento",
      accessor: "fechaVencimiento",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "N° Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "Proveedor",
      accessor: "proveedorNombre",
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
      Header: "Abonado",
      accessor: "abonado",
    },
    {
      Header: "Saldo",
      accessor: "saldo",
    },
    {
      Header: "Cancelado",
      accessor: "isCancelado",
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
          menu={["Compra", "CuentasPorPagar"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        /> //?Se envia el id de la fila
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <h2 className={Global.TituloH2}>Cuentas Por Pagar</h2>
          <div className="flex gap-3 items-center">
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <RadioButton
                    inputId="todos"
                    name="todos"
                    value="todos"
                    onChange={(e) => setTipo(e.target.value)}
                    checked={tipo === "todos"}
                  />
                </div>
                <label htmlFor="todos" className={Global.InputStyle}>
                  Todos
                </label>
              </div>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="soloDeuda"
                  name="soloDeuda"
                  value="soloDeuda"
                  onChange={(e) => setTipo(e.target.value)}
                  checked={tipo === "soloDeuda"}
                />
              </div>
              <label htmlFor="soloDeuda" className={Global.InputStyle}>
                Deudas
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="soloCancelado"
                  name="soloCancelado"
                  value="soloCancelado"
                  onChange={(e) => setTipo(e.target.value)}
                  checked={tipo === "soloCancelado"}
                />
              </div>
              <label htmlFor="soloCancelado" className={Global.InputStyle}>
                Cancelados
              </label>
            </div>
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
        <FiltroBasico
          textLabel={"Proveedor"}
          inputPlaceHolder={"Proveedor"}
          inputId={"clienteNombre"}
          inputName={"clienteNombre"}
          inputMax={"200"}
          botonId={"buscar"}
          FiltradoButton={FiltradoButton}
          FiltradoKeyPress={FiltradoKeyPress}
        />
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
            datos={datosFiltrados}
            total={total}
            index={index}
            Click={(e) => FiltradoPaginado(e)}
          />
        </TablaStyle>
        {/* Tabla */}
      </div>

      {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default CuentasPorPagar;