import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/Funciones/GetPermisos";
import Delete from "../../../components/Funciones/Delete";
import BotonBasico from "../../../components/Boton/BotonBasico";
import BotonCRUD from "../../../components/Boton/BotonCRUD";
import Table from "../../../components/Tabla/Table";
import { Checkbox } from "primereact/checkbox";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
  & th:nth-child(2),
  & th:nth-child(3),
  & th:nth-child(4) {
    width: 65px;
    text-align: center;
  }
  & th:nth-child(5) {
    width: 100px;
  }
  & th:nth-child(12) {
    width: 80px;
  }
  & th:nth-child(13) {
    width: 135px;
  }
  & th:nth-child(8),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(9) {
    width: 80px;
    text-align: right;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Cef = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [dataGlobal] = useState(store.session.get("global"));
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    proveedorNombre: "",
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&proveedorNombre=${filtro.proveedorNombre}&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);

  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (eliminar) {
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
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("CEF", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/CEF/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Compra/CEF/${id}`);
    setObjeto(result.data.data);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Compra/CEF/IsPermitido?accion=${accion}&id=${id}`
    );
    if (!result.data.data) {
      toast.error(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    } else {
      return true;
    }
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
  const AccionModal = async (id, modo = "Nuevo", accion = 0) => {
    setModo(modo);
    switch (accion) {
      case 0: {

        setObjeto({
          empresaId: "01",
          proveedorId: "",
          tipoDocumentoId: "CF",
          serie: "0001",
          numero: "",
          clienteId: "000000",
          numeroLetra: "",
          fechaRegistro: moment().format("yyyy-MM-DD"),
          fechaEmision: moment().format("yyyy-MM-DD"),
          fechaVencimiento: moment().format("yyyy-MM-DD"),
          proveedorNumeroDocumentoIdentidad: "",
          lugarGiro: "",
          plazo: 0,
          tipoCompraId: "CR",
          tipoPagoId: "EI",
          monedaId: "S",
          tipoCambio: 0,
          total: 0,
          documentoReferencia: "",
          detalles: [],
        });
        setModal(true);
        break;
      }
      case 1: {
        let valor = await GetIsPermitido(accion, id);
        if (valor) {
          await GetPorId(id);
          setModal(true);
        }
        break;
      }
      case 2: {
        let valor = await GetIsPermitido(accion, id);
        if (valor) {
          Delete(["Compra", "CEF"], id, setEliminar);
        }
        break;
      }
      case 3: {
        await GetPorId(id);
        setModal(true);
        break;
      }
      default:
        break;
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Registro",
        accessor: "fechaRegistro",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
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
        Header: "Vcmto.",
        accessor: "fechaVencimiento",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "L. Cambio",
        accessor: "numero",
      },
      {
        Header: "Proveedor",
        accessor: "proveedorNombre",
      },
      {
        Header: "RUC N°",
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
        Header: "C",
        accessor: "isCancelado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "B",
        accessor: "isBloqueado",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "Hora Reg",
        accessor: "horaRegistro",
        Cell: ({ value }) => {
          return <p className="text-center">{value}</p>;
        },
      },
      {
        Header: "F. Relacionadas",
        accessor: "facturasRelacionadas",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar", 3)}
            ClickModificar={() => AccionModal(row.values.id, "Modificar", 1)}
            ClickEliminar={() => AccionModal(row.values.id, "Eliminar", 2)}
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
      <div className="px-2">
        <h2 className={Global.TituloH2}>C.E.F</h2>

        {/* Filtro*/}
        <div className={Global.ContenedorFiltro}>
          <div className={Global.InputFull}>
            <label name="proveedorNombre" className={Global.LabelStyle}>
              Proveedor
            </label>
            <input
              type="text"
              id="proveedorNombre"
              name="proveedorNombre"
              placeholder="Proveedor"
              autoComplete="off"
              autoFocus
              value={filtro.proveedorNombre ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
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

        {/* Boton */}
        {permisos[0] && (
          <BotonBasico
            botonText="Nuevo"
            botonClass={Global.BotonRegistrar}
            botonIcon={faPlus}
            click={() => AccionModal()}
          />
        )}
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

      {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default Cef;
