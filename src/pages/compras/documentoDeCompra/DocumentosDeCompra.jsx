import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import Modal from "./Modal";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
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
  & th:nth-child(7),
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: center;
  }
  & th:last-child {
    max-width: 130px;
    text-align: center;
  }
`;
//#endregion

const DocumentosdeCompra = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio:
      moment().subtract(1, "years").startOf("year").format("yyyy") + "-01-01",
    fechaFin: moment().format("YYYY-MM-DD"),
    nombre: "",
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&proveedorNombre=${filtro.nombre}`
  );
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [objeto, setObjeto] = useState([]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    setCadena(
      `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&proveedorNombre=${filtro.nombre}`
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
    if (respuestaAlert) {
      Listar(cadena, index + 1);
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
    if (store.session.get("usuario") == "AD") {
      setVisible(true);
      setPermisos([true, true, true, true, true]);
      Listar(cadena, 1);
    } else {
      GetPermisos();
    }
  }, []);
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
      Listar(cadena, index + 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/Listar?Pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Compra/DocumentoCompra/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const result = await GetUsuarioId(
      store.session.get("usuarioId"),
      "DocumentoCompra"
    );
    setPermisos([
      result.registrar,
      result.modificar,
      result.eliminar,
      result.consultar,
      result.anular,
    ]);
  };
  const GetIsPermitido = async (accion, id) => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/IsPermitido?accion=${accion}&id=${id}`
    );
    if (!result.data.data) {
      toast.error(String(result.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 7000,
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

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar", accion = 0) => {
    setModo(modo);
    switch (accion) {
      case 0: {
        setObjeto({
          empresaId: "",
          proveedorId: "",
          proveedorNombre: "",
          tipoDocumentoId: "01",
          serie: "",
          numero: "",
          clienteId: "000000",
          fechaEmision: moment().format("YYYY-MM-DD"),
          fechaContable: moment().format("YYYY-MM-DD"),
          fechaVencimiento: moment().format("YYYY-MM-DD"),
          proveedorNumeroDocumentoIdentidad: "",
          proveedorDireccion: "",
          tipoCompraId: "CO",
          monedaId: "S",
          tipoCambio: 0,
          tipoPagoId: "EF",
          numeroOperacion: "",
          cuentaCorrienteId: "",
          documentoReferenciaId: "",
          abonar: true,
          motivoNotaId: "",
          motivoSustento: "",
          guiaRemision: "",
          observacion: "",
          subTotal: 0.0,
          porcentajeIGV: 18,
          montoIGV: 0.0,
          totalNeto: 0.0,
          total: 0.0,
          incluyeIGV: false,
          afectarStock: false,
          detalles: [],
          ordenesCompraRelacionadas: [],
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
        Header: "Fecha",
        accessor: "fechaContable",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YY");
        },
      },
      {
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YY");
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
        Header: "RUC",
        accessor: "proveedorNumero",
      },
      {
        Header: "M",
        accessor: "monedaId",
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right">{value}</p>;
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
        Header: "S",
        accessor: "afectarStock",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "O. Compra",
        accessor: "ordenCompra",
      },
      {
        Header: "G. Remisión",
        accessor: "guiaRemision",
      },
      {
        Header: "Acciones",
        accessor: "none",
        Cell: ({ row }) => (
          <BotonCRUD
            setRespuestaAlert={setRespuestaAlert}
            permisos={permisos}
            menu={["Compra", "DocumentoCompra"]}
            id={row.values.id}
            ClickConsultar={() => AbrirModal(row.values.id, "Consultar", 3)}
            ClickModificar={() => AbrirModal(row.values.id, "Modificar", 1)}
          />
        ),
      },
    ],
    []
  );
  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Documentos de Compra</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputFull}>
                <label
                  name="nombre"
                  className={Global.LabelStyle + Global.FiltroStyle}
                >
                  Proveedor
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Proveedor"
                  autoComplete="off"
                  value={filtro.nombre}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label
                  htmlFor="fechaInicio"
                  className={Global.LabelStyle + Global.FiltroStyle}
                >
                  Desde
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={filtro.fechaInicio}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label
                  htmlFor="fechaFin"
                  className={Global.LabelStyle + Global.FiltroStyle}
                >
                  Hasta
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={filtro.fechaFin}
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
                botonText="Registrar"
                botonClass={Global.BotonRegistrar}
                botonIcon={faPlus}
                click={() => AbrirModal()}
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
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default DocumentosdeCompra;
