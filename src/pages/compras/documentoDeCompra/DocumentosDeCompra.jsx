import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import Modal from "./Modal";
import moment from "moment";
import { ToastContainer } from "react-toastify";
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
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(filtro, index + 1);
      }
    }
  }, [modal]);
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
      setVisible(true);
      setPermisos([true, true, true, true, true]);
      Listar(filtro, 1);
    } else {
      GetPermisos();
    }
  }, []);
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
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let proveedor = document.getElementById("proveedorNombre").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (
      fechaInicio ==
        moment().subtract(1, "year").startOf("year").format("yyyy-MM-DD") &&
      fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
      proveedor == ""
    ) {
      Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
    } else {
      Listar(
        `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
        boton
      );
    }
  };
  const FiltradoProveedor = async (e) => {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let proveedor = e.target.value;
    clearTimeout(timer);
    if (proveedor != "") setIndex(0);
    setFiltro(
      `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
      index + 1
    );
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(1, "year").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        proveedor == ""
      ) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
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
    let proveedor = document.getElementById("proveedorNombre").value;
    setFiltro(
      `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
      index + 1
    );
    if (
      fechaInicio !=
      moment().subtract(1, "years").startOf("year").format("yyyy-MM-DD")
    )
      setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        proveedor == ""
      ) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
          index + 1
        );
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoFechaFin = (e) => {
    clearTimeout(timer);
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = e.target.value;
    let proveedor = document.getElementById("proveedorNombre").value;
    setFiltro(
      `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
      index + 1
    );
    if (fechaFin != moment(new Date()).format("yyyy-MM-DD")) setIndex(0);
    const newTimer = setTimeout(() => {
      if (
        fechaInicio ==
          moment().subtract(1, "years").startOf("year").format("yyyy-MM-DD") &&
        fechaFin == moment(new Date()).format("yyyy-MM-DD") &&
        proveedor == ""
      ) {
        Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, index + 1);
      } else {
        Listar(
          `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&proveedorNombre=${proveedor}`,
          index + 1
        );
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
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      setObjeto({
        empresaId: "",
        proveedorId: "",
        tipoDocumentoId: "",
        serie: "",
        numero: "",
        clienteId: "",
        fechaEmision: "",
        fechaContable: "",
        fechaVencimiento: "",
        proveedorNumeroDocumentoIdentidad: "",
        proveedorDireccion: "",
        tipoCompraId: "",
        monedaId: "",
        tipoCambio: 0,
        tipoPagoId: "",
        numeroOperacion: "",
        cuentaCorrienteId: "",
        documentoReferenciaId: "",
        abonar: false,
        motivoNotaId: "",
        motivoSustento: "",
        guiaRemision: "",
        observacion: "",
        subTotal: 0,
        porcentajeIGV: 0,
        montoIGV: 0,
        totalNeto: 0,
        total: 0,
        incluyeIGV: false,
        afectarStock: false,
        detalles: []
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

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
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Cliente"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
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
            <h2 className={Global.TituloH2}>Documentos de Compra</h2>

            {/* Filtro*/}
            <div className={Global.ContenedorFiltro}>
              <div className={Global.InputFull}>
                <label name="tipoDocumentoId" className={Global.LabelStyle}>
                  Proveedor
                </label>
                <input
                  type="text"
                  id="proveedorNombre"
                  name="proveedorNombre"
                  placeholder="Proveedor"
                  onChange={FiltradoProveedor}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInput42pct}>
                <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                  Desde
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  onChange={FiltradoFechaInicio}
                  defaultValue={moment()
                    .subtract(1, "year")
                    .startOf("year")
                    .format("yyyy-MM-DD")}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInput42pct}>
                <label htmlFor="fechaFin" className={Global.LabelStyle}>
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
                  className={Global.BotonBuscar}
                  onClick={FiltradoButton}
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
